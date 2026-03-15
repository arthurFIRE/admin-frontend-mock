import { mockStore } from '../mock/store';
import type { Faq } from '../types';

export interface FaqsQuery {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  status?: string;
}

export const faqsApi = {
  getAll: (params: FaqsQuery) => mockStore.getFaqs(params),
  create: (data: Omit<Faq, 'id' | 'createdAt' | 'updatedAt'>) => mockStore.createFaq(data),
  update: (id: string, data: Partial<Faq>) => mockStore.updateFaq(id, data),
  remove: (id: string) => mockStore.deleteFaq(id),
};
