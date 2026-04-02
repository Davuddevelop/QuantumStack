"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
    },
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? [process.env.FRONTEND_URL || 'https://your-domain.vercel.app']
            : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    },
};
//# sourceMappingURL=index.js.map