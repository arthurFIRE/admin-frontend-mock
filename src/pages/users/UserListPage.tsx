import { useState } from 'react';
import {
  Table, Button, Space, Tag, Input, Select, Popconfirm,
  message, Typography, Row, Col, Tooltip,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, KeyOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { usersApi } from '../../api/users';
import { authStore } from '../../store/authStore';
import type { User } from '../../types';
import UserFormModal from './UserFormModal';
import ResetPasswordModal from './ResetPasswordModal';

const { Title } = Typography;

export default function UserListPage() {
  const queryClient = useQueryClient();
  const currentUser = authStore.getUser();
  const isAdmin = currentUser?.role === 'admin';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState<'admin' | 'user' | undefined>();
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [resetPwTarget, setResetPwTarget] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', { page, search, roleFilter, statusFilter }],
    queryFn: () =>
      usersApi.getAll({ page, limit: 10, search, role: roleFilter, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => {
      message.success('사용자가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => message.error('삭제에 실패했습니다.'),
  });

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (record: User) => { setEditTarget(record); setModalOpen(true); };

  const columns: ColumnsType<User> = [
    { title: '아이디', dataIndex: 'loginId', key: 'loginId', width: 120 },
    { title: '이름', dataIndex: 'name', key: 'name', width: 120 },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    {
      title: '권한', dataIndex: 'role', key: 'role', width: 90,
      render: (role) => (
        <Tag color={role === 'admin' ? 'blue' : 'default'}>
          {role === 'admin' ? '관리자' : '일반'}
        </Tag>
      ),
    },
    {
      title: '상태', dataIndex: 'status', key: 'status', width: 90,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '활성' : '비활성'}
        </Tag>
      ),
    },
    {
      title: '가입일', dataIndex: 'createdAt', key: 'createdAt', width: 120,
      render: (v) => dayjs(v).format('YYYY-MM-DD'),
    },
    ...(isAdmin ? [{
      title: '관리', key: 'actions', width: 120, fixed: 'right' as const,
      render: (_: any, record: User) => (
        <Space>
          <Tooltip title="수정">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="비밀번호 초기화">
            <Button
              type="text"
              icon={<KeyOutlined />}
              size="small"
              onClick={() => setResetPwTarget(record)}
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="정말 삭제하시겠습니까?"
              onConfirm={() => deleteMutation.mutate(record.id)}
              okText="삭제" cancelText="취소" okType="danger"
            >
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    }] : []),
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>사용자 관리</Title>
        {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            사용자 추가
          </Button>
        )}
      </div>

      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="아이디 / 이름 / 이메일 검색"
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
          <Select
            placeholder="권한"
            style={{ width: 110 }}
            allowClear
            value={roleFilter}
            onChange={(v) => { setRoleFilter(v); setPage(1); }}
            options={[
              { value: 'admin', label: '관리자' },
              { value: 'user', label: '일반' },
            ]}
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
        scroll={{ x: 800 }}
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.total,
          onChange: setPage,
          showTotal: (total) => `총 ${total}명`,
          showSizeChanger: false,
        }}
      />

      {isAdmin && (
        <>
          <UserFormModal
            open={modalOpen}
            editTarget={editTarget}
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['users'] });
            }}
          />
          <ResetPasswordModal
            open={!!resetPwTarget}
            target={resetPwTarget}
            onClose={() => setResetPwTarget(null)}
          />
        </>
      )}
    </>
  );
}
