import { mockStore } from '../mock/store';
import type { User, PaginatedResponse } from '../types';

export interface UserQuery { page?: number; limit?: number; search?: string; role?: 'admin' | 'user'; status?: 'active' | 'inactive'; }
export interface CreateUserPayload { loginId: string; email: string; password: string; name: string; role?: 'admin' | 'user'; status?: 'active' | 'inactive'; }
export interface UpdateUserPayload { loginId?: string; email?: string; name?: string; role?: 'admin' | 'user'; status?: 'active' | 'inactive'; }

export const usersApi = {
  getAll: (params: UserQuery): Promise<PaginatedResponse<User>> =>
    mockStore.getUsers({ page: params.page ?? 1, limit: params.limit ?? 10, search: params.search, role: params.role, status: params.status }),
  getOne: (id: string): Promise<User> => mockStore.getUser(id),
  create: (data: CreateUserPayload): Promise<User> =>
    mockStore.createUser({ loginId: data.loginId, email: data.email, name: data.name, role: data.role ?? 'user', status: data.status ?? 'active' }),
  update: (id: string, data: UpdateUserPayload): Promise<User> => mockStore.updateUser(id, data),
  resetPassword: (_id: string, _newPassword: string): Promise<void> =>
    new Promise((r) => setTimeout(r, 300)),
  remove: (id: string): Promise<void> => mockStore.deleteUser(id),
};
