import { create } from "zustand"

interface DeviceState {
  deviceConnected: boolean
  deviceBattery: number
  setDeviceConnected: (connected: boolean) => void
  setDeviceBattery: (level: number) => void
}

export const useDeviceStore = create<DeviceState>((set) => ({
  deviceConnected: false,
  deviceBattery: 75,
  setDeviceConnected: (connected) => set({ deviceConnected: connected }),
  setDeviceBattery: (level) => set({ deviceBattery: level }),
}))
