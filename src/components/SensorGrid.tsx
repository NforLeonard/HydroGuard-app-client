import React from 'react';
import { Sensor } from '../hooks/useWaterData';
import { SensorCard } from './SensorCard';
interface SensorGridProps {
  sensors: Sensor[];
}
export function SensorGrid({
  sensors
}: SensorGridProps) {
  return <div className="grid grid-cols-2 gap-3">
      {sensors.map(sensor => <SensorCard key={sensor.id} sensor={sensor} />)}
    </div>;
}