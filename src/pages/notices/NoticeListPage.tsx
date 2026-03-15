import { useState } from 'react';
import {
  Table, Button, Space, Tag, Input, Select, Popconfirm,
  message, Typography, Row, Col,
} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, PushpinOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { noticesApi } from '../../api/notices';
import type { Notice } from '../../types';
import NoticeFormModal from './NoticeFormModal';

const { Title } = Typography;

export default function NoticeListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<'published' | 'draft' | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Notice | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['notices', { page, search, statusFilter }],
    queryFn: () => noticesApi.getAll({ page, limit: 10, search, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: noticesApi.remove,
    onSuccess: () => {
      message.success('공지사항이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: () => message.error('삭제에 실패했습니다.'),
  });

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (record: Notice) => { setEditTarget(record); setModalOpen(true); };

  const columns: ColumnsType<Notice> = [
    {
      title: '', key: 'pin', width: 32,
      render: (_, record) =>
        record.isPinned ? <PushpinOutlined style={{ color: '#1677ff' }} /> : null,
    },
    {
      title: '제목', dataIndex: 'title', key: 'title',
      render: (title, record) => (
        <Space>
          <span>{title}</span>
          {record.isPinned && <Tag color="blue" style={{ fontSize: 11 }}>고정</Tag>}
        </Space>
      ),
    },
    {
      title: '상태', dataIndex: 'status', key: 'status', width: 90,
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'default'}>
          {status === 'published' ? '게시됨' : '임시저장'}
        </Tag>
      ),
    },
    {
      title: '작성자', key: 'author', width: 100,
      render: (_, record) => record.author?.name ?? '-',
    },
    {
      title: '등록일', dataIndex: 'createdAt', key: 'createdAt', width: 120,
      render: (v) => dayjs(v).format('YYYY-MM-DD'),
    },
    {
      title: '관리', key: 'actions', width: 100, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm
            title="정말 삭제하시겠습니까?"
            onConfirm={() => deleteMutation.mutate(record.id)}
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
        <Title level={4} style={{ margin: 0 }}>공지사항 관리</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          공지사항 추가
        </Button>
      </div>

      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="제목 검색"
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
            placeholder="상태"
            style={{ width: 120 }}
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
        scroll={{ x: 700 }}
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.total,
          onChange: setPage,
          showTotal: (total) => `총 ${total}건`,
          showSizeChanger: false,
        }}
      />

      <NoticeFormModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['notices'] });
        }}
      />
    </>
  );
}
