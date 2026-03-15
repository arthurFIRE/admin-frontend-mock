import { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import type { User } from '../../types';

interface Props {
  open: boolean;
  editTarget: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormModal({ open, editTarget, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!editTarget;

  useEffect(() => {
    if (open) {
      if (editTarget) {
        form.setFieldsValue({
          loginId: editTarget.loginId,
          email: editTarget.email,
          name: editTarget.name,
          role: editTarget.role,
          status: editTarget.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editTarget, form]);

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => { message.success('사용자가 생성되었습니다.'); onSuccess(); },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg ?? '생성에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersApi.update(id, data),
    onSuccess: () => { message.success('수정되었습니다.'); onSuccess(); },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg ?? '수정에 실패했습니다.');
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        const { password: _, ...rest } = values;
        updateMutation.mutate({ id: editTarget.id, data: rest });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEdit ? '사용자 수정' : '사용자 추가'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={isEdit ? '수정' : '추가'}
      cancelText="취소"
      confirmLoading={isPending}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="loginId"
          label="아이디"
          rules={[
            { required: true, message: '아이디를 입력해주세요.' },
            { min: 4, message: '4자 이상 입력해주세요.' },
            { max: 20, message: '20자 이하로 입력해주세요.' },
            { pattern: /^[a-z0-9_]+$/, message: '영소문자, 숫자, 밑줄(_)만 사용 가능합니다.' },
          ]}
        >
          <Input placeholder="hong123" />
        </Form.Item>

        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: '이메일을 입력해주세요.' },
            { type: 'email', message: '올바른 이메일 형식이 아닙니다.' },
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            name="password"
            label="비밀번호"
            rules={[
              { required: true, message: '비밀번호를 입력해주세요.' },
              { min: 8, message: '8자 이상 입력해주세요.' },
            ]}
          >
            <Input.Password placeholder="최소 8자" />
          </Form.Item>
        )}

        <Form.Item
          name="name"
          label="이름"
          rules={[{ required: true, message: '이름을 입력해주세요.' }]}
        >
          <Input placeholder="홍길동" />
        </Form.Item>

        <Form.Item name="role" label="권한" initialValue="user">
          <Select
            options={[
              { value: 'admin', label: '관리자' },
              { value: 'user', label: '일반' },
            ]}
          />
        </Form.Item>

        <Form.Item name="status" label="상태" initialValue="active">
          <Select
            options={[
              { value: 'active', label: '활성' },
              { value: 'inactive', label: '비활성' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
