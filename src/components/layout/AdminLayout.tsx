import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography, theme, Tag } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FormOutlined,
  DashboardOutlined,
  ProfileOutlined,
  TeamOutlined,
  AppstoreOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  LineChartOutlined,
  EyeOutlined,
  NotificationOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import ProfileModal from '../../pages/profile/ProfileModal';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

// ────────────────────────────────────────────────────────────
// 메뉴 원본 데이터 (3뎁스 구조)
// ────────────────────────────────────────────────────────────
type RawMenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: RawMenuItem[];
};

const rawMenuItems: RawMenuItem[] = [
  // ── 1뎁스: 대시보드 (단일 페이지)
  {
    key: '/dashboard',
    label: '대시보드',
    icon: <DashboardOutlined />,
  },

  // ── 1뎁스: 사용자 관리
  {
    key: 'users',
    label: '사용자 관리',
    icon: <UserOutlined />,
    children: [
      // 2뎁스: 회원 목록 (단일 페이지)
      { key: '/users', label: '회원 목록', icon: <UserOutlined /> },
      // 2뎁스: 그룹 관리 (하위 페이지 포함)
      {
        key: 'users-groups',
        label: '그룹 관리',
        icon: <TeamOutlined />,
        children: [
          // 3뎁스
          { key: '/users/groups/list', label: '그룹 목록' },
          { key: '/users/groups/permissions', label: '권한 설정', icon: <KeyOutlined /> },
        ],
      },
    ],
  },

  // ── 1뎁스: 콘텐츠 관리
  {
    key: 'content',
    label: '콘텐츠 관리',
    icon: <AppstoreOutlined />,
    children: [
      // 2뎁스: 공지사항 (단일 페이지)
      { key: '/notices', label: '공지사항', icon: <NotificationOutlined /> },
      // 2뎁스: 배너 관리 (하위 페이지 포함)
      {
        key: 'content-banner',
        label: '배너 관리',
        icon: <PictureOutlined />,
        children: [
          // 3뎁스
          { key: '/content/banner/main', label: '메인 배너' },
          { key: '/content/banner/popup', label: '팝업 배너' },
        ],
      },
      // 2뎁스: FAQ (단일 페이지)
      { key: '/content/faq', label: 'FAQ', icon: <QuestionCircleOutlined /> },
    ],
  },

  // ── 1뎁스: 통계
  {
    key: 'stats',
    label: '통계',
    icon: <BarChartOutlined />,
    children: [
      // 2뎁스: 방문 통계 (단일 페이지)
      { key: '/stats/visitors', label: '방문 통계', icon: <EyeOutlined /> },
      // 2뎁스: 매출 통계 (하위 페이지 포함)
      {
        key: 'stats-sales',
        label: '매출 통계',
        icon: <LineChartOutlined />,
        children: [
          // 3뎁스
          { key: '/stats/sales/daily', label: '일별 매출' },
          { key: '/stats/sales/monthly', label: '월별 매출' },
        ],
      },
    ],
  },

  // ── 1뎁스: 샘플 폼
  {
    key: '/sample',
    label: '샘플 폼',
    icon: <FormOutlined />,
  },
];

// ────────────────────────────────────────────────────────────
// 헬퍼: 현재 경로로부터 selectedKey / openKeys 계산
// ────────────────────────────────────────────────────────────
function getMenuState(
  items: RawMenuItem[],
  pathname: string,
): { selectedKey: string; parentKeys: string[] } {
  // 리프 노드(자식 없는 항목)를 순회하여 조상 키와 함께 수집
  const entries: { key: string; ancestors: string[] }[] = [];

  function traverse(list: RawMenuItem[], ancestors: string[]) {
    for (const item of list) {
      if (item.children?.length) {
        traverse(item.children, [...ancestors, item.key]);
      } else {
        entries.push({ key: item.key, ancestors });
      }
    }
  }

  traverse(items, []);

  // 현재 pathname과 가장 잘 맞는 리프 키 탐색 (가장 긴 prefix 우선)
  const match = entries
    .filter((e) => pathname === e.key || pathname.startsWith(e.key + '/'))
    .sort((a, b) => b.key.length - a.key.length)[0];

  return match
    ? { selectedKey: match.key, parentKeys: match.ancestors }
    : { selectedKey: '/dashboard', parentKeys: [] };
}

// Ant Design Menu items 형식으로 재귀 변환
function toAntMenuItems(items: RawMenuItem[]): MenuProps['items'] {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children ? toAntMenuItems(item.children) : undefined,
  }));
}

const antMenuItems = toAntMenuItems(rawMenuItems);

// ────────────────────────────────────────────────────────────
// AdminLayout 컴포넌트
// ────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const user = authStore.getUser();

  // 경로 변경 시 부모 메뉴 자동 열기 (기존 열린 메뉴 유지)
  useEffect(() => {
    const { parentKeys } = getMenuState(rawMenuItems, location.pathname);
    setOpenKeys((prev) => [...new Set([...prev, ...parentKeys])]);
  }, [location.pathname]);

  const { selectedKey } = getMenuState(rawMenuItems, location.pathname);

  // 리프 항목 클릭 시 라우팅 (key가 '/'로 시작하는 경우만 이동)
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/')) navigate(key);
  };

  // 서브메뉴 토글 (사용자가 직접 열고 닫기)
  const handleOpenChange = (keys: string[]) => setOpenKeys(keys);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    authStore.clearAuth();
    navigate('/login', { replace: true });
  };

  const dropdownItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: '내 정보',
      onClick: () => setProfileOpen(true),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '로그아웃',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.06)' }}
      >
        {/* 로고 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 18 : 20,
            fontWeight: 700,
            letterSpacing: 1,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {collapsed ? 'A' : 'Admin'}
        </div>

        {/* 3뎁스 메뉴 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          // 접힌 상태에서는 openKeys를 비워 팝업 서브메뉴만 표시
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={handleOpenChange}
          items={antMenuItems}
          onClick={handleMenuClick}
          style={{ marginTop: 8, borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              <Text>{user?.name ?? '관리자'}</Text>
              {user?.role === 'admin' && (
                <Tag color="blue" style={{ margin: 0 }}>
                  관리자
                </Tag>
              )}
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Layout>
  );
}
