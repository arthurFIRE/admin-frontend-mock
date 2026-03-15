import type { AuthUser } from '../types';
import { authStore } from '../store/authStore';

export interface LoginPayload { loginId: string; password: string; }
export interface LoginResponse { accessToken: string; refreshToken: string; user: AuthUser; }
export interface UpdateProfilePayload { name?: string; email?: string; }
export interface ChangePasswordPayload { currentPassword: string; newPassword: string; }

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// 아무 값이나 입력해도 로그인 성공
export const authApi = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    await delay();
    const user: AuthUser = {
      id: 'u-001',
      loginId: data.loginId || 'admin',
      email: `${data.loginId || 'admin'}@example.com`,
      name: data.loginId === 'admin' ? '관리자' : data.loginId,
      role: 'admin',
    };
    return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', user };
  },
  refresh: async (): Promise<LoginResponse> => {
    const user = authStore.getUser()!;
    return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', user };
  },
  logout: async () => { await delay(200); },
  me: async (): Promise<AuthUser> => authStore.getUser()!,
  updateProfile: async (data: UpdateProfilePayload): Promise<AuthUser> => {
    await delay(300);
    return { ...authStore.getUser()!, ...data };
  },
  changePassword: async (_data: ChangePasswordPayload): Promise<void> => { await delay(300); },
};
