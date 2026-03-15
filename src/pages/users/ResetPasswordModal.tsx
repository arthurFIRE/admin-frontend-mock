import { useEffect } from 'react';
import { Modal, Form, Input, message, Typography } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import type { User } from '../../types';

const { Text } = Typography;

interface Props {
  open: boolean;
  target: User | null;
  onClose: () => void;
}

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordModal({ open, target, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const mutation = useMutation({
    mutationFn: (newPassword: string) =>
      usersApi.resetPassword(target!.id, newPassword),
    onSuccess: () => {
      message.success('비밀번호가 초기화되었습니다.');
      onClose();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg ?? '초기화에 실패했습니다.');
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutation.mutate(values.newPassword);
    });
  };

  return (
    <Modal
      title="비밀번호 초기화"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="초기화"
      okButtonProps={{ danger: true }}
      cancelText="취소"
      confirmLoading={mutation.isPending}
      destroyOnHidden
      width={420}
    >
      {target && (
        <div style={{ marginBottom: 16, padding: '10px 12px', background: '#f5f5f5', borderRadius: 6 }}>
          <Text type="secondary">대상 계정: </Text>
          <Text strong>{target.name}</Text>
          <Text type="secondary"> ({target.loginId})</Text>
        </div>
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          name="newPassword"
          label="새 비밀번호"
          rules={[
            { required: true, message: '새 비밀번호를 입력해주세요.' },
            { min: 8, message: '8자 이상 입력해주세요.' },
          ]}
        >
          <Input.Password placeholder="최소 8자" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="비밀번호 확인"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '비밀번호 확인을 입력해주세요.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="비밀번호 재입력" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
