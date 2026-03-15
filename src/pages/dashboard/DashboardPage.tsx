import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  NotificationOutlined,
  FileTextOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { statsApi } from '../../api/stats';
import type { User, Notice } from '../../types';

const { Title } = Typography;

const userColumns: ColumnsType<User> = [
  { title: '아이디', dataIndex: 'loginId', key: 'loginId' },
  { title: '이름', dataIndex: 'name', key: 'name' },
  {
    title: '권한', dataIndex: 'role', key: 'role', width: 90,
    render: (role) => (
      <Tag color={role === 'admin' ? 'blue' : 'default'}>
        {role === 'admin' ? '관리자' : '일반'}
      </Tag>
    ),
  },
  {
    title: '가입일', dataIndex: 'createdAt', key: 'createdAt', width: 110,
    render: (v) => dayjs(v).format('YYYY-MM-DD'),
  },
];

const noticeColumns: ColumnsType<Notice> = [
  { title: '제목', dataIndex: 'title', key: 'title', ellipsis: true },
  {
    title: '상태', dataIndex: 'status', key: 'status', width: 100,
    render: (status) => (
      <Tag color={status === 'published' ? 'green' : 'default'}>
        {status === 'published' ? '게시됨' : '임시저장'}
      </Tag>
    ),
  },
  {
    title: '등록일', dataIndex: 'createdAt', key: 'createdAt', width: 110,
    render: (v) => dayjs(v).format('YYYY-MM-DD'),
  },
];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.getSummary,
  });

  const cardStyle = { height: '100%' };

  return (
    <>
      <Title level={4} style={{ margin: '0 0 20px' }}>대시보드</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card style={cardStyle}>
            <Statistic
              title="전체 사용자"
              value={data?.users.total ?? 0}
              prefix={<TeamOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={cardStyle}>
            <Statistic
              title="관리자"
              value={data?.users.adminCount ?? 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={cardStyle}>
            <Statistic
              title="활성 사용자"
              value={data?.users.activeCount ?? 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={cardStyle}>
            <Statistic
              title="전체 공지사항"
              value={data?.notices.total ?? 0}
              prefix={<NotificationOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={cardStyle}>
            <Statistic
              title="게시된 공지"
              value={data?.notices.publishedCount ?? 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={cardStyle}>
            <Statistic
              title="임시저장"
              value={data?.notices.draftCount ?? 0}
              prefix={<EditOutlined />}
              valueStyle={{ color: '#faad14' }}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="최근 가입 사용자" style={{ marginBottom: 16 }}>
            <Table
              rowKey="id"
              columns={userColumns}
              dataSource={data?.recentUsers}
              loading={isLoading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="최근 공지사항">
            <Table
              rowKey="id"
              columns={noticeColumns}
              dataSource={data?.recentNotices}
              loading={isLoading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
