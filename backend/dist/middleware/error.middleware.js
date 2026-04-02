"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorMiddleware = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    logger_1.default.error('API Error: [%s] %s %s', status, req.method, req.url, {
        message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map