import { useState } from 'react';
import {
  Table, Button, Space, Input, Select, Popconfirm,
  message, Typography, Row, Col, Tooltip, Tag, Alert,
} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { systemApi } from '../../../api/system';
import type { AccessRule } from '../../../types';
import AccessRuleFormModal from './AccessRuleFormModal';

const { Title } = Typography;

export default function AccessControlPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AccessRule | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['access-rules', { page, search, typeFilter, statusFilter }],
    queryFn: () => systemApi.getAccessRules({ page, limit: 10, search, type: typeFilter, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: systemApi.deleteAccessRule,
    onSuccess: () => {
      message.success('규칙이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['access-rules'] });
    },
    onError: () => message.error('삭제에 실패했습니다.'),
  });

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (record: AccessRule) => { setEditTarget(record); setModalOpen(true); };

  const columns: ColumnsType<AccessRule> = [
    {
      title: '유형', dataIndex: 'type', key: 'type', width: 100,
      render: (v) => (
        <Tag color={v === 'allow' ? 'green' : 'red'} icon={<SafetyOutlined />}>
          {v === 'allow' ? '허용' : '차단'}
        </Tag>
      ),
    },
    { title: 'IP 주소 / CIDR', dataIndex: 'ipAddress', key: 'ipAddress', width: 180 },
    { title: '설명', dataIndex: 'description', key: 'description' },
    {
      title: '상태', dataIndex: 'status', key: 'status', width: 90,
      render: (v) => <Tag color={v === 'active' ? 'blue' : 'default'}>{v === 'active' ? '활성' : '비활성'}</Tag>,
    },
    {
      title: '등록일', dataIndex: 'createdAt', key: 'createdAt', width: 120,
      render: (v) => dayjs(v).format('YYYY-MM-DD'),
    },
    {
      title: '관리', key: 'actions', width: 100, fixed: 'right' as const,
      render: (_: any, record: AccessRule) => (
        <Space>
          <Tooltip title="수정">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="규칙을 삭제하시겠습니까?"
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
        <Title level={4} style={{ margin: 0 }}>접근 권한 관리</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          규칙 추가
        </Button>
      </div>

      <Alert
        type="info"
        message="IP 기반 접근 제어 규칙을 설정합니다. 허용(Allow) 규칙이 차단(Deny) 규칙보다 우선 적용됩니다."
        style={{ marginBottom: 16 }}
        showIcon
      />

      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="IP 주소 / 설명 검색"
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
            placeholder="유형"
            style={{ width: 110 }}
            allowClear
            value={typeFilter}
            onChange={(v) => { setTypeFilter(v); setPage(1); }}
            options={[
              { value: 'allow', label: '허용' },
              { value: 'deny', label: '차단' },
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

      <AccessRuleFormModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['access-rules'] });
        }}
      />
    </>
  );
}
