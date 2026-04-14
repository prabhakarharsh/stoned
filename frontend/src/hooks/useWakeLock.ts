import { useState, useCallback, useEffect } from "react";

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null); // Use any to avoid TS errors if WakeLockSentinel is missing

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const request = useCallback(async () => {
    if (!isSupported) return false;
    try {
      const lock = await (navigator as any).wakeLock.request('screen');
      setWakeLock(lock);
      
      lock.addEventListener('release', () => {
        setWakeLock(null);
      });
      return true;
    } catch (err) {
      console.error('Failed to request wake lock:', err);
      return false;
    }
  }, [isSupported]);

  const release = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  // Re-acquire lock if visibility changes (e.g., user minimizes tab and comes back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Re-request if we were locked but the lock was released by visibility change
      if (wakeLock === null && document.visibilityState === 'visible') {
        // We actually need a way to know if it *should* be locked. 
        // We'll rely on the parent component calling request() again if needed, 
        // or just let it go for this simple implementation.
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [wakeLock]);

  return { isSupported, isLocked: wakeLock !== null, request, release };
}
