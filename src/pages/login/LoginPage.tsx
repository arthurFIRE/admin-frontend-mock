import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Tag } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authApi } from '../../api/auth';
import { authStore } from '../../store/authStore';

const { Title } = Typography;

interface LoginForm { loginId: string; password: string; }

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(values);
      authStore.setAuth(res.accessToken, res.refreshToken, res.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? '로그인에 실패했습니다.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: '#1677ff' }}>Admin</Title>
          <Typography.Text type="secondary">관리자 로그인</Typography.Text>
          <div style={{ marginTop: 8 }}>
            <Tag color="orange">MOCK 모드 — 아무 값이나 입력하세요</Tag>
          </div>
        </div>

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} closable onClose={() => setError(null)} />
        )}

        <Form layout="vertical" onFinish={onFinish} initialValues={{ loginId: 'admin', password: 'any' }} size="large">
          <Form.Item name="loginId" rules={[{ required: true, message: '아이디를 입력해주세요.' }]}>
            <Input prefix={<UserOutlined />} placeholder="아이디 (아무 값)" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 (아무 값)" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>로그인</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
