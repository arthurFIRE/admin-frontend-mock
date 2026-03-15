import { useState } from 'react';
import {
  Typography, DatePicker, Button, Table, Row, Col, Card, Statistic, Tag,
} from 'antd';
import { SearchOutlined, EyeOutlined, UserOutlined, BarChartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { visitorStatsApi } from '../../api/system';
import type { VisitorStat } from '../../types';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const DEFAULT_START = dayjs().subtract(29, 'day');
const DEFAULT_END = dayjs();

function formatSec(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}분 ${s}초`;
}

export default function VisitorStatsPage() {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([DEFAULT_START, DEFAULT_END]);
  const [queryRange, setQueryRange] = useState<[string, string]>([
    DEFAULT_START.format('YYYY-MM-DD'),
    DEFAULT_END.format('YYYY-MM-DD'),
  ]);

  const { data = [], isLoading } = useQuery({
    queryKey: ['visitor-stats', queryRange],
    queryFn: () => visitorStatsApi.getStats({ startDate: queryRange[0], endDate: queryRange[1] }),
  });

  const handleSearch = () => {
    if (range) {
      setQueryRange([range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]);
    }
  };

  const totalVisitors = data.reduce((s, d) => s + d.visitors, 0);
  const totalUnique = data.reduce((s, d) => s + d.uniqueVisitors, 0);
  const totalPageViews = data.reduce((s, d) => s + d.pageViews, 0);
  const avgSession = data.length > 0 ? Math.round(data.reduce((s, d) => s + d.avgSessionSec, 0) / data.length) : 0;

  const columns: ColumnsType<VisitorStat> = [
    {
      title: '날짜', dataIndex: 'date', key: 'date', width: 120,
      render: (d) => {
        const dow = dayjs(d).day();
        const isWeekend = dow === 0 || dow === 6;
        return <span style={{ color: isWeekend ? '#ff4d4f' : undefined }}>{d}</span>;
      },
    },
    {
      title: '방문자 수', dataIndex: 'visitors', key: 'visitors', width: 120,
      sorter: (a, b) => a.visitors - b.visitors,
      render: (v) => v.toLocaleString(),
    },
    {
      title: '순 방문자', dataIndex: 'uniqueVisitors', key: 'uniqueVisitors', width: 120,
      sorter: (a, b) => a.uniqueVisitors - b.uniqueVisitors,
      render: (v) => v.toLocaleString(),
    },
    {
      title: '페이지뷰', dataIndex: 'pageViews', key: 'pageViews', width: 120,
      sorter: (a, b) => a.pageViews - b.pageViews,
      render: (v) => v.toLocaleString(),
    },
    {
      title: '평균 체류 시간', dataIndex: 'avgSessionSec', key: 'avgSessionSec', width: 140,
      sorter: (a, b) => a.avgSessionSec - b.avgSessionSec,
      render: (v) => formatSec(v),
    },
    {
      title: '페이지뷰/방문자', key: 'ratio', width: 140,
      render: (_, r) => (r.visitors > 0 ? (r.pageViews / r.visitors).toFixed(1) : '-'),
    },
    {
      title: '요일', dataIndex: 'date', key: 'dow', width: 70,
      render: (d) => {
        const labels = ['일', '월', '화', '수', '목', '금', '토'];
        const dow = dayjs(d).day();
        return <Tag color={dow === 0 || dow === 6 ? 'red' : 'default'}>{labels[dow]}</Tag>;
      },
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>방문 통계</Title>
      </div>

      <Row gutter={8} style={{ marginBottom: 24 }}>
        <Col>
          <RangePicker
            value={range}
            onChange={(v) => { if (v) setRange(v as [Dayjs, Dayjs]); }}
            allowClear={false}
          />
        </Col>
        <Col>
          <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>조회</Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="총 방문자" value={totalVisitors} prefix={<UserOutlined />} formatter={(v) => Number(v).toLocaleString()} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="순 방문자" value={totalUnique} prefix={<UserOutlined />} valueStyle={{ color: '#1677ff' }} formatter={(v) => Number(v).toLocaleString()} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="총 페이지뷰" value={totalPageViews} prefix={<EyeOutlined />} valueStyle={{ color: '#52c41a' }} formatter={(v) => Number(v).toLocaleString()} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="평균 체류 시간" value={formatSec(avgSession)} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card title={<><BarChartOutlined /> 일별 방문 현황</>}>
        <Table
          rowKey="date"
          columns={columns}
          dataSource={[...data].reverse()}
          loading={isLoading}
          scroll={{ x: 800 }}
          pagination={{ pageSize: 15, showSizeChanger: false, showTotal: (t) => `총 ${t}일` }}
        />
      </Card>
    </>
  );
}
