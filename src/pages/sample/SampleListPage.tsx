import { useState } from 'react';
import {
  Table, Button, Space, Tag, Typography, Popconfirm, message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import SampleFormModal, { type SampleFormValues } from './SampleFormModal';

const { Title } = Typography;

export interface SampleItem {
  id: number;
  title: string;
  category: string;
  tags: string[];
  gender: string;
  hobbies: string[];
  description: string;
  startDate: string;
  period: [string, string];
  active: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  notice: '공지',
  event: '이벤트',
  news: '뉴스',
  etc: '기타',
};

const HOBBY_LABELS: Record<string, string> = {
  reading: '독서',
  sports: '운동',
  gaming: '게임',
  cooking: '요리',
  travel: '여행',
};

let nextId = 4;

const INITIAL_DATA: SampleItem[] = [
  {
    id: 1,
    title: '첫 번째 샘플',
    category: 'notice',
    tags: ['react', 'typescript'],
    gender: 'male',
    hobbies: ['reading', 'sports'],
    description: '샘플 설명입니다.',
    startDate: '2026-01-01',
    period: ['2026-01-01', '2026-03-31'],
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 2,
    title: '두 번째 샘플',
    category: 'event',
    tags: ['antd'],
    gender: 'female',
    hobbies: ['cooking', 'travel'],
    description: '이벤트 설명입니다.',
    startDate: '2026-02-01',
    period: ['2026-02-01', '2026-02-28'],
    active: true,
    createdAt: '2026-02-01',
  },
  {
    id: 3,
    title: '세 번째 샘플',
    category: 'news',
    tags: ['vite', 'react'],
    gender: 'male',
    hobbies: ['gaming'],
    description: '뉴스 설명입니다.',
    startDate: '2026-02-10',
    period: ['2026-02-10', '2026-04-10'],
    active: false,
    createdAt: '2026-02-10',
  },
];

export default function SampleListPage() {
  const [data, setData] = useState<SampleItem[]>(INITIAL_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SampleItem | null>(null);

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (record: SampleItem) => { setEditTarget(record); setModalOpen(true); };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    message.success('삭제되었습니다.');
  };

  const handleSave = (values: SampleFormValues) => {
    if (editTarget) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editTarget.id ? { ...item, ...values } : item,
        ),
      );
      message.success('수정되었습니다.');
    } else {
      const newItem: SampleItem = {
        ...values,
        id: nextId++,
        createdAt: dayjs().format('YYYY-MM-DD'),
      };
      setData((prev) => [newItem, ...prev]);
      message.success('등록되었습니다.');
    }
    setModalOpen(false);
  };

  const columns: ColumnsType<SampleItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '제목', dataIndex: 'title', key: 'title' },
    {
      title: '카테고리', dataIndex: 'category', key: 'category', width: 100,
      render: (v) => <Tag color="blue">{CATEGORY_LABELS[v] ?? v}</Tag>,
    },
    {
      title: '태그', dataIndex: 'tags', key: 'tags', width: 160,
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </Space>
      ),
    },
    {
      title: '성별', dataIndex: 'gender', key: 'gender', width: 70,
      render: (v) => (v === 'male' ? '남성' : '여성'),
    },
    {
      title: '취미', dataIndex: 'hobbies', key: 'hobbies', width: 160,
      render: (hobbies: string[]) => (
        <Space size={4} wrap>
          {hobbies.map((h) => <Tag key={h} color="green">{HOBBY_LABELS[h] ?? h}</Tag>)}
        </Space>
      ),
    },
    {
      title: '시작일', dataIndex: 'startDate', key: 'startDate', width: 110,
    },
    {
      title: '기간', key: 'period', width: 190,
      render: (_, r) => `${r.period[0]} ~ ${r.period[1]}`,
    },
    {
      title: '상태', dataIndex: 'active', key: 'active', width: 80,
      render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? '활성' : '비활성'}</Tag>,
    },
    {
      title: '등록일', dataIndex: 'createdAt', key: 'createdAt', width: 110,
    },
    {
      title: '관리', key: 'actions', width: 90, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm
            title="삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="삭제" cancelText="취소" okType="danger"
          >
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>샘플 폼</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          등록
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        scroll={{ x: 1100 }}
        pagination={{ pageSize: 10, showTotal: (t) => `총 ${t}건` }}
      />

      <SampleFormModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
