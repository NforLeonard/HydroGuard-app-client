import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartPoint } from '../hooks/useWaterData';
interface HistoricalChartProps {
  data: ChartPoint[];
}
export function HistoricalChart({
  data
}: HistoricalChartProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  return <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl border border-indigo-500/20 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">History</h3>
        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-indigo-500/10">
          {(['24h', '7d', '30d'] as const).map(range => <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-300 ${timeRange === range ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-slate-300'}`}>
              {range}
            </button>)}
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{
            fontSize: 10,
            fill: '#64748b'
          }} interval={3} />
            <Tooltip cursor={{
            fill: '#1e293b'
          }} contentStyle={{
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#1e293b',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
          }} itemStyle={{
            color: '#818cf8',
            fontSize: '12px',
            fontWeight: 600
          }} labelStyle={{
            color: '#94a3b8',
            fontSize: '10px',
            marginBottom: '4px'
          }} />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>;
}