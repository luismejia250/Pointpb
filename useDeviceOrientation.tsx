import { useState, useEffect } from 'react';

interface DeviceOrientation {
  alpha: number | null; // [0, 360) - z-axis
  beta: number | null;  // [-180, 180) - x-axis
  gamma: number | null; // [-90, 90) - y-axis
  absolute: boolean | null;
  isSupported: boolean;
  hasPermission: boolean;
}

export function useDeviceOrientation(): DeviceOrientation & {
  requestPermission: () => Promise<boolean>;
} {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: null,
    isSupported: typeof DeviceOrientationEvent !== 'undefined',
    hasPermission: false
  });

  const requestPermission = async () => {
    // Check if the browser supports the DeviceOrientationEvent
    if (typeof DeviceOrientationEvent === 'undefined') {
      console.warn('Device orientation not supported');
      return false;
    }

    // Request permission for iOS 13+ devices
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        const granted = permissionState === 'granted';
        setOrientation(prev => ({ ...prev, hasPermission: granted }));
        return granted;
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        return false;
      }
    } else {
      // No permission needed for other browsers
      setOrientation(prev => ({ ...prev, hasPermission: true }));
      return true;
    }
  };

  useEffect(() => {
    if (!orientation.isSupported) return;

    // Handler function
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute,
        isSupported: true,
        hasPermission: true
      });
    };

    // Add event listener
    window.addEventListener('deviceorientation', handleOrientation);

    // Clean up
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [orientation.isSupported, orientation.hasPermission]);

  return { ...orientation, requestPermission };
}
