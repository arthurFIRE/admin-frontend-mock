import { useState } from 'react';
import {
  Table, Button, Space, Input, Popconfirm,
  message, Typography, Row, Col, Tooltip, Tag,
} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { groupsApi } from '../../../api/groups';
import type { Group } from '../../../types';
import GroupFormModal from './GroupFormModal';

const { Title } = Typography;

export default function GroupListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Group | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['groups', { page, search }],
    queryFn: () => groupsApi.getAll({ page, limit: 10, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: groupsApi.remove,
    onSuccess: () => {
      message.success('그룹이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: () => message.error('삭제에 실패했습니다.'),
  });

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (record: Group) => { setEditTarget(record); setModalOpen(true); };

  const columns: ColumnsType<Group> = [
    {
      title: '그룹명', dataIndex: 'name', key: 'name', width: 160,
      render: (name) => (
        <Space>
          <TeamOutlined />
          <strong>{name}</strong>
        </Space>
      ),
    },
    { title: '설명', dataIndex: 'description', key: 'description' },
    {
      title: '멤버 수', dataIndex: 'memberCount', key: 'memberCount', width: 100,
      render: (count) => <Tag color="blue">{count}명</Tag>,
    },
    {
      title: '생성일', dataIndex: 'createdAt', key: 'createdAt', width: 120,
      render: (v) => dayjs(v).format('YYYY-MM-DD'),
    },
    {
      title: '관리', key: 'actions', width: 100, fixed: 'right' as const,
      render: (_: any, record: Group) => (
        <Space>
          <Tooltip title="수정">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="그룹을 삭제하시겠습니까?"
              description="삭제 시 해당 그룹의 권한 설정도 함께 삭제됩니다."
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
        <Title level={4} style={{ margin: 0 }}>그룹 목록</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          그룹 추가
        </Button>
      </div>

      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="그룹명 / 설명 검색"
            prefix={<SearchOutlined />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 240 }}
            allowClear
            onClear={() => { setSearchInput(''); setSearch(''); setPage(1); }}
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
          showTotal: (total) => `총 ${total}개`,
          showSizeChanger: false,
        }}
      />

      <GroupFormModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['groups'] });
        }}
      />
    </>
  );
}
