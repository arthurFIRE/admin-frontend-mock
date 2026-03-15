import type { User, Notice, Group, Banner, Faq, SystemSettings, AccessRule, LoginPolicy } from '../types';

// ── 샘플 사용자 데이터 ──────────────────────────────────────────
const INITIAL_USERS: User[] = [
  {
    id: 'u-001',
    loginId: 'admin',
    email: 'admin@admin.com',
    name: '관리자',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'u-002',
    loginId: 'kim_dev',
    email: 'kim@example.com',
    name: '김개발',
    role: 'user',
    status: 'active',
    createdAt: '2025-02-10T09:00:00.000Z',
    updatedAt: '2025-02-10T09:00:00.000Z',
  },
  {
    id: 'u-003',
    loginId: 'lee_design',
    email: 'lee@example.com',
    name: '이디자인',
    role: 'user',
    status: 'active',
    createdAt: '2025-03-05T11:30:00.000Z',
    updatedAt: '2025-03-05T11:30:00.000Z',
  },
  {
    id: 'u-004',
    loginId: 'park_pm',
    email: 'park@example.com',
    name: '박기획',
    role: 'user',
    status: 'inactive',
    createdAt: '2025-04-12T14:00:00.000Z',
    updatedAt: '2025-04-20T10:00:00.000Z',
  },
  {
    id: 'u-005',
    loginId: 'choi_admin',
    email: 'choi@example.com',
    name: '최부관리자',
    role: 'admin',
    status: 'active',
    createdAt: '2025-05-20T08:00:00.000Z',
    updatedAt: '2025-05-20T08:00:00.000Z',
  },
  {
    id: 'u-006',
    loginId: 'yoon_user',
    email: 'yoon@example.com',
    name: '윤사용자',
    role: 'user',
    status: 'active',
    createdAt: '2025-06-01T13:00:00.000Z',
    updatedAt: '2025-06-01T13:00:00.000Z',
  },
  {
    id: 'u-007',
    loginId: 'jung_user',
    email: 'jung@example.com',
    name: '정회원',
    role: 'user',
    status: 'active',
    createdAt: '2025-07-15T16:00:00.000Z',
    updatedAt: '2025-07-15T16:00:00.000Z',
  },
  {
    id: 'u-008',
    loginId: 'han_user',
    email: 'han@example.com',
    name: '한일반',
    role: 'user',
    status: 'inactive',
    createdAt: '2025-08-22T10:30:00.000Z',
    updatedAt: '2025-09-01T09:00:00.000Z',
  },
  {
    id: 'u-009',
    loginId: 'shin_dev',
    email: 'shin@example.com',
    name: '신개발자',
    role: 'user',
    status: 'active',
    createdAt: '2025-09-10T09:00:00.000Z',
    updatedAt: '2025-09-10T09:00:00.000Z',
  },
  {
    id: 'u-010',
    loginId: 'oh_user',
    email: 'oh@example.com',
    name: '오회원',
    role: 'user',
    status: 'active',
    createdAt: '2025-10-05T11:00:00.000Z',
    updatedAt: '2025-10-05T11:00:00.000Z',
  },
  {
    id: 'u-011',
    loginId: 'lim_user',
    email: 'lim@example.com',
    name: '임사용자',
    role: 'user',
    status: 'active',
    createdAt: '2025-11-20T14:00:00.000Z',
    updatedAt: '2025-11-20T14:00:00.000Z',
  },
  {
    id: 'u-012',
    loginId: 'song_user',
    email: 'song@example.com',
    name: '송멤버',
    role: 'user',
    status: 'active',
    createdAt: '2025-12-01T09:30:00.000Z',
    updatedAt: '2025-12-01T09:30:00.000Z',
  },
];

