"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseService = void 0;
const admin = __importStar(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../utils/logger"));
class FirebaseService {
    db = null;
    constructor() {
        this.initialize();
    }
    initialize() {
        try {
            let credential;
            if (config_1.config.firebase.projectId && config_1.config.firebase.privateKey) {
                credential = admin.credential.cert({
                    projectId: config_1.config.firebase.projectId,
                    clientEmail: config_1.config.firebase.clientEmail,
                    privateKey: config_1.config.firebase.privateKey,
                });
                logger_1.default.info('Using Firebase credentials from environment variables');
            }
            else {
                const localKeyPath = path_1.default.join(__dirname, '..', '..', 'firebase-key.json');
                if (fs_1.default.existsSync(localKeyPath)) {
                    const serviceAccount = require(localKeyPath);
                    credential = admin.credential.cert(serviceAccount);
                    logger_1.default.info('Using Firebase credentials from local file');
                }
                else {
                    logger_1.default.warn('No Firebase credentials available - Database operations will fail');
                }
            }
            if (credential) {
                admin.initializeApp({ credential });
                this.db = admin.firestore();
                logger_1.default.info('Firebase Admin SDK initialized successfully');
            }
        }
        catch (error) {
            logger_1.default.error('Firebase Initialization Failed: %s', error.message);
        }
    }
    getDb() {
        if (!this.db) {
            throw new Error('Firebase service not initialized');
        }
        return this.db;
    }
}
exports.firebaseService = new FirebaseService();
//# sourceMappingURL=firebase.service.js.map