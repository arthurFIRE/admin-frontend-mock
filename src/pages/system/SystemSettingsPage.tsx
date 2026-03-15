import { useEffect } from 'react';
import {
  Typography, Form, Input, Switch, Select, Button, Card, message, Spin, Divider,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { systemApi } from '../../api/system';

const { Title } = Typography;

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Seoul', label: 'Asia/Seoul (KST, UTC+9)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST, UTC+9)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST, UTC+8)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York (EST, UTC-5)' },
];

export default function SystemSettingsPage() {
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: systemApi.getSettings,
  });

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  const saveMutation = useMutation({
    mutationFn: systemApi.updateSettings,
    onSuccess: () => message.success('설정이 저장되었습니다.'),
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
        <Title level={4} style={{ margin: 0 }}>환경 설정</Title>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saveMutation.isPending}>
          저장
        </Button>
      </div>

      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Card title="사이트 기본 정보" style={{ marginBottom: 16 }}>
          <Form.Item
            name="siteName"
            label="사이트명"
            rules={[{ required: true, message: '사이트명을 입력해주세요.' }]}
          >
            <Input placeholder="사이트명" />
          </Form.Item>

          <Form.Item name="siteDescription" label="사이트 설명">
            <Input.TextArea rows={3} placeholder="사이트에 대한 간략한 설명" />
          </Form.Item>

          <Form.Item name="timezone" label="시간대">
            <Select options={TIMEZONE_OPTIONS} />
          </Form.Item>
        </Card>

        <Card title="관리자 연락처" style={{ marginBottom: 16 }}>
          <Form.Item
            name="adminEmail"
            label="관리자 이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요.' },
              { type: 'email', message: '올바른 이메일 형식을 입력해주세요.' },
            ]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item name="supportPhone" label="고객센터 전화번호">
            <Input placeholder="02-0000-0000" />
          </Form.Item>
        </Card>

        <Card title="운영 설정">
          <Divider plain>서비스 점검</Divider>
          <Form.Item
            name="maintenanceMode"
            label="점검 모드"
            valuePropName="checked"
            extra="점검 모드 활성화 시 일반 사용자의 서비스 접근이 차단됩니다."
          >
            <Switch checkedChildren="활성" unCheckedChildren="비활성" />
          </Form.Item>
        </Card>
      </Form>
    </>
  );
}
