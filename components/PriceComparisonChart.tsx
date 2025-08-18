
import React from 'react';
import type { PricePoint } from '../types';
import { Card } from './shared/Card';
import { Loader } from './shared/Loader';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface PriceComparisonChartProps {
  insights?: PricePoint[];
  isLoading: boolean;
}

const Chart: React.FC<{ data: PricePoint[] }> = ({ data }) => {
    const highestPrice = Math.ceil(Math.max(...data.map(p => p.maxPrice), 0) / 10) * 10;
    const chartHeight = 250;
    const barWidth = 40;
    const gap = 20;
    const svgWidth = data.length * (barWidth + gap);

    const scaleY = (value: number) => chartHeight - (value / highestPrice) * chartHeight;

    return (
        <div className="overflow-x-auto p-2 -ml-2">
            <svg width={svgWidth > 0 ? svgWidth : '100%'} height={chartHeight + 40} className="font-sans min-w-[200px]">
                <g>
                    {data.map((point, index) => {
                        const x = index * (barWidth + gap);
                        const y1 = scaleY(point.maxPrice);
                        const y2 = scaleY(point.minPrice);
                        const yAvg = scaleY(point.avgPrice);

                        return (
                            <g key={point.source} className="group" aria-label={`Price for ${point.source}: Min $${point.minPrice.toFixed(2)}, Avg $${point.avgPrice.toFixed(2)}, Max $${point.maxPrice.toFixed(2)}`}>
                                <rect
                                    x={x}
                                    y={y1}
                                    width={barWidth}
                                    height={Math.max(2, y2 - y1)}
                                    className="fill-cyan-600/30 group-hover:fill-cyan-600/50 transition-colors"
                                    rx="4"
                                />
                                <line
                                    x1={x}
                                    y1={yAvg}
                                    x2={x + barWidth}
                                    y2={yAvg}
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    className="opacity-75"
                                />
                                <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" className="text-xs fill-slate-400">{point.source}</text>
                                
                                <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-y-2">
                                    <rect x={x - 20} y={y1 - 45} width="80" height="40" rx="5" className="fill-slate-900/80 stroke-slate-600" />
                                    <text x={x + barWidth/2} y={y1 - 28} textAnchor="middle" className="text-xs fill-slate-200 font-semibold">
                                        Avg: ${point.avgPrice.toFixed(2)}
                                    </text>
                                    <text x={x + barWidth/2} y={y1 - 12} textAnchor="middle" className="text-xs fill-slate-400">
                                       ${point.minPrice.toFixed(2)} - ${point.maxPrice.toFixed(2)}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </g>
                 {/* Y-Axis labels */}
                <text x="-5" y="10" textAnchor="end" className="text-xs fill-slate-500">${highestPrice.toFixed(0)}</text>
                <text x="-5" y={chartHeight} textAnchor="end" className="text-xs fill-slate-500">$0</text>
            </svg>
        </div>
    );
};


export const PriceComparisonChart: React.FC<PriceComparisonChartProps> = ({ insights, isLoading }) => {
  const content = () => {
    if (isLoading) {
      return <Loader message="Analyzing price data..." />;
    }
    if (!insights || insights.length === 0) {
      return <p className="text-slate-400 text-center py-4">No price comparison data available.</p>;
    }
    return <Chart data={insights} />;
  };

  return (
    <Card title="Price Comparison" icon={<TrendingUpIcon />}>
      {content()}
    </Card>
  );
};
