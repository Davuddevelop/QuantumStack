const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

/**
 * CampusSync Server
 * Zero-dependency Node.js backend with Firebase Admin integration.
 * Built for premium performance and scalability.
 */

// --- Firebase Configuration & Initialization ---
const initFirebase = () => {
  try {
    const serviceAccountPath = path.join(__dirname, 'firebase-key.json');
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('firebase-key.json not found');
    }
    const serviceAccount = require(serviceAccountPath);
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

// --- Environment Variable Management ---
/**
 * Loads environment variables from a .env file into process.env.
 * Simple zero-dependency implementation.
 */
const loadEnv = () => {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }
};

loadEnv();
const API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3000;

// --- Utility Functions ---

/**
 * Structured logger for server operations.
 * @param {'info'|'success'|'error'|'warn'} type 
 * @param {string} message 
 */
function log(type, message) {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' };
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${icons[type] || '🔹'} ${message}`);
}

/**
 * Reusable helper for calling OpenAI Chat Completions API.
 * @param {string} systemPrompt 
 * @param {string} userPrompt 
 * @returns {Promise<Object>} Parsed JSON response from AI.
 */
async function callOpenAI(systemPrompt, userPrompt) {
  const payload = JSON.stringify({
    model: 'gpt-4o',
    max_tokens: 1500,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const text = parsed.choices[0].message.content;
          const clean = text.replace(/```json|```/g, '').trim();
          resolve(JSON.parse(clean));
        } catch (e) {
          reject(new Error(`AI Parse Error: ${e.message}`));
        }
      });
    });
    req.on('error', err => reject(new Error(`Network Error: ${err.message}`)));
    req.write(payload);
    req.end();
  });
}

// --- AI Service Prompts ---
const AI_CONFIG = {
  health: {
    system: "You are an expert community health analyst for university clubs. Return ONLY valid JSON.",
    schema: (context, desc, name) => `
      Context: ${context}
      Club: ${name}
      Activity: ${desc}
      Return JSON: { "overallScore": 0-100, "engagementRate": 0-100, "retentionRisk": "Low/Med/High", "breakdown": { "memberEngagement": 0, "eventConsistency": 0, "communication": 0, "leadershipLoad": 0, "newMemberIntegration": 0 }, "risks": [{ "level": "critical/warning/strength", "text": "..." }], "actions": [{ "priority": "HIGH/MEDIUM/LOW", "title": "...", "why": "..." }] }`
  },
  planner: {
    system: "You are an AI Event Strategist for university clubs. Return ONLY valid JSON.",
    schema: (context, desc, name) => `
      Context: ${context}
      Club: ${name}
      Idea: ${desc}
      Return JSON: { "title": "...", "headline": "...", "description": "...", "targetAudience": "...", "goals": [], "timeline": [{ "when": "...", "task": "..." }], "checklist": [], "runOfShow": [{ "time": "...", "activity": "...", "owner": "...", "notes": "..." }] }`
  },
  connect: {
    system: "You are a Community Connection AI. Return ONLY valid JSON.",
    schema: (context, members) => `
      Context: ${context}
      Members: ${JSON.stringify(members)}
      Return JSON: { "connections": [{ "member1": "...", "member2": "...", "reason": "...", "sharedInterests": [], "introMessage": "..." }] }`
  }
};

// --- HTTP Server Definition ---
const server = http.createServer(async (req, res) => {
  // Global Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const reqPath = url.pathname;

  // --- 1. Static File Server ---
  if (req.method === 'GET' && !reqPath.startsWith('/api')) {
    const publicDir = path.join(__dirname, 'campussync', 'public');
    const safePath = reqPath === '/' ? '/index.html' : reqPath;
    const filePath = path.join(publicDir, safePath);

    if (!filePath.startsWith(publicDir)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      const ext = path.extname(filePath);
      const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
      res.end(data);
    });
    return;
  }

  // --- 2. API Endpoints ---

  // GET /api/community?id=...
  if (req.method === 'GET' && reqPath === '/api/community') {
    const communityId = url.searchParams.get('id');
    if (!communityId) {
      res.writeHead(400); res.end(JSON.stringify({ error: 'ID required' }));
      return;
    }

    try {
      const commDoc = await db.collection('communities').doc(communityId).get();
      if (!commDoc.exists) {
        res.writeHead(404); res.end(JSON.stringify({ error: 'Not found' }));
        return;
      }

      const membersSnap = await db.collection('members').where('communityId', '==', communityId).get();
      const members = [];
      membersSnap.forEach(doc => members.push({ id: doc.id, ...doc.data() }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ community: { id: commDoc.id, ...commDoc.data() }, members }));
    } catch (e) {
      log('error', `API Error (/api/community): ${e.message}`);
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // POST /api/onboarding
  if (req.method === 'POST' && reqPath === '/api/onboarding') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const commRef = await db.collection('communities').add({
          name: payload.name, type: payload.type, location: payload.location, 
          size: payload.size, description: payload.description,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        if (payload.members && Array.isArray(payload.members)) {
          const batch = db.batch();
          payload.members.forEach(m => {
            const mRef = db.collection('members').doc();
            batch.set(mRef, { ...m, communityId: commRef.id, addedAt: admin.firestore.FieldValue.serverTimestamp() });
          });
          await batch.commit();
        }

        log('success', `New community created: ${payload.name}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, communityId: commRef.id }));
      } catch (e) {
        log('error', `API Error (/api/onboarding): ${e.message}`);
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // POST /api/ai
  if (req.method === 'POST' && reqPath === '/api/ai') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { feature, data, communityId } = JSON.parse(body);
        let context = "No specific club context provided.";

        if (communityId) {
          const commDoc = await db.collection('communities').doc(communityId).get();
          if (commDoc.exists) {
            const commData = commDoc.data();
            const membersSnap = await db.collection('members').where('communityId', '==', communityId).get();
            const memberNames = [];
            membersSnap.forEach(d => memberNames.push(`${d.data().name} (${d.data().interests.join(", ")})`));
            context = `Club: ${commData.name}. Description: ${commData.description}. Members: ${memberNames.join(", ")}.`;
          }
        }

        const config = AI_CONFIG[feature];
        if (!config) throw new Error('Unsupported AI feature');

        const prompt = feature === 'connect' 
          ? config.schema(context, data.members) 
          : config.schema(context, data.description, data.clubName);

        const result = await callOpenAI(config.system, prompt);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        log('error', `AI Service Error (${req.url}): ${e.message}`);
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404); res.end('Endpoint not found');
});

server.listen(PORT, () => {
  log('info', `CampusSync running at http://localhost:${PORT}`);
});
