import { firebaseService } from './firebase.service';
import logger from '../utils/logger';

export interface Community {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
}

export interface Member {
  id: string;
  name: string;
  interests: string[];
  communityId: string;
  [key: string]: any;
}

class CommunityService {
  private get db() {
    return firebaseService.getDb();
  }

  public async getCommunityById(id: string): Promise<Community | null> {
    try {
      const doc = await this.db.collection('communities').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as Community;
    } catch (error) {
      logger.error('Error fetching community %s: %s', id, (error as Error).message);
      throw error;
    }
  }

  public async getMembersByCommunityId(communityId: string): Promise<Member[]> {
    try {
      const snapshot = await this.db
        .collection('members')
        .where('communityId', '==', communityId)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
    } catch (error) {
      logger.error('Error fetching members for community %s: %s', communityId, (error as Error).message);
      throw error;
    }
  }

  public async getFullCommunityData(id: string) {
    const community = await this.getCommunityById(id);
    if (!community) return null;

    const members = await this.getMembersByCommunityId(id);
    return { community, members };
  }
}

export const communityService = new CommunityService();
