import React from 'react';
import { Metric } from '../hooks/useWaterData';
import { TrendIndicator } from './TrendIndicator';
interface MetricCardProps {
  metric: Metric;
}
export function MetricCard({
  metric
}: MetricCardProps) {
  const statusColors = {
    normal: 'bg-slate-800/50 border-indigo-500/20',
    warning: 'bg-amber-900/30 border-amber-500/30',
    critical: 'bg-red-900/30 border-red-500/30'
  };
  return <div className={`
      flex-shrink-0 w-40 p-4 rounded-xl border shadow-lg backdrop-blur-sm snap-start
      flex flex-col justify-between h-32 transition-all duration-300
      hover:-translate-y-1 hover:shadow-indigo-500/20
      ${statusColors[metric.status]}
    `}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-slate-400 truncate">
          {metric.label}
        </span>
        <TrendIndicator trend={metric.trend} />
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{metric.value}</span>
          <span className="text-xs text-slate-400 font-medium">
            {metric.unit}
          </span>
        </div>

        <div className={`text-xs font-medium mt-1 ${metric.change > 0 ? 'text-emerald-400' : metric.change < 0 ? 'text-red-400' : 'text-slate-500'}`}>
          {metric.change > 0 ? '+' : ''}
          {metric.change}%
        </div>
      </div>
    </div>;
}