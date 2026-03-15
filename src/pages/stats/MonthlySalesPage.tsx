import { useState } from 'react';
import {
  Typography, Select, Button, Table, Row, Col, Card, Statistic, Tag,
} from 'antd';
import { SearchOutlined, DollarOutlined, ShoppingOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { salesStatsApi } from '../../api/system';
import type { MonthlySalesStat } from '../../types';

const { Title } = Typography;

const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const currentYear = dayjs().year();
const yearOptions = [currentYear - 2, currentYear - 1, currentYear].map((y) => ({ value: y, label: `${y}년` }));

export default function MonthlySalesPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [queryYear, setQueryYear] = useState(currentYear);

  const { data = [], isLoading } = useQuery({
    queryKey: ['sales-monthly', queryYear],
    queryFn: () => salesStatsApi.getMonthly({ year: queryYear }),
  });

  const handleSearch = () => setQueryYear(selectedYear);

  const annualRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const annualOrders = data.reduce((s, d) => s + d.orders, 0);
  const bestMonth = data.reduce((max, d) => (d.revenue > (max?.revenue ?? 0) ? d : max), data[0]);
  const avgMonthly = data.length > 0 ? Math.round(annualRevenue / data.filter((d) => d.revenue > 0).length) : 0;

  const columns: ColumnsType<MonthlySalesStat> = [
    {
      title: '월', dataIndex: 'month', key: 'month', width: 80,
      render: (m) => {
        const idx = parseInt(m.split('-')[1], 10) - 1;
        return <strong>{MONTH_LABELS[idx]}</strong>;
      },
    },
    {
      title: '매출', dataIndex: 'revenue', key: 'revenue', width: 180,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v, record) => {
        const isMax = record.month === bestMonth?.month;
        return (
          <span style={{ color: isMax ? '#faad14' : undefined, fontWeight: isMax ? 700 : undefined }}>
            {v.toLocaleString()}원
            {isMax && <Tag color="gold" style={{ marginLeft: 8 }}>최고</Tag>}
          </span>
        );
      },
    },
    {
      title: '주문 건수', dataIndex: 'orders', key: 'orders', width: 120,
      sorter: (a, b) => a.orders - b.orders,
      render: (v) => `${v.toLocaleString()}건`,
    },
    {
      title: '평균 주문금액', dataIndex: 'avgOrderValue', key: 'avgOrderValue', width: 140,
      render: (v) => `${v.toLocaleString()}원`,
    },
    {
      title: '전월 대비', dataIndex: 'growthRate', key: 'growthRate', width: 120,
      sorter: (a, b) => a.growthRate - b.growthRate,
      render: (v, _, idx) => {
        if (idx === 0) return <span style={{ color: '#999' }}>-</span>;
        const isUp = v >= 0;
        return (
          <span style={{ color: isUp ? '#52c41a' : '#ff4d4f' }}>
            {isUp ? <RiseOutlined /> : <FallOutlined />}
            {' '}{Math.abs(v).toFixed(1)}%
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>월별 매출</Title>
      </div>

      <Row gutter={8} style={{ marginBottom: 24 }}>
        <Col>
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            options={yearOptions}
            style={{ width: 120 }}
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
              title={`${queryYear}년 연간 매출`}
              value={annualRevenue}
              prefix={<DollarOutlined />}
              suffix="원"
              formatter={(v) => Number(v).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="연간 총 주문"
              value={annualOrders}
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
              title="월평균 매출"
              value={avgMonthly}
              suffix="원"
              valueStyle={{ color: '#52c41a' }}
              formatter={(v) => Number(v).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="최고 매출월"
              value={bestMonth ? MONTH_LABELS[parseInt(bestMonth.month.split('-')[1], 10) - 1] : '-'}
              valueStyle={{ color: '#faad14' }}
            />
            {bestMonth && (
              <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                {bestMonth.revenue.toLocaleString()}원
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="월별 매출 현황">
        <Table
          rowKey="month"
          columns={columns}
          dataSource={data}
          loading={isLoading}
          scroll={{ x: 650 }}
          pagination={false}
          summary={(rows) => {
            const total = rows.reduce((s, r) => s + r.revenue, 0);
            const totalOrd = rows.reduce((s, r) => s + r.orders, 0);
            return (
              <Table.Summary.Row style={{ fontWeight: 700, background: '#fafafa' }}>
                <Table.Summary.Cell index={0}>합계</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{total.toLocaleString()}원</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{totalOrd.toLocaleString()}건</Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </>
  );
}
