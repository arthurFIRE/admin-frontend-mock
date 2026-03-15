import { Result, Button, Typography, Space } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface Props {
  title: string;
  description?: string;
  badge?: string;
}

export default function PlaceholderPage({ title, description, badge }: Props) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '60px 0' }}>
      <Result
        icon={<ToolOutlined style={{ color: '#1677ff', fontSize: 48 }} />}
        title={
          <Space size={8} align="center">
            <span style={{ fontSize: 22, fontWeight: 600 }}>{title}</span>
            {badge && (
              <Text
                style={{
                  fontSize: 11,
                  background: '#e6f4ff',
                  color: '#1677ff',
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid #91caff',
                  fontWeight: 500,
                  verticalAlign: 'middle',
                }}
              >
                {badge}
              </Text>
            )}
          </Space>
        }
        subTitle={
          <span style={{ color: '#888', fontSize: 14 }}>
            {description ?? '해당 기능은 현재 개발 중입니다. 곧 만나보실 수 있습니다.'}
          </span>
        }
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            대시보드로 이동
          </Button>
        }
      />
    </div>
  );
}
