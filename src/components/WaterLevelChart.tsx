import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartPoint } from '../hooks/useWaterData';
interface WaterLevelChartProps {
  data: ChartPoint[];
}
export function WaterLevelChart({
  data
}: WaterLevelChartProps) {
  return <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl border border-indigo-500/20 shadow-lg">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="font-semibold text-white">Real-time Level</h3>
        <p className="text-xs text-slate-400">Last 30 minutes</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="text-xs font-medium text-indigo-400">Live</span>
      </div>
    </div>

    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{
            fontSize: 10,
            fill: '#64748b'
          }} interval={4} />
          <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip contentStyle={{
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
          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={true} animationDuration={1000} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>;
}