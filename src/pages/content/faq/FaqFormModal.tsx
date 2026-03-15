import { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { faqsApi } from '../../../api/faqs';
import type { Faq } from '../../../types';

const FAQ_CATEGORIES = ['이용방법', '결제', '서비스', '기타'];

interface Props {
  open: boolean;
  editTarget: Faq | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FaqFormModal({ open, editTarget, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!editTarget;

  useEffect(() => {
    if (open) {
      if (editTarget) {
        form.setFieldsValue({
          category: editTarget.category,
          question: editTarget.question,
          answer: editTarget.answer,
          order: editTarget.order,
          status: editTarget.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editTarget, form]);

  const createMutation = useMutation({
    mutationFn: faqsApi.create,
    onSuccess: () => { message.success('FAQ가 등록되었습니다.'); onSuccess(); },
    onError: () => message.error('등록에 실패했습니다.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Faq> }) => faqsApi.update(id, data),
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
      title={isEdit ? 'FAQ 수정' : 'FAQ 추가'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={isEdit ? '수정' : '추가'}
      cancelText="취소"
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      width={620}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="category" label="카테고리" rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}>
          <Select
            options={FAQ_CATEGORIES.map((c) => ({ value: c, label: c }))}
            placeholder="카테고리 선택"
          />
        </Form.Item>

        <Form.Item name="question" label="질문" rules={[{ required: true, message: '질문을 입력해주세요.' }]}>
          <Input placeholder="자주 묻는 질문" />
        </Form.Item>

        <Form.Item name="answer" label="답변" rules={[{ required: true, message: '답변을 입력해주세요.' }]}>
          <Input.TextArea rows={5} placeholder="질문에 대한 답변" />
        </Form.Item>

        <Form.Item name="order" label="노출 순서" initialValue={1}>
          <InputNumber min={1} max={999} style={{ width: 100 }} />
        </Form.Item>

        <Form.Item name="status" label="상태" initialValue="published">
          <Select
            options={[
              { value: 'published', label: '게시됨' },
              { value: 'draft', label: '임시저장' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
