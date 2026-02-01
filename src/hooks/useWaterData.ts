import { useState, useEffect, useCallback, useRef } from 'react';

// Define interfaces first
export interface Metric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'rising' | 'falling' | 'stable';
  change: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface Sensor {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'maintenance' | 'offline';
  battery: number;
  lastReading: string;
}

export interface ChartPoint {
  time: string;
  value: number;
}

// Function to determine status based on water level value
const getWaterLevelStatus = (value: number): 'normal' | 'warning' | 'critical' => {
  // Define your thresholds here
  if (value >= 200 && value <= 250) {
    return 'normal';
  } else if (value > 250 && value <= 280) {
    return 'warning';
  } else if (value > 280 || value < 200) {
    return 'critical';
  }
  return 'normal'; // default fallback
};

// Function to determine trend based on change - with appropriate thresholds
const getWaterLevelTrend = (change: number): 'rising' | 'falling' | 'stable' => {
  // For water level, even small changes matter
  if (change > 0.1) return 'rising';
  if (change < -0.1) return 'falling';
  return 'stable';
};

// Function for other metrics trend
const getMetricTrend = (change: number): 'rising' | 'falling' | 'stable' => {
  if (change > 0.5) return 'rising';
  if (change < -0.5) return 'falling';
  return 'stable';
};

// Initial data with explicit types - using proper change values
const initialMetrics: Metric[] = [
  {
    id: '1',
    label: 'Water Level',
    value: 220.8,
    unit: 'm',
    trend: 'rising',
    change: 2.3,
    status: 'normal'
  },
  {
    id: '2',
    label: 'Flow Rate',
    value: 450,
    unit: 'm³/h',
    trend: 'falling',
    change: -1.2,
    status: 'normal'
  },
  {
    id: '3',
    label: 'Pressure',
    value: 8.2,
    unit: 'bar',
    trend: 'stable',
    change: 0.1,
    status: 'warning'
  },
  {
    id: '4',
    label: 'Temperature',
    value: 18.5,
    unit: '°C',
    trend: 'rising',
    change: 0.5,
    status: 'normal'
  }
];

const initialSensors: Sensor[] = [
  {
    id: 's1',
    name: 'Inlet Valve A',
    location: 'North Sector',
    status: 'active',
    battery: 85,
    lastReading: '2m ago'
  },
  {
    id: 's2',
    name: 'Pump Station B',
    location: 'East Sector',
    status: 'active',
    battery: 92,
    lastReading: '1m ago'
  },
  {
    id: 's3',
    name: 'Overflow Sensor',
    location: 'South Sector',
    status: 'maintenance',
    battery: 45,
    lastReading: '15m ago'
  },
  {
    id: 's4',
    name: 'Quality Monitor',
    location: 'Main Tank',
    status: 'active',
    battery: 78,
    lastReading: '5m ago'
  }
];

