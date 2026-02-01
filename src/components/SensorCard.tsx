import React from 'react';
import { Sensor } from '../hooks/useWaterData';
import { ActivityIcon, BatteryIcon, WifiOffIcon, WrenchIcon } from 'lucide-react';
interface SensorCardProps {
  sensor: Sensor;
}
export function SensorCard({
  sensor
}: SensorCardProps) {
  const isOnline = sensor.status === 'active';
  const isMaintenance = sensor.status === 'maintenance';
  return <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col gap-3 hover:border-indigo-500/30 hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg transition-colors ${isOnline ? 'bg-indigo-500/20 text-indigo-400' : isMaintenance ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-500'}`}>
          {isOnline ? <ActivityIcon size={18} /> : isMaintenance ? <WrenchIcon size={18} /> : <WifiOffIcon size={18} />}
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
          <BatteryIcon size={12} />
          <span>{sensor.battery}%</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-white text-sm">{sensor.name}</h3>
        <p className="text-xs text-slate-400">{sensor.location}</p>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-indigo-500/10">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : isMaintenance ? 'bg-amber-400' : 'bg-slate-600'}`} />
        <span className="text-xs text-slate-400">
          {isOnline ? 'Online' : isMaintenance ? 'Maintenance' : 'Offline'} •{' '}
          {sensor.lastReading}
        </span>
      </div>
    </div>;
}