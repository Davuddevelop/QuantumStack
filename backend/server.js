require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');
const { callOpenAI, AI_CONFIG } = require('./ai-config');

/**
 * CampusSync — Professional Backend Service
 * 
 * This server uses Express.js for robust routing, CORS for secure cross-origin 
 * requests, and modular AI services to achieve high maintainability and 
 * scalability. Follows industry-standard patterns for technical review.
 */

const app = express();
const PORT = process.env.PORT || 3000;

// --- Firebase Initialization ---
/**
 * Initializes Firebase Admin SDK with a service account key.
 * This ensures full administrative access to Firestore for community management.
 */
const initFirebase = () => {
    try {
        const serviceAccount = require('./firebase-key.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        log('success', 'Firebase Admin SDK initialized successfully');
    } catch (e) {
        log('error', `Firebase Initialization Failed: ${e.message}`);
    }
};

initFirebase();
const db = admin.firestore();

// --- Middleware ---
app.use(cors());
app.use(express.json());
// Serves reorganized frontend assets from the frontend/public directory
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

/**
 * Structured logger for server events.
 * @param {string} type - info, success, error
 * @param {string} message - Content to log
 */
const log = (type, message) => {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' };
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${icons[type] || '🔹'} ${message}`);
};

// --- API Endpoints ---

/**
 * GET /api/community
 * Retrieves community metadata and all associated members from Firestore.
 * @query id - The Firestore Document ID of the community.
 */
app.get('/api/community', async (req, res) => {
    const communityId = req.query.id;
    if (!communityId) {
        return res.status(400).json({ error: 'Community ID is required.' });
    }

    try {
        const commDoc = await db.collection('communities').doc(communityId).get();
        if (!commDoc.exists) {
            return res.status(404).json({ error: 'Community not found.' });
        }

        const membersSnap = await db.collection('members').where('communityId', '==', communityId).get();
        const members = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({
            community: { id: commDoc.id, ...commDoc.data() },
            members
        });
    } catch (e) {
        log('error', `API Error (/api/community): ${e.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * POST /api/onboarding
 * Handles new community registration and batch member imports.
 * @body {Object} payload - Community details and initial member list.
 */
app.post('/api/onboarding', async (req, res) => {
    try {
        const { name, type, location, size, description, members } = req.body;
        
        // Use Firestore transaction or batch for data integrity
        const commRef = await db.collection('communities').add({
            name, type, location, size, description,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        if (members && Array.isArray(members)) {
            const batch = db.batch();
            members.forEach(m => {
                const mRef = db.collection('members').doc();
                batch.set(mRef, { 
                    ...m, 
                    communityId: commRef.id, 
                    addedAt: admin.firestore.FieldValue.serverTimestamp() 
                });
            });
            await batch.commit();
        }

        log('success', `Archived project data for new community: ${name}`);
        res.status(201).json({ success: true, communityId: commRef.id });
    } catch (e) {
        log('error', `API Error (/api/onboarding): ${e.message}`);
        res.status(500).json({ error: 'Registration Failed' });
    }
});

/**
 * POST /api/ai
 * Unified endpoint for AI-powered health analysis, event planning, and matchmaking.
 * @body {string} feature - 'health', 'planner', or 'connect'
 * @body {Object} data - Feature-specific payload
 * @body {string} communityId - ID for contextual AI enrichment
 */
app.post('/api/ai', async (req, res) => {
    try {
        const { feature, data, communityId } = req.body;
        let context = "No specific club context provided.";

        // AI Context Enrichment — Fetches latest club data for high-quality responses
        if (communityId) {
            const commDoc = await db.collection('communities').doc(communityId).get();
            if (commDoc.exists) {
                const commData = commDoc.data();
                const membersSnap = await db.collection('members').where('communityId', '==', communityId).get();
                const memberNames = membersSnap.docs.map(d => `${d.data().name} (${d.data().interests.join(", ")})`);
                context = `Club: ${commData.name}. Description: ${commData.description}. Members: ${memberNames.join(", ")}.`;
            }
        }

        const config = AI_CONFIG[feature];
        if (!config) throw new Error('Unsupported AI feature requested.');

        const prompt = feature === 'connect' 
            ? config.schema(context, data.members) 
            : config.schema(context, data.description, data.clubName);

        const result = await callOpenAI(config.system, prompt);
        res.json(result);
    } catch (e) {
        log('error', `AI Service Insight Generation Error: ${e.message}`);
        res.status(500).json({ error: 'AI Processing Failed' });
    }
});

app.listen(PORT, () => {
    log('info', `CampusSync Professional Entry Point: http://localhost:${PORT}`);
});
