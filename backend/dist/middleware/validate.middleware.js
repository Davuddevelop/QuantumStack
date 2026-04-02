"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            logger_1.default.warn('Validation error: %o', error.issues);
            return res.status(400).json({
                error: 'Validation failed',
                details: error.issues.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        return next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map