// ── 샘플 공지사항 데이터 ───────────────────────────────────────
const adminUser = INITIAL_USERS[0];

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n-001',
    title: '[공지] 서비스 이용약관 개정 안내',
    content: '안녕하세요.\n서비스 이용약관이 2025년 2월 1일부로 개정됩니다.\n주요 변경사항을 확인해주세요.',
    isPinned: true,
    status: 'published',
    authorId: 'u-001',
    author: adminUser,
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: 'n-002',
    title: '[공지] 시스템 정기점검 안내 (2025.02.15)',
    content: '2025년 2월 15일 오전 2시~6시 정기 점검이 있을 예정입니다.\n서비스 이용에 불편을 드려 죄송합니다.',
    isPinned: true,
    status: 'published',
    authorId: 'u-001',
    author: adminUser,
    createdAt: '2025-02-05T10:00:00.000Z',
    updatedAt: '2025-02-05T10:00:00.000Z',
  },
  {
    id: 'n-003',
    title: '신규 기능 업데이트 안내',
    content: '이번 업데이트에서는 대시보드 통계 기능이 추가되었습니다.',
    isPinned: false,
    status: 'published',
    authorId: 'u-001',
    author: adminUser,
    createdAt: '2025-03-01T11:00:00.000Z',
    updatedAt: '2025-03-01T11:00:00.000Z',
  },
  {
    id: 'n-004',
    title: '이벤트: 스프링 할인 프로모션',
    content: '봄맞이 특별 할인 이벤트를 진행합니다. 3월 한 달간 20% 할인 혜택을 누리세요!',
    isPinned: false,
    status: 'published',
    authorId: 'u-001',
    author: adminUser,
    createdAt: '2025-03-15T09:00:00.000Z',
    updatedAt: '2025-03-15T09:00:00.000Z',
  },
  {
    id: 'n-005',
    title: '4월 서비스 업데이트 예정 (임시저장)',
    content: '4월에 예정된 업데이트 내용을 정리 중입니다.',
    isPinned: false,
    status: 'draft',
    authorId: 'u-001',
    author: adminUser,
    createdAt: '2025-03-20T14:00:00.000Z',
    updatedAt: '2025-03-20T14:00:00.000Z',
  },
  {
    id: 'n-006',
    title: '사용자 가이드 업데이트',
    content: '사용자 가이드가 업데이트되었습니다. 새로운 기능 사용법을 확인해보세요.',
    isPinned: false,
    status: 'published',
    authorId: 'u-001',
    author: adminUser,
    createdAt: '2025-04-10T10:00:00.000Z',
    updatedAt: '2025-04-10T10:00:00.000Z',
  },
  {
    id: 'n-007',
    title: '보안 업데이트 완료',
    content: '최신 보안 패치가 적용되었습니다. 안전한 서비스 이용 환경을 제공합니다.',
    isPinned: false,
    status: 'published',
    authorId: 'u-001',
    author: adminUser,
    createdAt: '2025-05-01T08:00:00.000Z',
    updatedAt: '2025-05-01T08:00:00.000Z',
  },
  {
    id: 'n-008',
    title: '여름 이벤트 준비 중 (임시저장)',
    content: '여름 이벤트 내용을 준비 중입니다.',
    isPinned: false,
    status: 'draft',
    authorId: 'u-001',
    author: adminUser,
    createdAt: '2025-05-20T15:00:00.000Z',
    updatedAt: '2025-05-20T15:00:00.000Z',
  },
];

// ── 그룹 데이터 ──────────────────────────────────────────────
const INITIAL_GROUPS: Group[] = [
  { id: 'g-001', name: '슈퍼관리자', description: '모든 권한을 가진 최상위 그룹', memberCount: 2, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'g-002', name: '운영팀', description: '콘텐츠 및 사용자 관리 담당', memberCount: 5, createdAt: '2025-01-15T00:00:00.000Z', updatedAt: '2025-01-15T00:00:00.000Z' },
  { id: 'g-003', name: '마케팅팀', description: '배너 및 이벤트 관리 담당', memberCount: 3, createdAt: '2025-02-01T00:00:00.000Z', updatedAt: '2025-02-01T00:00:00.000Z' },
  { id: 'g-004', name: '분석팀', description: '통계 및 리포트 조회 전용', memberCount: 4, createdAt: '2025-02-15T00:00:00.000Z', updatedAt: '2025-02-15T00:00:00.000Z' },
  { id: 'g-005', name: '뷰어', description: '읽기 전용 접근 그룹', memberCount: 8, createdAt: '2025-03-01T00:00:00.000Z', updatedAt: '2025-03-01T00:00:00.000Z' },
];

