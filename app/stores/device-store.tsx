import { create } from "zustand";

interface DeviceState {
  deviceConnected: boolean;
  setDeviceConnected: (connected: boolean) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  deviceConnected: false,
  setDeviceConnected: (connected) => set({ deviceConnected: connected }),
}));
