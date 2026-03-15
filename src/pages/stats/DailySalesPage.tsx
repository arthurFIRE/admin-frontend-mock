import { useState } from 'react';
import {
  Typography, DatePicker, Button, Table, Row, Col, Card, Statistic, Tag,
} from 'antd';
import { SearchOutlined, DollarOutlined, ShoppingOutlined, BarChartOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { salesStatsApi } from '../../api/system';
import type { DailySalesStat } from '../../types';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const DEFAULT_START = dayjs().subtract(29, 'day');
const DEFAULT_END = dayjs();

function formatWon(v: number) {
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)}억`;
  if (v >= 10_000) return `${Math.round(v / 10_000).toLocaleString()}만`;
  return v.toLocaleString();
}

export default function DailySalesPage() {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([DEFAULT_START, DEFAULT_END]);
  const [queryRange, setQueryRange] = useState<[string, string]>([
    DEFAULT_START.format('YYYY-MM-DD'),
    DEFAULT_END.format('YYYY-MM-DD'),
  ]);

  const { data = [], isLoading } = useQuery({
    queryKey: ['sales-daily', queryRange],
    queryFn: () => salesStatsApi.getDaily({ startDate: queryRange[0], endDate: queryRange[1] }),
  });

  const handleSearch = () => {
    if (range) setQueryRange([range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]);
  };

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const maxRevDay = data.reduce((max, d) => (d.revenue > (max?.revenue ?? 0) ? d : max), data[0]);

  const columns: ColumnsType<DailySalesStat> = [
    {
      title: '날짜', dataIndex: 'date', key: 'date', width: 120,
      render: (d) => {
        const dow = dayjs(d).day();
        const isWeekend = dow === 0 || dow === 6;
        return <span style={{ color: isWeekend ? '#ff4d4f' : undefined }}>{d}</span>;
      },
    },
    {
      title: '요일', dataIndex: 'date', key: 'dow', width: 70,
      render: (d) => {
        const labels = ['일', '월', '화', '수', '목', '금', '토'];
        const dow = dayjs(d).day();
        return <Tag color={dow === 0 || dow === 6 ? 'red' : 'default'}>{labels[dow]}</Tag>;
      },
    },
    {
      title: '매출', dataIndex: 'revenue', key: 'revenue', width: 160,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v) => `${v.toLocaleString()}원`,
    },
    {
      title: '주문 건수', dataIndex: 'orders', key: 'orders', width: 110,
      sorter: (a, b) => a.orders - b.orders,
      render: (v) => `${v.toLocaleString()}건`,
    },
    {
      title: '평균 주문금액', dataIndex: 'avgOrderValue', key: 'avgOrderValue', width: 140,
      sorter: (a, b) => a.avgOrderValue - b.avgOrderValue,
      render: (v) => `${v.toLocaleString()}원`,
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>일별 매출</Title>
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
            <Statistic
              title="기간 총 매출"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="원"
              formatter={(v) => Number(v).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="총 주문 건수"
              value={totalOrders}
              prefix={<ShoppingOutlined />}
              suffix="건"
              valueStyle={{ color: '#1677ff' }}
              formatter={(v) => Number(v).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="평균 주문금액"
              value={avgOrderValue}
              suffix="원"
              valueStyle={{ color: '#52c41a' }}
              formatter={(v) => Number(v).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="최고 매출일"
              value={maxRevDay ? `${formatWon(maxRevDay.revenue)}원` : '-'}
              valueStyle={{ color: '#faad14', fontSize: 18 }}
            />
            {maxRevDay && <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>{maxRevDay.date}</div>}
          </Card>
        </Col>
      </Row>

      <Card title={<><BarChartOutlined /> 일별 매출 현황</>}>
        <Table
          rowKey="date"
          columns={columns}
          dataSource={[...data].reverse()}
          loading={isLoading}
          scroll={{ x: 700 }}
          pagination={{ pageSize: 15, showSizeChanger: false, showTotal: (t) => `총 ${t}일` }}
        />
      </Card>
    </>
  );
}
