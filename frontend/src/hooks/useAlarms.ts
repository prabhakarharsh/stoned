import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

export function useAlarms() {
  const [alarms, setAlarms] = useState<any[]>([]);
  const [triggeredAlarm, setTriggeredAlarm] = useState<any>(null);

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    try {
      const data = await apiService.getAlarms();
      setAlarms(data);
    } catch (err) {
      console.error("Failed to load alarms", err);
    }
  };

  const toggleAlarm = async (id: number) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      const updated = { ...alarm, active: !alarm.active };
      await apiService.saveAlarm(updated);
      setAlarms(alarms.map(a => a.id === id ? updated : a));
    }
  };

  // Trigger Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      
      alarms.forEach(alarm => {
        if (alarm.active && `${alarm.time} ${alarm.ampm}` === nowTime) {
          if (!triggeredAlarm || triggeredAlarm.id !== alarm.id) {
            setTriggeredAlarm(alarm);
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, triggeredAlarm]);

  return { alarms, toggleAlarm, triggeredAlarm, setTriggeredAlarm, reload: loadAlarms };
}
