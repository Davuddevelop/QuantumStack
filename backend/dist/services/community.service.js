"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityService = void 0;
const firebase_service_1 = require("./firebase.service");
const logger_1 = __importDefault(require("../utils/logger"));
class CommunityService {
    get db() {
        return firebase_service_1.firebaseService.getDb();
    }
    async getCommunityById(id) {
        try {
            const doc = await this.db.collection('communities').doc(id).get();
            if (!doc.exists)
                return null;
            return { id: doc.id, ...doc.data() };
        }
        catch (error) {
            logger_1.default.error('Error fetching community %s: %s', id, error.message);
            throw error;
        }
    }
    async getMembersByCommunityId(communityId) {
        try {
            const snapshot = await this.db
                .collection('members')
                .where('communityId', '==', communityId)
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        catch (error) {
            logger_1.default.error('Error fetching members for community %s: %s', communityId, error.message);
            throw error;
        }
    }
    async getFullCommunityData(id) {
        const community = await this.getCommunityById(id);
        if (!community)
            return null;
        const members = await this.getMembersByCommunityId(id);
        return { community, members };
    }
}
exports.communityService = new CommunityService();
//# sourceMappingURL=community.service.js.map