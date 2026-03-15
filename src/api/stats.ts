import { mockStore } from '../mock/store';
import type { User, Notice } from '../types';

export interface StatsResponse {
  users: { total: number; adminCount: number; userCount: number; activeCount: number; inactiveCount: number; };
  notices: { total: number; publishedCount: number; draftCount: number; };
  recentUsers: User[];
  recentNotices: Notice[];
}

export const statsApi = {
  getSummary: (): Promise<StatsResponse> => mockStore.getStats(),
};
