import { useEffect, useState } from 'react';

type BatteryStatus = {
  level: number; // 0..100
  isCharging: boolean;
};

export function useBatteryStatus(): BatteryStatus {
  const [state, setState] = useState<BatteryStatus>({
    level: 0,
    isCharging: false,
  });

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    let mounted = true;
    let battery: BatteryManager | null = null;

    const updateState = () => {
      if (!mounted || !battery) return;

      setState({
        level: Math.round(battery.level * 100),
        isCharging: battery.charging,
      });
    };

    const init = async () => {
      if (!navigator.getBattery) return;

      try {
        battery = await navigator.getBattery();
        if (!mounted || !battery) return;

        updateState();

        battery.addEventListener('levelchange', updateState);
        battery.addEventListener('chargingchange', updateState);
      } catch {}
    };

    init();

    return () => {
      mounted = false;
      if (battery) {
        battery.removeEventListener('levelchange', updateState);
        battery.removeEventListener('chargingchange', updateState);
      }
    };
  }, []);

  return state;
}
