import { useState, useEffect } from 'react';
import {
  Typography, Select, Table, Switch, Button, message, Spin, Tag, Space,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { groupsApi } from '../../../api/groups';
import type { Group, GroupPermission } from '../../../types';

const { Title, Text } = Typography;

export default function PermissionsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('g-001');
  const [localPerms, setLocalPerms] = useState<GroupPermission[]>([]);

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups', { page: 1, search: '' }],
    queryFn: () => groupsApi.getAll({ page: 1, limit: 100 }),
  });

  const { data: permsData, isLoading: permsLoading } = useQuery({
    queryKey: ['permissions', selectedGroupId],
    queryFn: () => groupsApi.getPermissions(selectedGroupId),
    enabled: !!selectedGroupId,
  });

  useEffect(() => {
    if (permsData) setLocalPerms(permsData);
  }, [permsData]);

  const saveMutation = useMutation({
    mutationFn: () =>
      groupsApi.updatePermissions(
        selectedGroupId,
        localPerms.map(({ menuKey, canRead, canWrite }) => ({ menuKey, canRead, canWrite })),
      ),
    onSuccess: () => message.success('권한이 저장되었습니다.'),
    onError: () => message.error('저장에 실패했습니다.'),
  });

  const togglePerm = (menuKey: string, field: 'canRead' | 'canWrite', value: boolean) => {
    setLocalPerms((prev) =>
      prev.map((p) => {
        if (p.menuKey !== menuKey) return p;
        const updated = { ...p, [field]: value };
        // canWrite requires canRead
        if (field === 'canWrite' && value) updated.canRead = true;
        // removing canRead also removes canWrite
        if (field === 'canRead' && !value) updated.canWrite = false;
        return updated;
      }),
    );
  };

  // group by category
  const categories = Array.from(new Set(localPerms.map((p) => p.menuCategory)));

  const allRows = categories.flatMap((cat) => {
    const items = localPerms.filter((p) => p.menuCategory === cat);
    return items.map((item, idx) => ({
      ...item,
      categoryRowSpan: idx === 0 ? items.length : 0,
      category: cat,
    }));
  });

  const columns: ColumnsType<(typeof allRows)[0]> = [
    {
      title: '카테고리', dataIndex: 'category', key: 'category', width: 140,
      onCell: (record) => ({ rowSpan: record.categoryRowSpan }),
      render: (cat) => <Tag color="geekblue">{cat}</Tag>,
    },
    { title: '메뉴', dataIndex: 'menuLabel', key: 'menuLabel', width: 180 },
    {
      title: '읽기', dataIndex: 'canRead', key: 'canRead', width: 90,
      render: (val, record) => (
        <Switch
          size="small"
          checked={val}
          onChange={(v) => togglePerm(record.menuKey, 'canRead', v)}
        />
      ),
    },
    {
      title: '쓰기', dataIndex: 'canWrite', key: 'canWrite', width: 90,
      render: (val, record) => (
        <Switch
          size="small"
          checked={val}
          onChange={(v) => togglePerm(record.menuKey, 'canWrite', v)}
        />
      ),
    },
  ];

  const groupOptions = (groupsData?.data ?? []).map((g: Group) => ({ value: g.id, label: g.name }));

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>권한 설정</Title>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => saveMutation.mutate()}
          loading={saveMutation.isPending}
        >
          저장
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Text strong>그룹 선택:</Text>
        <Select
          loading={groupsLoading}
          value={selectedGroupId}
          onChange={setSelectedGroupId}
          options={groupOptions}
          style={{ width: 200 }}
          placeholder="그룹을 선택하세요"
        />
      </Space>

      {permsLoading ? (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <Spin />
        </div>
      ) : (
        <Table
          rowKey="menuKey"
          columns={columns}
          dataSource={allRows}
          pagination={false}
          bordered
          scroll={{ x: 500 }}
        />
      )}
    </>
  );
}
