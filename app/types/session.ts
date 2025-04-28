export interface SessionData {
  id: string;
  userId: string;
  duration: number;
  vibrationIntensity: number;
  averageTemperature: number;
  averageHeartRate?: number;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface ProgressData {
  heartRate: number;
  sessionDuration: number;
}

export interface MonthlyData {
  day: number;
  heartRate: number;
  sessionDuration: number;
}
