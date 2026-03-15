import { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, DatePicker, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { bannersApi } from '../../../api/banners';
import type { Banner } from '../../../types';

interface Props {
  open: boolean;
  type: 'main' | 'popup';
  editTarget: Banner | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BannerFormModal({ open, type, editTarget, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!editTarget;

  useEffect(() => {
    if (open) {
      if (editTarget) {
        form.setFieldsValue({
          title: editTarget.title,
          imageUrl: editTarget.imageUrl,
          linkUrl: editTarget.linkUrl,
          order: editTarget.order,
          status: editTarget.status,
          period: [dayjs(editTarget.startDate), dayjs(editTarget.endDate)],
          displayCondition: editTarget.displayCondition,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editTarget, form]);

  const createMutation = useMutation({
    mutationFn: (values: any) => {
      const [startDate, endDate] = values.period ?? [];
      return bannersApi.create({
        ...values,
        type,
        startDate: startDate?.format('YYYY-MM-DD') ?? '',
        endDate: endDate?.format('YYYY-MM-DD') ?? '',
        period: undefined,
      });
    },
    onSuccess: () => { message.success('배너가 생성되었습니다.'); onSuccess(); },
    onError: () => message.error('생성에 실패했습니다.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) => {
      const [startDate, endDate] = values.period ?? [];
      return bannersApi.update(id, {
        ...values,
        startDate: startDate?.format('YYYY-MM-DD') ?? '',
        endDate: endDate?.format('YYYY-MM-DD') ?? '',
        period: undefined,
      });
    },
    onSuccess: () => { message.success('수정되었습니다.'); onSuccess(); },
    onError: () => message.error('수정에 실패했습니다.'),
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        updateMutation.mutate({ id: editTarget.id, values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const typeLabel = type === 'main' ? '메인 배너' : '팝업 배너';

  return (
    <Modal
      title={isEdit ? `${typeLabel} 수정` : `${typeLabel} 추가`}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={isEdit ? '수정' : '추가'}
      cancelText="취소"
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="title" label="배너 제목" rules={[{ required: true, message: '제목을 입력해주세요.' }]}>
          <Input placeholder="배너 제목" />
        </Form.Item>

        <Form.Item name="imageUrl" label="이미지 URL" rules={[{ required: true, message: '이미지 URL을 입력해주세요.' }]}>
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item name="linkUrl" label="링크 URL">
          <Input placeholder="https://... (비워두면 링크 없음)" />
        </Form.Item>

        <Form.Item name="order" label="노출 순서" initialValue={1} rules={[{ required: true }]}>
          <InputNumber min={1} max={99} style={{ width: 100 }} />
        </Form.Item>

        <Form.Item name="period" label="노출 기간" rules={[{ required: true, message: '기간을 선택해주세요.' }]}>
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="status" label="상태" initialValue="active">
          <Select
            options={[
              { value: 'active', label: '활성' },
              { value: 'inactive', label: '비활성' },
            ]}
          />
        </Form.Item>

        {type === 'popup' && (
          <Form.Item name="displayCondition" label="노출 조건" initialValue="always">
            <Select
              options={[
                { value: 'always', label: '항상 표시' },
                { value: 'once', label: '하루 한 번' },
              ]}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
