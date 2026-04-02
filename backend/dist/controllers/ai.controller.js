"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ai_service_1 = require("../services/ai.service");
const community_service_1 = require("../services/community.service");
const logger_1 = __importDefault(require("../utils/logger"));
class AIController {
    static async processRequest(req, res, next) {
        try {
            const { feature, data, communityId } = req.body;
            const config = ai_service_1.AI_CONFIG[feature];
            let context = "No specific club context provided.";
            if (communityId) {
                const fullData = await community_service_1.communityService.getFullCommunityData(communityId);
                if (fullData) {
                    const { community, members } = fullData;
                    const memberDetails = members.map(m => `${m.name} (${m.interests.join(", ")})`);
                    context = `Club: ${community.name}. Description: ${community.description}. Members: ${memberDetails.join(", ")}.`;
                }
            }
            let prompt;
            if (feature === 'connect') {
                const connectConfig = config;
                prompt = connectConfig.schema(context, data.members || []);
            }
            else {
                const standardConfig = config;
                prompt = standardConfig.schema(context, data.description || '', data.clubName || '');
            }
            const result = await ai_service_1.aiService.callOpenAI(config.system, prompt);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('AI Controller Error: %s', error.message);
            next(error);
        }
    }
}
exports.AIController = AIController;
//# sourceMappingURL=ai.controller.js.map