import { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { noticesApi } from '../../api/notices';
import type { Notice } from '../../types';

interface Props {
  open: boolean;
  editTarget: Notice | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NoticeFormModal({ open, editTarget, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!editTarget;

  useEffect(() => {
    if (open) {
      if (editTarget) {
        form.setFieldsValue({
          title: editTarget.title,
          content: editTarget.content,
          isPinned: editTarget.isPinned,
          status: editTarget.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editTarget, form]);

  const createMutation = useMutation({
    mutationFn: noticesApi.create,
    onSuccess: () => { message.success('공지사항이 생성되었습니다.'); onSuccess(); },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg ?? '생성에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => noticesApi.update(id, data),
    onSuccess: () => { message.success('수정되었습니다.'); onSuccess(); },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : msg ?? '수정에 실패했습니다.');
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

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEdit ? '공지사항 수정' : '공지사항 추가'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={isEdit ? '수정' : '추가'}
      cancelText="취소"
      confirmLoading={isPending}
      width={640}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="title"
          label="제목"
          rules={[{ required: true, message: '제목을 입력해주세요.' }]}
        >
          <Input placeholder="공지사항 제목" />
        </Form.Item>

        <Form.Item
          name="content"
          label="내용"
          rules={[{ required: true, message: '내용을 입력해주세요.' }]}
        >
          <Input.TextArea rows={6} placeholder="공지사항 내용" />
        </Form.Item>

        <Form.Item name="status" label="상태" initialValue="draft">
          <Select
            options={[
              { value: 'published', label: '게시됨' },
              { value: 'draft', label: '임시저장' },
            ]}
          />
        </Form.Item>

        <Form.Item name="isPinned" label="상단 고정" valuePropName="checked" initialValue={false}>
          <Switch checkedChildren="고정" unCheckedChildren="해제" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
