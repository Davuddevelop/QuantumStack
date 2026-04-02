"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityRequestSchema = exports.AIRequestSchema = void 0;
const zod_1 = require("zod");
exports.AIRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        feature: zod_1.z.enum(['health', 'planner', 'connect']),
        communityId: zod_1.z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid format').optional(),
        data: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
    }),
});
exports.CommunityRequestSchema = zod_1.z.object({
    query: zod_1.z.object({
        id: zod_1.z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid format'),
    }),
});
//# sourceMappingURL=ai.schema.js.map