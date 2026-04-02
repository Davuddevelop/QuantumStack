"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityController = void 0;
const community_service_1 = require("../services/community.service");
const logger_1 = __importDefault(require("../utils/logger"));
class CommunityController {
    static async getCommunityData(req, res, next) {
        try {
            const communityId = req.query.id;
            const data = await community_service_1.communityService.getFullCommunityData(communityId);
            if (!data) {
                return res.status(404).json({ error: 'Community not found' });
            }
            res.json(data);
        }
        catch (error) {
            logger_1.default.error('Community Controller Error: %s', error.message);
            next(error);
        }
    }
}
exports.CommunityController = CommunityController;
//# sourceMappingURL=community.controller.js.map