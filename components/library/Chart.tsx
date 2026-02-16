import React from 'react';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  type?: 'bar' | 'line' | 'pie';
  title?: string;
  height?: string;
  showLegend?: boolean;
  showValues?: boolean;
}

/**
 * Chart Component
 * 
 * A simple chart visualization component with bar, line, and pie options.
 * Uses CSS and SVG for rendering - no external chart libraries.
 * 
 * Usage:
 * <Chart 
 *   type="bar"
 *   title="Sales Data"
 *   data={[
 *     {label: 'Jan', value: 100},
 *     {label: 'Feb', value: 150}
 *   ]}
 * />
 */
export const Chart: React.FC<ChartProps> = ({
  data,
  type = 'bar',
  title,
  height = '300px',
  showLegend = true,
  showValues = false,
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  const defaultColors = [
    '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#ef4444', '#6366f1', '#14b8a6', '#f97316', '#06b6d4'
  ];
  
  const renderBarChart = () => (
    <div className="flex items-end justify-around gap-2 h-full px-4 pb-8">
      {data.map((point, index) => {
        const barHeight = (point.value / maxValue) * 100;
        const color = point.color || defaultColors[index % defaultColors.length];
        
        return (
          <div key={index} className="flex flex-col items-center flex-1 max-w-[100px]">
            <div className="w-full flex flex-col justify-end items-center" style={{ height: '100%' }}>
              {showValues && (
                <span className="text-xs font-semibold text-gray-700 mb-1">
                  {point.value}
                </span>
              )}
              <div
                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
  
  const renderLineChart = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (point.value / maxValue) * 90;
      return { x, y, ...point };
    });
    
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');
    
    return (
      <div className="relative h-full px-4 pb-8">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={pathData}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill="#0ea5e9"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((point, index) => (
            <span key={index} className="text-xs text-gray-600">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  const renderPieChart = () => {
    const total = data.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex items-center justify-center h-full gap-8 px-4">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          {data.map((point, index) => {
            const percentage = point.value / total;
            const angle = percentage * 360;
            const color = point.color || defaultColors[index % defaultColors.length];
            
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;
            
            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
        </svg>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div style={{ height }}>
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
      </div>
      
      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          {data.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: point.color || defaultColors[index % defaultColors.length]
                }}
              />
              <span className="text-sm text-gray-700">{point.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