export function useWaterData() {
  // Initialize state with explicit types
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [realtimeData, setRealtimeData] = useState<ChartPoint[]>([]);
  const [historicalData, setHistoricalData] = useState<ChartPoint[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isAlertActive, setIsAlertActive] = useState(false);
  
  // Track previous water level value to calculate actual change
  const [previousWaterLevel, setPreviousWaterLevel] = useState<number>(initialMetrics[0].value);
  const [previousStatus, setPreviousStatus] = useState<'normal' | 'warning' | 'critical'>('normal');
  
  // Track notification intervals
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const criticalAlertIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref for alert sound
  const alertSound = useRef<HTMLAudioElement | null>(null);

  // Initialize alert sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      alertSound.current = new Audio('/alert.mp3');
      alertSound.current.preload = 'auto';
    }
  }, []);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      } else {
        setNotificationPermission(Notification.permission);
      }
    }
  }, []);

  // Function to send browser notification
  const sendNotification = useCallback((title: string, body: string, isCritical: boolean = false) => {
    if (notificationPermission !== 'granted') {
      console.log('Notification permission not granted. Please enable notifications.');
      return;
    }

    // Send browser notification
    if ('Notification' in window) {
      const notification = new Notification(title, {
        body: body,
        icon: isCritical ? '/warning-red.png' : '/warning-yellow.png',
        badge: '/logo192.png',
        tag: 'water-level-alert',
        requireInteraction: isCritical,
        silent: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Play alert sound for critical notifications
      if (isCritical && alertSound.current) {
        alertSound.current.play().catch(e => console.log('Audio play failed:', e));
      }
    }

    // Also log to console for debugging
    console.log(`${new Date().toLocaleTimeString()}: ${title}: ${body}`);
  }, [notificationPermission]);

  // Function to send continuous critical alerts every 7 seconds
  const startContinuousCriticalAlerts = useCallback((waterLevel: number) => {
    // Clear any existing interval first
    if (criticalAlertIntervalRef.current) {
      clearInterval(criticalAlertIntervalRef.current);
    }
    
    // Send immediate alert
    sendNotification(
      '🚨 CRITICAL WATER LEVEL ALERT',
      `Water level is at ${waterLevel}m (CRITICAL LEVEL!). Immediate action required!`,
      true
    );
    
    // Set up interval for continuous alerts every 7 seconds
    criticalAlertIntervalRef.current = setInterval(() => {
      sendNotification(
        '🚨 CONTINUING CRITICAL ALERT',
        `Water level STILL at ${waterLevel}m (CRITICAL!). Immediate action STILL required!`,
        true
      );
    }, 7000); // Every 7 seconds
    
    console.log('Started continuous critical alerts every 7 seconds');
  }, [sendNotification]);

  // Function to stop continuous critical alerts
  const stopContinuousCriticalAlerts = useCallback(() => {
    if (criticalAlertIntervalRef.current) {
      clearInterval(criticalAlertIntervalRef.current);
      criticalAlertIntervalRef.current = null;
      console.log('Stopped continuous critical alerts');
    }
  }, []);

  // Function to send water level alert notifications
  const sendWaterLevelAlert = useCallback((waterLevel: number, status: 'warning' | 'critical') => {
    if (status === 'critical') {
      setIsAlertActive(true);
      startContinuousCriticalAlerts(waterLevel);
    } else if (status === 'warning') {
      // For warnings, send once only (not continuous)
      sendNotification(
        '⚠️ WATER LEVEL WARNING',
        `Water level is at ${waterLevel}m (WARNING ZONE). Monitor closely.`,
        false
      );
    }
  }, [sendNotification, startContinuousCriticalAlerts]);

  // Function to read the single value from text file
  const readWaterLevelFromFile = useCallback(async (): Promise<number> => {
    try {
      // Assuming Water_level.txt is in the public folder
      const response = await fetch('/Water_level.txt');
      
      if (!response.ok) {
        console.warn('Water_level.txt not found, using default value');
        return initialMetrics[0].value;
      }
      
      const content = await response.text();
      const trimmed = content.trim();
      const numberValue = parseFloat(trimmed);
      
      if (isNaN(numberValue)) {
        console.warn('Invalid number in Water_level.txt, using default value');
        return initialMetrics[0].value;
      }
      
      return numberValue;
    } catch (error) {
      console.error('Error reading water level file:', error);
      return initialMetrics[0].value;
    }
  }, []);

  // Function to update ONLY the water level in metrics array with status calculation
  const updateWaterLevel = useCallback(async (checkAlerts: boolean = true) => {
    const waterLevelValue = await readWaterLevelFromFile();
    
    // Calculate the actual change from previous value
    const change = waterLevelValue - previousWaterLevel;
    
    // Determine status based on value range
    const status = getWaterLevelStatus(waterLevelValue);
    
    // Determine trend based on change
    const trend = getWaterLevelTrend(change);
    
    // Check for status changes
    if (checkAlerts) {
      if (status !== previousStatus) {
        // Status changed
        if (status === 'critical') {
          sendWaterLevelAlert(waterLevelValue, status);
        } else if (status === 'warning') {
          sendWaterLevelAlert(waterLevelValue, status);
        } else if (status === 'normal' && previousStatus === 'critical') {
          // Returning to normal from critical - stop continuous alerts
          stopContinuousCriticalAlerts();
          setIsAlertActive(false);
          sendNotification(
            '✅ WATER LEVEL NORMAL',
            `Water level is back to normal at ${waterLevelValue}m.`,
            false
          );
        } else if (status === 'normal' && previousStatus === 'warning') {
          // Returning to normal from warning
          sendNotification(
            '✅ WATER LEVEL NORMAL',
            `Water level is back to normal at ${waterLevelValue}m.`,
            false
          );
        }
      } else {
        // Status didn't change - if still critical, ensure alerts continue
        if (status === 'critical') {
          // Still critical, make sure alerts are running
          if (!criticalAlertIntervalRef.current) {
            startContinuousCriticalAlerts(waterLevelValue);
          }
        }
      }
    }
    
    // Update states
    setPreviousWaterLevel(waterLevelValue);
    setPreviousStatus(status);
    
    setMetrics(prev => prev.map(metric => {
      if (metric.id === '1') {
        return {
          ...metric,
          value: waterLevelValue,
          change: Number(change.toFixed(1)),
          status: status,
          trend: trend
        };
      }
      return metric;
    }));
    
    return { waterLevelValue, status, change, trend };
  }, [
    readWaterLevelFromFile, 
    previousWaterLevel, 
    previousStatus, 
    sendWaterLevelAlert, 
    sendNotification, 
    stopContinuousCriticalAlerts, 
    startContinuousCriticalAlerts
  ]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
      if (criticalAlertIntervalRef.current) {
        clearInterval(criticalAlertIntervalRef.current);
      }
    };
  }, []);

  // Initialize data
  const initializeData = useCallback(async () => {
    // Update water level from file first (don't check alerts on initialization)
    const result = await updateWaterLevel(false);
    
    // If change is 0 initially (first read), set a reasonable trend
    if (result.change === 0) {
      setMetrics(prev => prev.map(metric => {
        if (metric.id === '1') {
          return {
            ...metric,
            trend: 'stable' as const,
            change: 0.1
          };
        }
        return metric;
      }));
    }

    // Historical data (last 24 hours)
    const history: ChartPoint[] = [];
    const now = new Date();
    
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      history.push({
        time: `${time.getHours()}:00`,
        value: 10 + Math.random() * 5
      });
    }
    setHistoricalData(history);

    // Realtime data (last 30 minutes)
    const rt: ChartPoint[] = [];
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 1000);
      rt.push({
        time: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
        value: 12 + Math.random() * 0.5
      });
    }
    setRealtimeData(rt);
  }, [updateWaterLevel]);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Continuous water level monitoring from file with alerts - EVERY 5 SECONDS
  useEffect(() => {
    const waterLevelInterval = setInterval(async () => {
      await updateWaterLevel(true); // Check alerts on each update
    }, 5000); // Check water level from file every 5 seconds (more frequent)
    
    return () => clearInterval(waterLevelInterval);
  }, [updateWaterLevel]);

  // Simulate real-time updates for other metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        if (m.id === '1') {
          return m;
        }
        const newValue = Number((m.value + (Math.random() - 0.5) * 0.1).toFixed(1));
        const newChange = Number((m.change + (Math.random() - 0.5) * 0.1).toFixed(1));
        
        return {
          ...m,
          value: newValue,
          change: newChange,
          trend: getMetricTrend(newChange)
        };
      }));

      const now = new Date();
      const newPoint: ChartPoint = {
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
        value: 12 + Math.random() * 0.5
      };
      setRealtimeData(prev => [...prev.slice(1), newPoint]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Refresh data function
  const refreshData = useCallback(async (): Promise<void> => {
    return new Promise<void>(resolve => {
      setTimeout(async () => {
        await updateWaterLevel(true);
        
        setMetrics(prev => prev.map(m => {
          if (m.id === '1') {
            return m;
          }
          const newValue = Number((m.value + (Math.random() - 0.5)).toFixed(1));
          const newChange = Number((m.change + (Math.random() - 0.5) * 0.2).toFixed(1));
          
          return {
            ...m,
            value: newValue,
            change: newChange,
            trend: getMetricTrend(newChange)
          };
        }));
        
        setSensors(prev => prev.map(s => ({
          ...s,
          battery: Math.max(0, Math.min(100, s.battery + (Math.random() - 0.5) * 2)),
          lastReading: `${Math.floor(Math.random() * 10) + 1}m ago`
        })));
        
        resolve();
      }, 1500);
    });
  }, [updateWaterLevel]);

  // Function to manually request notification permission
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    }
    return 'denied';
  }, []);

  // Function to manually test notifications
  const testNotification = useCallback(() => {
    sendNotification(
      '🔔 TEST NOTIFICATION',
      'This is a test notification from Water Monitoring System.',
      false
    );
  }, [sendNotification]);

  // Function to manually trigger critical alert for testing
  const triggerCriticalAlert = useCallback(() => {
    const waterLevel = metrics.find(m => m.id === '1')?.value || 290;
    startContinuousCriticalAlerts(waterLevel);
    setIsAlertActive(true);
  }, [metrics, startContinuousCriticalAlerts]);

  // Function to stop all alerts
  const stopAllAlerts = useCallback(() => {
    stopContinuousCriticalAlerts();
    setIsAlertActive(false);
    sendNotification(
      '⏹️ ALERTS STOPPED',
      'All critical alerts have been manually stopped.',
      false
    );
  }, [stopContinuousCriticalAlerts, sendNotification]);

  return {
    metrics,
    sensors,
    realtimeData,
    historicalData,
    refreshData,
    updateWaterLevel,
    notificationPermission,
    isAlertActive,
    requestNotificationPermission,
    testNotification,
    triggerCriticalAlert,
    stopAllAlerts
  };
}