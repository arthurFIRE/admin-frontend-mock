import { useEffect, useState } from 'react';
import { Modal, Form, Input, Segmented, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';
import { authStore } from '../../store/authStore';

interface Props {
  open: boolean;
  onClose: () => void;
}

type TabKey = 'info' | 'password';

export default function ProfileModal({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [profileForm] = Form.useForm();
  const [pwForm] = Form.useForm();

  useEffect(() => {
    if (open) {
      setActiveTab('info');
      const u = authStore.getUser();
      profileForm.setFieldsValue({ name: u?.name, email: u?.email });
      pwForm.resetFields();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const profileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updated) => {
      const current = authStore.getUser()!;
      authStore.setUser({ ...current, name: updated.name, email: updated.email });
      message.success('정보가 수정되었습니다.');
      onClose();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg ?? '수정에 실패했습니다.');
    },
  });

  const pwMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      message.success('비밀번호가 변경되었습니다.');
      onClose();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg ?? '변경에 실패했습니다.');
    },
  });

  const handleOk = () => {
    if (activeTab === 'info') {
      profileForm.validateFields().then((values) => profileMutation.mutate(values));
    } else {
      pwForm.validateFields().then((values) =>
        pwMutation.mutate({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      );
    }
  };

  const user = authStore.getUser();
  const isPending = profileMutation.isPending || pwMutation.isPending;

  return (
    <Modal
      title="내 정보"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="저장"
      cancelText="취소"
      confirmLoading={isPending}
      destroyOnHidden
      width={460}
    >
      <Segmented
        block
        value={activeTab}
        onChange={(v) => setActiveTab(v as TabKey)}
        options={[
          { label: '내 정보', value: 'info' },
          { label: '비밀번호 변경', value: 'password' },
        ]}
        style={{ margin: '16px 0' }}
      />

      <div style={{ display: activeTab === 'info' ? 'block' : 'none' }}>
        <Form form={profileForm} layout="vertical">
          <Form.Item label="아이디">
            <Input value={user?.loginId ?? ''} disabled />
          </Form.Item>
          <Form.Item
            name="name"
            label="이름"
            rules={[{ required: true, message: '이름을 입력해주세요.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요.' },
              { type: 'email', message: '올바른 이메일 형식이 아닙니다.' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>

      <div style={{ display: activeTab === 'password' ? 'block' : 'none' }}>
        <Form form={pwForm} layout="vertical">
          <Form.Item
            name="currentPassword"
            label="현재 비밀번호"
            rules={[{ required: true, message: '현재 비밀번호를 입력해주세요.' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="새 비밀번호"
            rules={[
              { required: true, message: '새 비밀번호를 입력해주세요.' },
              { min: 8, message: '8자 이상 입력해주세요.' },
            ]}
          >
            <Input.Password />
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
            <Input.Password />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
