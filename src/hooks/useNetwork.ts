import { useState, useEffect } from 'react';

interface NetworkState {
  isOnline: boolean;
  isConnectionSlow: boolean;
}

export const useNetwork = (): NetworkState => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: true,
    isConnectionSlow: false,
  });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setNetworkState(prev => ({ ...prev, isOnline: false }));
    };

    const checkConnectionSpeed = async () => {
      try {
        const startTime = performance.now();
        await fetch('/api/health-check', {
          method: 'HEAD',
        });
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        setNetworkState(prev => ({
          ...prev,
          isConnectionSlow: duration > 3000, // 3초 이상이면 느린 연결로 간주
        }));
      } catch (error) {
        console.error('Connection speed check failed:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 주기적으로 연결 속도 체크
    const intervalId = setInterval(checkConnectionSpeed, 30000); // 30초마다 체크

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  return networkState;
}; 