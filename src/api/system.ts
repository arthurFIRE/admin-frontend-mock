import { mockStore } from '../mock/store';
import type { SystemSettings, AccessRule, LoginPolicy, VisitorStat, DailySalesStat, MonthlySalesStat } from '../types';

export const systemApi = {
  getSettings: (): Promise<SystemSettings> => mockStore.getSystemSettings(),
  updateSettings: (data: Partial<SystemSettings>): Promise<SystemSettings> => mockStore.updateSystemSettings(data),

  getAccessRules: (params: { page: number; limit: number; search?: string; type?: string; status?: string }) =>
    mockStore.getAccessRules(params),
  createAccessRule: (data: Omit<AccessRule, 'id' | 'createdAt'>) => mockStore.createAccessRule(data),
  updateAccessRule: (id: string, data: Partial<AccessRule>) => mockStore.updateAccessRule(id, data),
  deleteAccessRule: (id: string) => mockStore.deleteAccessRule(id),

  getLoginPolicy: (): Promise<LoginPolicy> => mockStore.getLoginPolicy(),
  updateLoginPolicy: (data: Partial<LoginPolicy>): Promise<LoginPolicy> => mockStore.updateLoginPolicy(data),
};

export const visitorStatsApi = {
  getStats: (params: { startDate: string; endDate: string }): Promise<VisitorStat[]> =>
    mockStore.getVisitorStats(params),
};

export const salesStatsApi = {
  getDaily: (params: { startDate: string; endDate: string }): Promise<DailySalesStat[]> =>
    mockStore.getDailySalesStats(params),
  getMonthly: (params: { year: number }): Promise<MonthlySalesStat[]> =>
    mockStore.getMonthlySalesStats(params),
};
