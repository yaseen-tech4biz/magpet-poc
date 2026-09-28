import { useState, useEffect, useCallback } from 'react';
import { useToastStore } from '../store/useToastStore';
import { warmOfflineCache } from '../utils/offlineManager';

/**
 * Custom React hook to track real-time network connectivity and offline status.
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true;
  });

  const [offlineSince, setOfflineSince] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineSince(null);

      useToastStore.getState().addToast({
        title: 'Network Restored',
        message: 'Online connection active. Offline cache synchronized.',
        type: 'success'
      });

      warmOfflineCache();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineSince(Date.now());

      useToastStore.getState().addToast({
        title: 'Working in Offline Mode',
        message: 'No internet connection detected. Local engine, cache, and state remain 100% operational.',
        type: 'warning'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnection = useCallback(() => {
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setIsOnline(online);
    return online;
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    offlineSince,
    checkConnection
  };
};

export default useNetworkStatus;
