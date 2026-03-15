import { useState } from 'react';
import {
  Table, Button, Space, Input, Select, Popconfirm,
  message, Typography, Row, Col, Tooltip, Tag, Image,
} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { bannersApi } from '../../../api/banners';
import type { Banner } from '../../../types';
import BannerFormModal from './BannerFormModal';

const { Title } = Typography;

export default function MainBannerPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['banners', 'main', { page, search, statusFilter }],
    queryFn: () => bannersApi.getAll({ type: 'main', page, limit: 10, search, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: bannersApi.remove,
    onSuccess: () => {
      message.success('배너가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['banners', 'main'] });
    },
    onError: () => message.error('삭제에 실패했습니다.'),
  });

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (record: Banner) => { setEditTarget(record); setModalOpen(true); };

  const columns: ColumnsType<Banner> = [
    {
      title: '순서', dataIndex: 'order', key: 'order', width: 70,
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: '미리보기', dataIndex: 'imageUrl', key: 'imageUrl', width: 120,
      render: (url) => (
        <Image
          src={url}
          width={80}
          height={40}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      ),
    },
    { title: '배너 제목', dataIndex: 'title', key: 'title' },
    { title: '링크 URL', dataIndex: 'linkUrl', key: 'linkUrl', ellipsis: true },
    {
      title: '노출 기간', key: 'period', width: 200,
      render: (_, r) => `${r.startDate} ~ ${r.endDate}`,
    },
    {
      title: '상태', dataIndex: 'status', key: 'status', width: 90,
      render: (v) => <Tag color={v === 'active' ? 'green' : 'default'}>{v === 'active' ? '활성' : '비활성'}</Tag>,
    },
    {
      title: '관리', key: 'actions', width: 100, fixed: 'right' as const,
      render: (_: any, record: Banner) => (
        <Space>
          <Tooltip title="수정">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="배너를 삭제하시겠습니까?"
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
        <Title level={4} style={{ margin: 0 }}>메인 배너</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          배너 추가
        </Button>
      </div>

      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="배너 제목 검색"
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
            style={{ width: 110 }}
            allowClear
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1); }}
            options={[
              { value: 'active', label: '활성' },
              { value: 'inactive', label: '비활성' },
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
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.total,
          onChange: setPage,
          showTotal: (total) => `총 ${total}개`,
          showSizeChanger: false,
        }}
      />

      <BannerFormModal
        open={modalOpen}
        type="main"
        editTarget={editTarget}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['banners', 'main'] });
        }}
      />
    </>
  );
}
