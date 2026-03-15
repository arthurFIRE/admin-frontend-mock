export interface User {
  id: string;
  loginId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  status: 'published' | 'draft';
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupPermission {
  menuKey: string;
  menuLabel: string;
  menuCategory: string;
  canRead: boolean;
  canWrite: boolean;
}

export interface Banner {
  id: string;
  type: 'main' | 'popup';
  title: string;
  imageUrl: string;
  linkUrl: string;
  order: number;
  status: 'active' | 'inactive';
  startDate: string;
  endDate: string;
  displayCondition?: 'always' | 'once';
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface VisitorStat {
  date: string;
  visitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSessionSec: number;
}

export interface DailySalesStat {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface MonthlySalesStat {
  month: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  growthRate: number;
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  timezone: string;
}

export interface AccessRule {
  id: string;
  ipAddress: string;
  description: string;
  type: 'allow' | 'deny';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface LoginPolicy {
  passwordMinLength: number;
  requireUppercase: boolean;
  requireSpecialChar: boolean;
  requireNumber: boolean;
  maxLoginAttempts: number;
  lockoutDurationMin: number;
  sessionTimeoutMin: number;
  require2FA: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthUser {
  id: string;
  loginId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
