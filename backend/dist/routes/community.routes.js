"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const community_controller_1 = require("../controllers/community.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const ai_schema_1 = require("../models/ai.schema");
const router = (0, express_1.Router)();
router.get('/', (0, validate_middleware_1.validate)(ai_schema_1.CommunityRequestSchema), community_controller_1.CommunityController.getCommunityData);
exports.default = router;
//# sourceMappingURL=community.routes.js.map