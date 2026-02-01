import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
interface TrendIndicatorProps {
  trend: 'rising' | 'falling' | 'stable';
  className?: string;
}
export function TrendIndicator({
  trend,
  className = ''
}: TrendIndicatorProps) {
  if (trend === 'rising') {
    return <ArrowUpIcon className={`w-4 h-4 text-emerald-500 ${className}`} />;
  }
  if (trend === 'falling') {
    return <ArrowDownIcon className={`w-4 h-4 text-red-500 ${className}`} />;
  }
  return <MinusIcon className={`w-4 h-4 text-slate-400 ${className}`} />;
}