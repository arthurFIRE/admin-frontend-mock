import { Navigate, Outlet } from 'react-router-dom';
import { authStore } from '../store/authStore';

export default function PrivateRoute() {
  const token = authStore.getToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
