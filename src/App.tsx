import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import LoginPage from './pages/login/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import UserListPage from './pages/users/UserListPage';
import GroupListPage from './pages/users/groups/GroupListPage';
import PermissionsPage from './pages/users/groups/PermissionsPage';
import NoticeListPage from './pages/notices/NoticeListPage';
import MainBannerPage from './pages/content/banner/MainBannerPage';
import PopupBannerPage from './pages/content/banner/PopupBannerPage';
import FaqListPage from './pages/content/faq/FaqListPage';
import VisitorStatsPage from './pages/stats/VisitorStatsPage';
import DailySalesPage from './pages/stats/DailySalesPage';
import MonthlySalesPage from './pages/stats/MonthlySalesPage';
import SystemSettingsPage from './pages/system/SystemSettingsPage';
import AccessControlPage from './pages/system/security/AccessControlPage';
import LoginPolicyPage from './pages/system/security/LoginPolicyPage';
import SampleListPage from './pages/sample/SampleListPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './router/PrivateRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <ConfigProvider locale={koKR}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<PrivateRoute />}>
                <Route element={<AdminLayout />}>
                  {/* 대시보드 */}
                  <Route path="/dashboard" element={<DashboardPage />} />

                  {/* 사용자 관리 */}
                  <Route path="/users" element={<UserListPage />} />
                  <Route path="/users/groups/list" element={<GroupListPage />} />
                  <Route path="/users/groups/permissions" element={<PermissionsPage />} />

                  {/* 콘텐츠 관리 */}
                  <Route path="/notices" element={<NoticeListPage />} />
                  <Route path="/content/banner/main" element={<MainBannerPage />} />
                  <Route path="/content/banner/popup" element={<PopupBannerPage />} />
                  <Route path="/content/faq" element={<FaqListPage />} />

                  {/* 통계 */}
                  <Route path="/stats/visitors" element={<VisitorStatsPage />} />
                  <Route path="/stats/sales/daily" element={<DailySalesPage />} />
                  <Route path="/stats/sales/monthly" element={<MonthlySalesPage />} />

                  {/* 시스템 */}
                  <Route path="/system/settings" element={<SystemSettingsPage />} />
                  <Route path="/system/security/access" element={<AccessControlPage />} />
                  <Route path="/system/security/policy" element={<LoginPolicyPage />} />

                  <Route path="/sample" element={<SampleListPage />} />

                  {/* 루트 → 대시보드 리다이렉트 */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}