export const MENU_ITEMS = [
  { key: 'dashboard', label: '대시보드', category: '대시보드' },
  { key: 'users', label: '사용자 목록', category: '사용자 관리' },
  { key: 'users.groups.list', label: '그룹 목록', category: '사용자 관리' },
  { key: 'users.groups.permissions', label: '권한 설정', category: '사용자 관리' },
  { key: 'notices', label: '공지사항', category: '콘텐츠 관리' },
  { key: 'content.banner.main', label: '메인 배너', category: '콘텐츠 관리' },
  { key: 'content.banner.popup', label: '팝업 배너', category: '콘텐츠 관리' },
  { key: 'content.faq', label: 'FAQ', category: '콘텐츠 관리' },
  { key: 'stats.visitors', label: '방문 통계', category: '통계' },
  { key: 'stats.sales.daily', label: '일별 매출', category: '통계' },
  { key: 'stats.sales.monthly', label: '월별 매출', category: '통계' },
  { key: 'system.settings', label: '환경 설정', category: '시스템' },
  { key: 'system.security.access', label: '접근 권한', category: '시스템' },
  { key: 'system.security.policy', label: '로그인 정책', category: '시스템' },
];

const ALL_KEYS = MENU_ITEMS.map((m) => m.key);
const CONTENT_WRITE_KEYS = ['users', 'notices', 'content.banner.main', 'content.banner.popup', 'content.faq'];
const MARKETING_READ_KEYS = ['dashboard', 'content.banner.main', 'content.banner.popup', 'content.faq', 'stats.visitors', 'stats.sales.daily', 'stats.sales.monthly'];
const MARKETING_WRITE_KEYS = ['content.banner.main', 'content.banner.popup', 'content.faq'];
const STATS_READ_KEYS = ['dashboard', 'stats.visitors', 'stats.sales.daily', 'stats.sales.monthly'];
const VIEWER_READ_KEYS = ['dashboard', 'notices'];

type PermMap = Record<string, Record<string, { canRead: boolean; canWrite: boolean }>>;

const INITIAL_PERMISSIONS: PermMap = {
  'g-001': Object.fromEntries(ALL_KEYS.map((k) => [k, { canRead: true, canWrite: true }])),
  'g-002': Object.fromEntries(ALL_KEYS.map((k) => [k, { canRead: true, canWrite: CONTENT_WRITE_KEYS.includes(k) }])),
  'g-003': Object.fromEntries(ALL_KEYS.map((k) => [k, { canRead: MARKETING_READ_KEYS.includes(k), canWrite: MARKETING_WRITE_KEYS.includes(k) }])),
  'g-004': Object.fromEntries(ALL_KEYS.map((k) => [k, { canRead: STATS_READ_KEYS.includes(k), canWrite: false }])),
  'g-005': Object.fromEntries(ALL_KEYS.map((k) => [k, { canRead: VIEWER_READ_KEYS.includes(k), canWrite: false }])),
};

