import { mockStore } from '../mock/store';
import type { Banner } from '../types';

export interface BannersQuery {
  type: 'main' | 'popup';
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export const bannersApi = {
  getAll: (params: BannersQuery) => mockStore.getBanners(params),
  create: (data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => mockStore.createBanner(data),
  update: (id: string, data: Partial<Banner>) => mockStore.updateBanner(id, data),
  remove: (id: string) => mockStore.deleteBanner(id),
};
