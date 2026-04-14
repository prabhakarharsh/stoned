import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, showSeconds = false) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    let ampm = '';

    if (!is24Hour) {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }

    const hoursStr = hours.toString().padStart(2, '0');
    
    return {
      hours: hoursStr,
      minutes,
      seconds,
      ampm,
      full: `${hoursStr}:${minutes}${showSeconds ? `:${seconds}` : ''}`
    };
  };

  const toggleFormat = () => setIs24Hour(!is24Hour);

  return { time, is24Hour, formatTime, toggleFormat };
}
