
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function testConnection() {
    try {
        console.log("Checking Firestore connection...");
        const snapshot = await db.collection('communities').limit(1).get();
        console.log("✅ Successfully connected to Firestore!");
        console.log(`Communities found: ${snapshot.size}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Firestore connection failed:");
        console.error(err);
        process.exit(1);
    }
}

testConnection();
