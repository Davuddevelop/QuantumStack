"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_routes_1 = __importDefault(require("./ai.routes"));
const community_routes_1 = __importDefault(require("./community.routes"));
const router = (0, express_1.Router)();
router.use('/ai', ai_routes_1.default);
router.use('/community', community_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map