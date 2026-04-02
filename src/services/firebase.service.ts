import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import logger from '../utils/logger';

class FirebaseService {
  private db: admin.firestore.Firestore | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      let credential;

      if (config.firebase.projectId && config.firebase.privateKey) {
        credential = admin.credential.cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey,
        });
        logger.info('Using Firebase credentials from environment variables');
      } else {
        const localKeyPath = path.join(__dirname, '..', '..', 'firebase-key.json');
        if (fs.existsSync(localKeyPath)) {
          const serviceAccount = require(localKeyPath);
          credential = admin.credential.cert(serviceAccount);
          logger.info('Using Firebase credentials from local file');
        } else {
          logger.warn('No Firebase credentials available - Database operations will fail');
        }
      }

      if (credential) {
        admin.initializeApp({ credential });
        this.db = admin.firestore();
        logger.info('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      logger.error('Firebase Initialization Failed: %s', (error as Error).message);
    }
  }

  public getDb(): admin.firestore.Firestore {
    if (!this.db) {
      throw new Error('Firebase service not initialized');
    }
    return this.db;
  }
}

export const firebaseService = new FirebaseService();
