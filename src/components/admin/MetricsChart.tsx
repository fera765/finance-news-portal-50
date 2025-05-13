
import React from "react";
import { 
  Area, 
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from "recharts";

interface DataPoint {
  month: string;
  views: number;
}

interface MetricsChartProps {
  data: DataPoint[];
}

const formatNumber = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

const MetricsChart: React.FC<MetricsChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={formatNumber}
            tickMargin={10}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toLocaleString()} visualizações`, 'Total']}
            labelFormatter={(label) => `Mês: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              padding: '10px',
              border: 'none'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#0070c0" 
            fill="url(#colorViews)" 
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bae0fd" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#bae0fd" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;
