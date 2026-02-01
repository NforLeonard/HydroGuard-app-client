import React from 'react';
import { Metric } from '../hooks/useWaterData';
import { MetricCard } from './MetricCard';
interface MetricCardsSectionProps {
  metrics: Metric[];
}
export function MetricCardsSection({
  metrics
}: MetricCardsSectionProps) {
  return <div className="w-full overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 flex gap-3 snap-x snap-mandatory">
      {metrics.map(metric => <MetricCard key={metric.id} metric={metric} />)}
    </div>;
}