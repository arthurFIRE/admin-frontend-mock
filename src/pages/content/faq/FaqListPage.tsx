import { useState } from 'react';
import {
  Table, Button, Space, Input, Select, Popconfirm,
  message, Typography, Row, Col, Tooltip, Tag,
} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { faqsApi } from '../../../api/faqs';
import type { Faq } from '../../../types';
import FaqFormModal from './FaqFormModal';

const { Title } = Typography;

const CATEGORY_COLORS: Record<string, string> = {
  '이용방법': 'blue',
  '결제': 'gold',
  '서비스': 'green',
  '기타': 'default',
};

export default function FaqListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Faq | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['faqs', { page, search, categoryFilter, statusFilter }],
    queryFn: () => faqsApi.getAll({ page, limit: 10, search, category: categoryFilter, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: faqsApi.remove,
    onSuccess: () => {
      message.success('FAQ가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: () => message.error('삭제에 실패했습니다.'),
  });

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (record: Faq) => { setEditTarget(record); setModalOpen(true); };

  const columns: ColumnsType<Faq> = [
    {
      title: '카테고리', dataIndex: 'category', key: 'category', width: 110,
      render: (cat) => <Tag color={CATEGORY_COLORS[cat] ?? 'default'}>{cat}</Tag>,
    },
    {
      title: '질문', dataIndex: 'question', key: 'question',
      render: (q, record) => (
        <div>
          <div>{q}</div>
          <div style={{ color: '#999', fontSize: 12, marginTop: 2 }}>
            {record.answer.length > 60 ? record.answer.slice(0, 60) + '...' : record.answer}
          </div>
        </div>
      ),
    },
    { title: '순서', dataIndex: 'order', key: 'order', width: 70 },
    {
      title: '상태', dataIndex: 'status', key: 'status', width: 100,
      render: (v) => <Tag color={v === 'published' ? 'green' : 'default'}>{v === 'published' ? '게시됨' : '임시저장'}</Tag>,
    },
    {
      title: '수정일', dataIndex: 'updatedAt', key: 'updatedAt', width: 120,
      render: (v) => dayjs(v).format('YYYY-MM-DD'),
    },
    {
      title: '관리', key: 'actions', width: 100, fixed: 'right' as const,
      render: (_: any, record: Faq) => (
        <Space>
          <Tooltip title="수정">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="FAQ를 삭제하시겠습니까?"
              onConfirm={() => deleteMutation.mutate(record.id)}
              okText="삭제" cancelText="취소" okType="danger"
            >
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>FAQ 관리</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          FAQ 추가
        </Button>
      </div>

      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="질문 / 답변 검색"
            prefix={<SearchOutlined />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 220 }}
            allowClear
            onClear={() => { setSearchInput(''); setSearch(''); setPage(1); }}
          />
        </Col>
        <Col>
          <Select
            placeholder="카테고리"
            style={{ width: 120 }}
            allowClear
            value={categoryFilter}
            onChange={(v) => { setCategoryFilter(v); setPage(1); }}
            options={['이용방법', '결제', '서비스', '기타'].map((c) => ({ value: c, label: c }))}
          />
        </Col>
        <Col>
          <Select
            placeholder="상태"
            style={{ width: 110 }}
            allowClear
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1); }}
            options={[
              { value: 'published', label: '게시됨' },
              { value: 'draft', label: '임시저장' },
            ]}
          />
        </Col>
        <Col>
          <Button icon={<SearchOutlined />} onClick={handleSearch}>검색</Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        scroll={{ x: 800 }}
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.total,
          onChange: setPage,
          showTotal: (total) => `총 ${total}개`,
          showSizeChanger: false,
        }}
      />

      <FaqFormModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['faqs'] });
        }}
      />
    </>
  );
}
