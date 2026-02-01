// types/waterData.ts (create this file or add to existing types)
export interface WaterLevelDataPoint {
  timestamp: string;
  level: number;
}

export interface ChartPoint {
  x: string | number;
  y: number;
  // ... other properties if needed
}