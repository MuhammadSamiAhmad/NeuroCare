export interface SessionData {
  id: string
  timestamp: {
    seconds: number
    nanoseconds: number
  }
  duration: number
  vibrationIntensity: number
  averageTemperature: number
  userId?: string
}

export interface MonthlyData {
  day: number
  bloodFlow: number
  painReduction: number
  sessionDuration: number
}

export interface ProgressData {
  bloodFlow: number
  painReduction: number
  sessionDuration: number
}