// ── 배너 데이터 ─────────────────────────────────────────────
const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b-001', type: 'main', title: '봄 시즌 프로모션',
    imageUrl: 'https://placehold.co/1200x400/4096ff/ffffff?text=Spring+Promotion',
    linkUrl: '/events/spring', order: 1, status: 'active',
    startDate: '2025-03-01', endDate: '2025-03-31',
    createdAt: '2025-02-20T00:00:00.000Z', updatedAt: '2025-02-20T00:00:00.000Z',
  },
  {
    id: 'b-002', type: 'main', title: '신규 회원 혜택',
    imageUrl: 'https://placehold.co/1200x400/52c41a/ffffff?text=New+Member+Benefits',
    linkUrl: '/events/new-member', order: 2, status: 'active',
    startDate: '2025-01-01', endDate: '2025-12-31',
    createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'b-003', type: 'main', title: '여름 할인 이벤트 (준비중)',
    imageUrl: 'https://placehold.co/1200x400/faad14/ffffff?text=Summer+Sale',
    linkUrl: '/events/summer', order: 3, status: 'inactive',
    startDate: '2025-06-01', endDate: '2025-08-31',
    createdAt: '2025-03-10T00:00:00.000Z', updatedAt: '2025-03-10T00:00:00.000Z',
  },
  {
    id: 'b-004', type: 'popup', title: '개인정보처리방침 개정 안내',
    imageUrl: 'https://placehold.co/600x400/ff4d4f/ffffff?text=Privacy+Policy',
    linkUrl: '/policy/privacy', order: 1, status: 'active',
    startDate: '2025-02-01', endDate: '2025-03-31',
    displayCondition: 'once',
    createdAt: '2025-01-25T00:00:00.000Z', updatedAt: '2025-01-25T00:00:00.000Z',
  },
  {
    id: 'b-005', type: 'popup', title: '설 연휴 휴무 안내',
    imageUrl: 'https://placehold.co/600x400/722ed1/ffffff?text=Holiday+Notice',
    linkUrl: '', order: 2, status: 'inactive',
    startDate: '2025-01-27', endDate: '2025-01-30',
    displayCondition: 'always',
    createdAt: '2025-01-20T00:00:00.000Z', updatedAt: '2025-01-20T00:00:00.000Z',
  },
];

