import { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { systemApi } from '../../../api/system';
import type { AccessRule } from '../../../types';

interface Props {
  open: boolean;
  editTarget: AccessRule | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AccessRuleFormModal({ open, editTarget, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!editTarget;

  useEffect(() => {
    if (open) {
      if (editTarget) {
        form.setFieldsValue({
          ipAddress: editTarget.ipAddress,
          description: editTarget.description,
          type: editTarget.type,
          status: editTarget.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editTarget, form]);

  const createMutation = useMutation({
    mutationFn: systemApi.createAccessRule,
    onSuccess: () => { message.success('규칙이 추가되었습니다.'); onSuccess(); },
    onError: () => message.error('추가에 실패했습니다.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccessRule> }) =>
      systemApi.updateAccessRule(id, data),
    onSuccess: () => { message.success('수정되었습니다.'); onSuccess(); },
    onError: () => message.error('수정에 실패했습니다.'),
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        updateMutation.mutate({ id: editTarget.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  return (
    <Modal
      title={isEdit ? '접근 규칙 수정' : '접근 규칙 추가'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={isEdit ? '수정' : '추가'}
      cancelText="취소"
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="ipAddress"
          label="IP 주소 / CIDR"
          rules={[{ required: true, message: 'IP 주소를 입력해주세요.' }]}
          extra="예: 192.168.1.1 또는 192.168.1.0/24"
        >
          <Input placeholder="192.168.0.0/24" />
        </Form.Item>

        <Form.Item name="description" label="설명">
          <Input placeholder="IP 규칙에 대한 설명" />
        </Form.Item>

        <Form.Item name="type" label="규칙 유형" initialValue="allow">
          <Select
            options={[
              { value: 'allow', label: '허용 (Allow)' },
              { value: 'deny', label: '차단 (Deny)' },
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
