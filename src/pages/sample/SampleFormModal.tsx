import { useEffect } from 'react';
import {
  Modal, Form, Input, Select, Radio, Checkbox,
  DatePicker, Switch, Divider, Row, Col, Tag,
} from 'antd';
import type { SampleItem } from './SampleListPage';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export interface SampleFormValues {
  title: string;
  category: string;
  tags: string[];
  gender: string;
  hobbies: string[];
  description: string;
  startDate: string;
  period: [string, string];
  active: boolean;
}

interface Props {
  open: boolean;
  editTarget: SampleItem | null;
  onClose: () => void;
  onSave: (values: SampleFormValues) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'notice', label: '공지' },
  { value: 'event', label: '이벤트' },
  { value: 'news', label: '뉴스' },
  { value: 'etc', label: '기타' },
];

const TAG_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'antd', label: 'Ant Design' },
  { value: 'vite', label: 'Vite' },
  { value: 'nestjs', label: 'NestJS' },
  { value: 'postgresql', label: 'PostgreSQL' },
];

const HOBBY_OPTIONS = [
  { value: 'reading', label: '독서' },
  { value: 'sports', label: '운동' },
  { value: 'gaming', label: '게임' },
  { value: 'cooking', label: '요리' },
  { value: 'travel', label: '여행' },
];

// 태그 커스텀 렌더링
const tagRender = (props: any) => {
  const { label, closable, onClose } = props;
  return (
    <Tag color="blue" closable={closable} onClose={onClose} style={{ marginInlineEnd: 4 }}>
      {label}
    </Tag>
  );
};

export default function SampleFormModal({ open, editTarget, onClose, onSave }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!editTarget;

  useEffect(() => {
    if (!open) return;
    if (editTarget) {
      form.setFieldsValue({
        ...editTarget,
        startDate: dayjs(editTarget.startDate),
        period: [dayjs(editTarget.period[0]), dayjs(editTarget.period[1])],
      });
    } else {
      form.resetFields();
    }
  }, [open, editTarget, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        period: [
          values.period[0].format('YYYY-MM-DD'),
          values.period[1].format('YYYY-MM-DD'),
        ],
      });
    });
  };

  return (
    <Modal
      title={isEdit ? '샘플 수정' : '샘플 등록'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={isEdit ? '수정' : '등록'}
      cancelText="취소"
      width={720}
      destroyOnHidden
      styles={{
        body: {
          maxHeight: 'calc(100vh - 260px)',
          overflowY: 'auto',
          paddingRight: 4,
        },
      }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>

        {/* ── Input ── */}
        <Divider orientationMargin={0} style={{ fontSize: 13, color: '#888' }}>
          Input
        </Divider>
        <Form.Item
          name="title"
          label="제목"
          rules={[{ required: true, message: '제목을 입력해주세요.' }]}
        >
          <Input placeholder="제목을 입력하세요" allowClear />
        </Form.Item>

        {/* ── Select / MultiSelect ── */}
        <Divider orientationMargin={0} style={{ fontSize: 13, color: '#888' }}>
          Select / Multi-Select
        </Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="카테고리 (단일 선택)"
              rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}
            >
              <Select placeholder="선택하세요" options={CATEGORY_OPTIONS} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="tags"
              label="태그 (다중 선택)"
              rules={[{ required: true, message: '태그를 선택해주세요.' }]}
            >
              <Select
                mode="multiple"
                placeholder="태그를 선택하세요"
                options={TAG_OPTIONS}
                tagRender={tagRender}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ── Radio ── */}
        <Divider orientationMargin={0} style={{ fontSize: 13, color: '#888' }}>
          Radio
        </Divider>
        <Form.Item
          name="gender"
          label="성별"
          rules={[{ required: true, message: '성별을 선택해주세요.' }]}
        >
          <Radio.Group>
            <Radio value="male">남성</Radio>
            <Radio value="female">여성</Radio>
            <Radio value="other">기타</Radio>
          </Radio.Group>
        </Form.Item>

        {/* ── Checkbox ── */}
        <Divider orientationMargin={0} style={{ fontSize: 13, color: '#888' }}>
          Checkbox (Group)
        </Divider>
        <Form.Item
          name="hobbies"
          label="취미 (복수 선택)"
          rules={[{ required: true, message: '취미를 하나 이상 선택해주세요.' }]}
        >
          <Checkbox.Group options={HOBBY_OPTIONS} />
        </Form.Item>

        {/* ── Textarea ── */}
        <Divider orientationMargin={0} style={{ fontSize: 13, color: '#888' }}>
          Textarea
        </Divider>
        <Form.Item
          name="description"
          label="설명"
          rules={[{ required: true, message: '설명을 입력해주세요.' }]}
        >
          <TextArea
            rows={4}
            placeholder="내용을 입력하세요"
            showCount
            maxLength={500}
          />
        </Form.Item>

        {/* ── DatePicker / RangePicker ── */}
        <Divider orientationMargin={0} style={{ fontSize: 13, color: '#888' }}>
          DatePicker / RangeDatePicker
        </Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="시작일 (DatePicker)"
              rules={[{ required: true, message: '시작일을 선택해주세요.' }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="날짜 선택" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="period"
              label="기간 (RangeDatePicker)"
              rules={[{ required: true, message: '기간을 선택해주세요.' }]}
            >
              <RangePicker style={{ width: '100%' }} placeholder={['시작일', '종료일']} />
            </Form.Item>
          </Col>
        </Row>

        {/* ── Switch ── */}
        <Divider orientationMargin={0} style={{ fontSize: 13, color: '#888' }}>
          Switch
        </Divider>
        <Form.Item name="active" label="활성 여부" valuePropName="checked" initialValue={true}>
          <Switch checkedChildren="활성" unCheckedChildren="비활성" />
        </Form.Item>

      </Form>
    </Modal>
  );
}