// ── FAQ 데이터 ──────────────────────────────────────────────
const INITIAL_FAQS: Faq[] = [
  { id: 'f-001', category: '이용방법', question: '회원가입은 어떻게 하나요?', answer: '홈페이지 상단의 "회원가입" 버튼을 클릭하여 이메일 또는 소셜 계정으로 가입하실 수 있습니다.', order: 1, status: 'published', createdAt: '2025-01-05T00:00:00.000Z', updatedAt: '2025-01-05T00:00:00.000Z' },
  { id: 'f-002', category: '이용방법', question: '비밀번호를 잊어버렸어요. 어떻게 하나요?', answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하시면 가입 시 등록한 이메일로 재설정 링크를 보내드립니다.', order: 2, status: 'published', createdAt: '2025-01-05T00:00:00.000Z', updatedAt: '2025-01-05T00:00:00.000Z' },
  { id: 'f-003', category: '결제', question: '결제 방법에는 어떤 것이 있나요?', answer: '신용카드, 체크카드, 계좌이체, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다.', order: 1, status: 'published', createdAt: '2025-01-10T00:00:00.000Z', updatedAt: '2025-01-10T00:00:00.000Z' },
  { id: 'f-004', category: '결제', question: '결제 취소 및 환불은 어떻게 하나요?', answer: '구매일로부터 7일 이내 미사용 상품에 한해 환불이 가능합니다. 고객센터로 문의해 주세요.', order: 2, status: 'published', createdAt: '2025-01-10T00:00:00.000Z', updatedAt: '2025-01-10T00:00:00.000Z' },
  { id: 'f-005', category: '서비스', question: '서비스 이용 시간은 어떻게 되나요?', answer: '24시간 365일 이용 가능합니다. 단, 정기 점검 시간(매월 둘째 주 화요일 새벽 2시~4시)에는 서비스가 중단됩니다.', order: 1, status: 'published', createdAt: '2025-01-15T00:00:00.000Z', updatedAt: '2025-01-15T00:00:00.000Z' },
  { id: 'f-006', category: '서비스', question: '모바일에서도 이용할 수 있나요?', answer: '네, iOS와 Android 앱을 지원합니다. 앱스토어 또는 구글플레이에서 앱을 다운로드하세요.', order: 2, status: 'published', createdAt: '2025-01-15T00:00:00.000Z', updatedAt: '2025-01-15T00:00:00.000Z' },
  { id: 'f-007', category: '기타', question: '고객센터 운영 시간은 어떻게 되나요?', answer: '평일 오전 9시부터 오후 6시까지 운영합니다. 주말 및 공휴일은 이메일로 문의해 주세요.', order: 1, status: 'published', createdAt: '2025-02-01T00:00:00.000Z', updatedAt: '2025-02-01T00:00:00.000Z' },
  { id: 'f-008', category: '기타', question: '기업 회원 서비스도 있나요? (초안)', answer: '기업 맞춤형 서비스를 준비 중입니다.', order: 2, status: 'draft', createdAt: '2025-02-10T00:00:00.000Z', updatedAt: '2025-02-10T00:00:00.000Z' },
];

// ── 시스템 설정 ────────────────────────────────────────────
let _systemSettings: SystemSettings = {
  siteName: '어드민 관리 시스템',
  siteDescription: '효율적인 서비스 운영을 위한 통합 관리 플랫폼입니다.',
  adminEmail: 'admin@admin.com',
  supportPhone: '02-1234-5678',
  maintenanceMode: false,
  timezone: 'Asia/Seoul',
};

// ── 접근 권한 데이터 ───────────────────────────────────────
const INITIAL_ACCESS_RULES: AccessRule[] = [
  { id: 'ar-001', ipAddress: '192.168.1.0/24', description: '사내 네트워크 대역', type: 'allow', status: 'active', createdAt: '2025-01-01T00:00:00.000Z' },
  { id: 'ar-002', ipAddress: '10.0.0.0/8', description: 'VPN 내부망', type: 'allow', status: 'active', createdAt: '2025-01-01T00:00:00.000Z' },
  { id: 'ar-003', ipAddress: '203.0.113.45', description: '알려진 악성 IP', type: 'deny', status: 'active', createdAt: '2025-02-15T00:00:00.000Z' },
  { id: 'ar-004', ipAddress: '198.51.100.0/24', description: '임시 차단 대역', type: 'deny', status: 'inactive', createdAt: '2025-03-01T00:00:00.000Z' },
];

// ── 로그인 정책 ────────────────────────────────────────────
let _loginPolicy: LoginPolicy = {
  passwordMinLength: 8,
  requireUppercase: true,
  requireSpecialChar: true,
  requireNumber: true,
  maxLoginAttempts: 5,
  lockoutDurationMin: 30,
  sessionTimeoutMin: 120,
  require2FA: false,
};

// ── 통계 데이터 생성 헬퍼 ──────────────────────────────────
function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDailyStats(dateStr: string, index: number) {
  const date = new Date(dateStr);
  const dow = date.getDay(); // 0=Sun, 6=Sat
  const isWeekend = dow === 0 || dow === 6;
  const base = isWeekend ? 1.4 : 1.0;
  const r = seededRand(index);
  const visitors = Math.round((1200 + r * 1800) * base);
  const uniqueVisitors = Math.round(visitors * (0.6 + seededRand(index + 1000) * 0.2));
  const pageViews = Math.round(visitors * (3 + seededRand(index + 2000) * 2));
  const avgSessionSec = Math.round(180 + seededRand(index + 3000) * 240);
  return { date: dateStr, visitors, uniqueVisitors, pageViews, avgSessionSec };
}

function generateDailySales(dateStr: string, index: number) {
  const date = new Date(dateStr);
  const dow = date.getDay();
  const isWeekend = dow === 0 || dow === 6;
  const base = isWeekend ? 1.5 : 1.0;
  const r = seededRand(index + 5000);
  const orders = Math.round((80 + r * 220) * base);
  const avgOrderValue = Math.round(25000 + seededRand(index + 6000) * 35000);
  const revenue = orders * avgOrderValue;
  return { date: dateStr, revenue, orders, avgOrderValue };
}

function buildDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const cur = new Date(startDate);
  const end = new Date(endDate);
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// ── 인메모리 스토어 ────────────────────────────────────────────
let _users: User[] = [...INITIAL_USERS];
let _notices: Notice[] = [...INITIAL_NOTICES];
let _groups: Group[] = [...INITIAL_GROUPS];
let _permissions: PermMap = JSON.parse(JSON.stringify(INITIAL_PERMISSIONS));
let _banners: Banner[] = [...INITIAL_BANNERS];
let _faqs: Faq[] = [...INITIAL_FAQS];
let _accessRules: AccessRule[] = [...INITIAL_ACCESS_RULES];
let _idCounter = 100;

const nextId = (prefix: string) => `${prefix}-${++_idCounter}`;
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

export const mockStore = {
  // ── Users ──
  async getUsers(params: { page: number; limit: number; search?: string; role?: string; status?: string }) {
    await delay();
    let list = [..._users];
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((u) => u.loginId.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (params.role) list = list.filter((u) => u.role === params.role);
    if (params.status) list = list.filter((u) => u.status === params.status);
    const total = list.length;
    const start = (params.page - 1) * params.limit;
    const data = list.slice(start, start + params.limit);
    return { data, total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) };
  },

  async getUser(id: string) {
    await delay();
    const user = _users.find((u) => u.id === id);
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    return user;
  },

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    if (_users.find((u) => u.loginId === data.loginId))
      throw Object.assign(new Error(), { response: { data: { message: '이미 사용 중인 아이디입니다.' } } });
    if (_users.find((u) => u.email === data.email))
      throw Object.assign(new Error(), { response: { data: { message: '이미 사용 중인 이메일입니다.' } } });
    const user: User = { ...data, id: nextId('u'), createdAt: now(), updatedAt: now() };
    _users = [user, ..._users];
    return user;
  },

  async updateUser(id: string, data: Partial<User>) {
    await delay();
    const idx = _users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('사용자를 찾을 수 없습니다.');
    if (data.loginId && data.loginId !== _users[idx].loginId && _users.find((u) => u.loginId === data.loginId))
      throw Object.assign(new Error(), { response: { data: { message: '이미 사용 중인 아이디입니다.' } } });
    if (data.email && data.email !== _users[idx].email && _users.find((u) => u.email === data.email))
      throw Object.assign(new Error(), { response: { data: { message: '이미 사용 중인 이메일입니다.' } } });
    _users = _users.map((u, i) => (i === idx ? { ...u, ...data, updatedAt: now() } : u));
    return _users[idx];
  },

  async deleteUser(id: string) {
    await delay();
    _users = _users.filter((u) => u.id !== id);
  },

  // ── Notices ──
  async getNotices(params: { page: number; limit: number; search?: string; status?: string }) {
    await delay();
    let list = [..._notices].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q));
    }
    if (params.status) list = list.filter((n) => n.status === params.status);
    const total = list.length;
    const start = (params.page - 1) * params.limit;
    const data = list.slice(start, start + params.limit);
    return { data, total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) };
  },

  async createNotice(data: Pick<Notice, 'title' | 'content' | 'isPinned' | 'status'>, author: User) {
    await delay();
    const notice: Notice = { ...data, id: nextId('n'), authorId: author.id, author, createdAt: now(), updatedAt: now() };
    _notices = [notice, ..._notices];
    return notice;
  },

  async updateNotice(id: string, data: Partial<Pick<Notice, 'title' | 'content' | 'isPinned' | 'status'>>) {
    await delay();
    const idx = _notices.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error('공지사항을 찾을 수 없습니다.');
    _notices = _notices.map((n, i) => (i === idx ? { ...n, ...data, updatedAt: now() } : n));
    return _notices[idx];
  },

  async deleteNotice(id: string) {
    await delay();
    _notices = _notices.filter((n) => n.id !== id);
  },

  // ── Groups ──
  async getGroups(params: { page: number; limit: number; search?: string }) {
    await delay();
    let list = [..._groups];
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
    const total = list.length;
    const start = (params.page - 1) * params.limit;
    const data = list.slice(start, start + params.limit);
    return { data, total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) };
  },

  async createGroup(data: Pick<Group, 'name' | 'description'>) {
    await delay();
    if (_groups.find((g) => g.name === data.name))
      throw Object.assign(new Error(), { response: { data: { message: '이미 존재하는 그룹 이름입니다.' } } });
    const group: Group = { ...data, id: nextId('g'), memberCount: 0, createdAt: now(), updatedAt: now() };
    _groups = [group, ..._groups];
    _permissions[group.id] = Object.fromEntries(ALL_KEYS.map((k) => [k, { canRead: false, canWrite: false }]));
    return group;
  },

  async updateGroup(id: string, data: Pick<Group, 'name' | 'description'>) {
    await delay();
    const idx = _groups.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('그룹을 찾을 수 없습니다.');
    if (data.name !== _groups[idx].name && _groups.find((g) => g.name === data.name))
      throw Object.assign(new Error(), { response: { data: { message: '이미 존재하는 그룹 이름입니다.' } } });
    _groups = _groups.map((g, i) => (i === idx ? { ...g, ...data, updatedAt: now() } : g));
    return _groups[idx];
  },

  async deleteGroup(id: string) {
    await delay();
    _groups = _groups.filter((g) => g.id !== id);
    delete _permissions[id];
  },

  // ── Permissions ──
  async getGroupPermissions(groupId: string) {
    await delay();
    const perms = _permissions[groupId] ?? {};
    return MENU_ITEMS.map((m) => ({
      menuKey: m.key,
      menuLabel: m.label,
      menuCategory: m.category,
      canRead: perms[m.key]?.canRead ?? false,
      canWrite: perms[m.key]?.canWrite ?? false,
    }));
  },

  async updateGroupPermissions(groupId: string, updates: { menuKey: string; canRead: boolean; canWrite: boolean }[]) {
    await delay();
    if (!_permissions[groupId]) _permissions[groupId] = {};
    updates.forEach(({ menuKey, canRead, canWrite }) => {
      _permissions[groupId][menuKey] = { canRead, canWrite };
    });
    return true;
  },

  // ── Banners ──
  async getBanners(params: { type: 'main' | 'popup'; page: number; limit: number; search?: string; status?: string }) {
    await delay();
    let list = _banners.filter((b) => b.type === params.type).sort((a, b) => a.order - b.order);
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q));
    }
    if (params.status) list = list.filter((b) => b.status === params.status);
    const total = list.length;
    const start = (params.page - 1) * params.limit;
    const data = list.slice(start, start + params.limit);
    return { data, total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) };
  },

  async createBanner(data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const banner: Banner = { ...data, id: nextId('b'), createdAt: now(), updatedAt: now() };
    _banners = [..._banners, banner];
    return banner;
  },

  async updateBanner(id: string, data: Partial<Banner>) {
    await delay();
    const idx = _banners.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('배너를 찾을 수 없습니다.');
    _banners = _banners.map((b, i) => (i === idx ? { ...b, ...data, updatedAt: now() } : b));
    return _banners[idx];
  },

  async deleteBanner(id: string) {
    await delay();
    _banners = _banners.filter((b) => b.id !== id);
  },

  // ── FAQs ──
  async getFaqs(params: { page: number; limit: number; search?: string; category?: string; status?: string }) {
    await delay();
    let list = [..._faqs].sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order);
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    }
    if (params.category) list = list.filter((f) => f.category === params.category);
    if (params.status) list = list.filter((f) => f.status === params.status);
    const total = list.length;
    const start = (params.page - 1) * params.limit;
    const data = list.slice(start, start + params.limit);
    return { data, total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) };
  },

  async createFaq(data: Omit<Faq, 'id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const faq: Faq = { ...data, id: nextId('f'), createdAt: now(), updatedAt: now() };
    _faqs = [faq, ..._faqs];
    return faq;
  },

  async updateFaq(id: string, data: Partial<Faq>) {
    await delay();
    const idx = _faqs.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error('FAQ를 찾을 수 없습니다.');
    _faqs = _faqs.map((f, i) => (i === idx ? { ...f, ...data, updatedAt: now() } : f));
    return _faqs[idx];
  },

  async deleteFaq(id: string) {
    await delay();
    _faqs = _faqs.filter((f) => f.id !== id);
  },

  // ── Visitor Stats ──
  async getVisitorStats(params: { startDate: string; endDate: string }) {
    await delay();
    const dates = buildDateRange(params.startDate, params.endDate);
    return dates.map((d, i) => generateDailyStats(d, i));
  },

  // ── Sales Stats ──
  async getDailySalesStats(params: { startDate: string; endDate: string }) {
    await delay();
    const dates = buildDateRange(params.startDate, params.endDate);
    return dates.map((d, i) => generateDailySales(d, i));
  },

  async getMonthlySalesStats(params: { year: number }) {
    await delay();
    const months: string[] = [];
    for (let m = 1; m <= 12; m++) {
      months.push(`${params.year}-${String(m).padStart(2, '0')}`);
    }
    const monthly = months.map((month, i) => {
      const daysInMonth = new Date(params.year, i + 1, 0).getDate();
      let totalRevenue = 0;
      let totalOrders = 0;
      for (let d = 0; d < daysInMonth; d++) {
        const stat = generateDailySales(`${month}-${String(d + 1).padStart(2, '0')}`, i * 31 + d);
        totalRevenue += stat.revenue;
        totalOrders += stat.orders;
      }
      const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
      return { month, revenue: totalRevenue, orders: totalOrders, avgOrderValue, growthRate: 0 };
    });
    // compute growth rate vs previous month
    return monthly.map((m, i) => ({
      ...m,
      growthRate: i === 0 ? 0 : Math.round(((m.revenue - monthly[i - 1].revenue) / monthly[i - 1].revenue) * 1000) / 10,
    }));
  },

  // ── System Settings ──
  async getSystemSettings() {
    await delay();
    return { ..._systemSettings };
  },

  async updateSystemSettings(data: Partial<SystemSettings>) {
    await delay();
    _systemSettings = { ..._systemSettings, ...data };
    return { ..._systemSettings };
  },

  // ── Access Rules ──
  async getAccessRules(params: { page: number; limit: number; search?: string; type?: string; status?: string }) {
    await delay();
    let list = [..._accessRules];
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((r) => r.ipAddress.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    if (params.type) list = list.filter((r) => r.type === params.type);
    if (params.status) list = list.filter((r) => r.status === params.status);
    const total = list.length;
    const start = (params.page - 1) * params.limit;
    const data = list.slice(start, start + params.limit);
    return { data, total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) };
  },

  async createAccessRule(data: Omit<AccessRule, 'id' | 'createdAt'>) {
    await delay();
    const rule: AccessRule = { ...data, id: nextId('ar'), createdAt: now() };
    _accessRules = [rule, ..._accessRules];
    return rule;
  },

  async updateAccessRule(id: string, data: Partial<AccessRule>) {
    await delay();
    const idx = _accessRules.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('규칙을 찾을 수 없습니다.');
    _accessRules = _accessRules.map((r, i) => (i === idx ? { ...r, ...data } : r));
    return _accessRules[idx];
  },

  async deleteAccessRule(id: string) {
    await delay();
    _accessRules = _accessRules.filter((r) => r.id !== id);
  },

  // ── Login Policy ──
  async getLoginPolicy() {
    await delay();
    return { ..._loginPolicy };
  },

  async updateLoginPolicy(data: Partial<LoginPolicy>) {
    await delay();
    _loginPolicy = { ..._loginPolicy, ...data };
    return { ..._loginPolicy };
  },

  // ── Stats ──
  async getStats() {
    await delay();
    const total = _users.length;
    const adminCount = _users.filter((u) => u.role === 'admin').length;
    const activeCount = _users.filter((u) => u.status === 'active').length;
    const totalNotices = _notices.length;
    const publishedNotices = _notices.filter((n) => n.status === 'published').length;

    const recentUsers = [..._users]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    const recentNotices = [..._notices]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      users: { total, adminCount, userCount: total - adminCount, activeCount, inactiveCount: total - activeCount },
      notices: { total: totalNotices, publishedCount: publishedNotices, draftCount: totalNotices - publishedNotices },
      recentUsers,
      recentNotices,
    };
  },
};
