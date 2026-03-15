import { mockStore } from '../mock/store';
import { authStore } from '../store/authStore';
import type { Notice, PaginatedResponse } from '../types';

export interface NoticeQuery { page?: number; limit?: number; search?: string; status?: 'published' | 'draft'; isPinned?: boolean; }
export interface CreateNoticePayload { title: string; content: string; isPinned?: boolean; status?: 'published' | 'draft'; }
export type UpdateNoticePayload = Partial<CreateNoticePayload>;

export const noticesApi = {
  getAll: (params: NoticeQuery): Promise<PaginatedResponse<Notice>> =>
    mockStore.getNotices({ page: params.page ?? 1, limit: params.limit ?? 10, search: params.search, status: params.status }),
  getOne: (_id: string): Promise<Notice> => { throw new Error('not implemented'); },
  create: (data: CreateNoticePayload): Promise<Notice> => {
    const author = authStore.getUser()!;
    return mockStore.createNotice(
      { title: data.title, content: data.content, isPinned: data.isPinned ?? false, status: data.status ?? 'draft' },
      { id: author.id, loginId: author.loginId, email: author.email, name: author.name, role: author.role, status: 'active', createdAt: '', updatedAt: '' },
    );
  },
  update: (id: string, data: UpdateNoticePayload): Promise<Notice> => mockStore.updateNotice(id, data),
  remove: (id: string): Promise<void> => mockStore.deleteNotice(id),
};
