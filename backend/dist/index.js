"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// Security Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Disable CSP for serving static frontend if needed
}));
// CORS Configuration
app.use((0, cors_1.default)({
    origin: config_1.config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Request Parsing
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
// Logging
app.use((0, morgan_1.default)('combined', {
    stream: { write: (message) => logger_1.default.info(message.trim()) },
}));
// Static Files
app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', 'public')));
// API Routes
app.use('/api', routes_1.default);
// Base Route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error Handling
app.use(error_middleware_1.errorMiddleware);
// Server Start
if (config_1.config.nodeEnv !== 'test') {
    app.listen(config_1.config.port, () => {
        logger_1.default.info(`QuantumStack Backend running on port ${config_1.config.port} [${config_1.config.nodeEnv}]`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map