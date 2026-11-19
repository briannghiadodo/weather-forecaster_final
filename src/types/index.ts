export interface WeatherLocation {
  locationId: number
  name: string
  latitude: number
  longitude: number
  country: string
  state: string
  zipCode?: string
}

export interface WeatherForecast {
  forecastId: number
  location: WeatherLocation
  forecastDate: Date
  temperatureHigh: number
  temperatureLow: number
  condition: string
  humidity: number
  windSpeed: number
  precipitationChance: number
  feelsLike?: number
  uvIndex?: number
  visibility?: number
  sunrise?: Date
  sunset?: Date
  source?: 'live' | 'demo'
  timestamp?: Date
}

export interface HourlyForecast {
  time: Date
  temperature: number
  condition: string
  precipitationChance: number
  isSunrise?: boolean
  isSunset?: boolean
}

export interface WeatherAlert {
  alertId: number
  user: User
  location: WeatherLocation
  alertType: string
  thresholdValue: number
  isActive: boolean
  createdDate: Date
}

export interface User {
  userId: number
  name: string
  email: string
  savedLocations: SavedLocation[]
  alerts: WeatherAlert[]
}

export interface SavedLocation {
  savedLocationId: number
  user: User
  location: WeatherLocation
  nickname: string
  dateAdded: Date
}

export interface StormReport {
  type: 'lightning' | 'flashFlood' | 'severeWind'
  location: WeatherLocation
  distance: number
  timestamp: Date
  severity: 'low' | 'medium' | 'high'
}

export interface HistoricalWeather {
  date: Date
  temperatureHigh: number
  temperatureLow: number
  condition: string
  humidity: number
  windSpeed: number
  precipitation: number
}

export interface NLPQuery {
  question: string
  activity?: string
  location?: string
  time?: string
  duration?: string
  acceptableConditions?: string[]
}

export interface NLPResponse {
  answer: string
  needsClarification: boolean
  missingInfo?: string[]
}

export interface WeatherData {
  current: WeatherForecast
  hourly: HourlyForecast[]
  alerts: WeatherAlert[]
  timestamp: Date
}
