interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  addEventListener(
    type: 'chargingchange' | 'levelchange',
    listener: EventListenerOrEventListenerObject,
  ): void;
  removeEventListener(
    type: 'chargingchange' | 'levelchange',
    listener: EventListenerOrEventListenerObject,
  ): void;
}

interface Navigator {
  getBattery?: () => Promise<BatteryManager>;
}
