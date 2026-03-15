import { useEffect } from 'react';
import {
  Typography, Form, InputNumber, Switch, Button, Card, message, Spin, Divider, Alert,
} from 'antd';
import { SaveOutlined, LockOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { systemApi } from '../../../api/system';

const { Title } = Typography;

export default function LoginPolicyPage() {
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['login-policy'],
    queryFn: systemApi.getLoginPolicy,
  });

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  const saveMutation = useMutation({
    mutationFn: systemApi.updateLoginPolicy,
    onSuccess: () => message.success('로그인 정책이 저장되었습니다.'),
    onError: () => message.error('저장에 실패했습니다.'),
  });

  const handleSave = () => {
    form.validateFields().then((values) => saveMutation.mutate(values));
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 64 }}><Spin /></div>;
  }

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>로그인 정책</Title>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saveMutation.isPending}>
          저장
        </Button>
      </div>

      <Alert
        type="warning"
        message="보안 정책 변경 사항은 다음 로그인 시점부터 적용됩니다."
        showIcon
        style={{ marginBottom: 16, maxWidth: 600 }}
      />

      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Card title={<><LockOutlined /> 비밀번호 정책</>} style={{ marginBottom: 16 }}>
          <Form.Item
            name="passwordMinLength"
            label="최소 비밀번호 길이"
            rules={[{ required: true }]}
          >
            <InputNumber min={6} max={32} addonAfter="자 이상" style={{ width: 180 }} />
          </Form.Item>

          <Divider plain>비밀번호 구성 요건</Divider>

          <Form.Item name="requireUppercase" label="대문자 포함 필수" valuePropName="checked">
            <Switch checkedChildren="필수" unCheckedChildren="선택" />
          </Form.Item>

          <Form.Item name="requireNumber" label="숫자 포함 필수" valuePropName="checked">
            <Switch checkedChildren="필수" unCheckedChildren="선택" />
          </Form.Item>

          <Form.Item name="requireSpecialChar" label="특수문자 포함 필수" valuePropName="checked">
            <Switch checkedChildren="필수" unCheckedChildren="선택" />
          </Form.Item>
        </Card>

        <Card title="계정 잠금 정책" style={{ marginBottom: 16 }}>
          <Form.Item
            name="maxLoginAttempts"
            label="최대 로그인 시도 횟수"
            extra="설정 횟수 초과 시 계정이 잠금됩니다."
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={20} addonAfter="회" style={{ width: 180 }} />
          </Form.Item>

          <Form.Item
            name="lockoutDurationMin"
            label="계정 잠금 시간"
            extra="잠금 후 자동 해제까지의 대기 시간"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={1440} addonAfter="분" style={{ width: 180 }} />
          </Form.Item>
        </Card>

        <Card title="세션 정책">
          <Form.Item
            name="sessionTimeoutMin"
            label="세션 만료 시간"
            extra="마지막 활동 이후 자동 로그아웃까지의 시간"
            rules={[{ required: true }]}
          >
            <InputNumber min={5} max={1440} addonAfter="분" style={{ width: 180 }} />
          </Form.Item>

          <Form.Item
            name="require2FA"
            label="2단계 인증(2FA) 필수 적용"
            valuePropName="checked"
            extra="활성화 시 모든 관리자 계정에 2FA 등록이 필요합니다."
          >
            <Switch checkedChildren="필수" unCheckedChildren="선택" />
          </Form.Item>
        </Card>
      </Form>
    </>
  );
}
