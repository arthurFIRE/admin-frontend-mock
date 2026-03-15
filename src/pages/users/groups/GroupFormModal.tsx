import { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { groupsApi } from '../../../api/groups';
import type { Group } from '../../../types';

interface Props {
  open: boolean;
  editTarget: Group | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GroupFormModal({ open, editTarget, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!editTarget;

  useEffect(() => {
    if (open) {
      if (editTarget) {
        form.setFieldsValue({ name: editTarget.name, description: editTarget.description });
      } else {
        form.resetFields();
      }
    }
  }, [open, editTarget, form]);

  const createMutation = useMutation({
    mutationFn: groupsApi.create,
    onSuccess: () => { message.success('그룹이 생성되었습니다.'); onSuccess(); },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(msg ?? '생성에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Pick<Group, 'name' | 'description'> }) =>
      groupsApi.update(id, data),
    onSuccess: () => { message.success('수정되었습니다.'); onSuccess(); },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(msg ?? '수정에 실패했습니다.');
    },
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
      title={isEdit ? '그룹 수정' : '그룹 추가'}
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
          name="name"
          label="그룹명"
          rules={[{ required: true, message: '그룹명을 입력해주세요.' }]}
        >
          <Input placeholder="그룹명" />
        </Form.Item>
        <Form.Item name="description" label="설명">
          <Input.TextArea rows={3} placeholder="그룹 설명" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
