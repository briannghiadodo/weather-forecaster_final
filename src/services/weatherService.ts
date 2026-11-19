import { WeatherLocation, WeatherForecast, HourlyForecast, StormReport, HistoricalWeather } from '../types'

export const mockLocations: WeatherLocation[] = [
  { locationId: 1, name: 'Houston', latitude: 29.7604, longitude: -95.3698, country: 'USA', state: 'TX', zipCode: '77001' },
  { locationId: 2, name: 'Dallas', latitude: 32.7767, longitude: -96.7970, country: 'USA', state: 'TX', zipCode: '75201' },
  { locationId: 3, name: 'Austin', latitude: 30.2672, longitude: -97.7431, country: 'USA', state: 'TX', zipCode: '78701' },
  { locationId: 4, name: 'San Antonio', latitude: 29.4241, longitude: -98.4936, country: 'USA', state: 'TX', zipCode: '78201' },
  { locationId: 5, name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'USA', state: 'NY', zipCode: '10001' },
]

const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Stormy', 'Thunderstorm', 'Clear']

interface GeocodingResult {
  id?: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

const weatherCodes: Record<number, string> = {
  0: 'Clear', 1: 'Sunny', 2: 'Partly Cloudy', 3: 'Cloudy', 45: 'Cloudy',
  51: 'Rainy', 53: 'Rainy', 55: 'Rainy', 61: 'Rainy', 63: 'Rainy', 65: 'Rainy',
  80: 'Rainy', 81: 'Rainy', 82: 'Stormy', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
}

function seeded(locationId: number, offset = 0): number {
  const value = Math.sin(locationId * 9301 + offset * 49297) * 233280
  return value - Math.floor(value)
}

function demoNumber(locationId: number, offset: number, min: number, max: number): number {
  return Math.round((min + seeded(locationId, offset) * (max - min)) * 10) / 10
}

function weatherUrl(location: WeatherLocation): string {
  const params = new URLSearchParams({
    latitude: String(location.latitude), longitude: String(location.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
    temperature_unit: 'fahrenheit', wind_speed_unit: 'mph', precipitation_unit: 'inch', timezone: 'auto', forecast_days: '2',
  })
  return `https://api.open-meteo.com/v1/forecast?${params}`
}

export async function searchLocations(query: string): Promise<WeatherLocation[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!query || query.trim().length === 0) return []

  const q = query.trim().toLowerCase()
  // Try zip code first
  if (/^\d{5}$/.test(q)) {
    const match = mockLocations.find((l) => l.zipCode === q)
    return match ? [match] : []
  }

  const local = mockLocations.filter(
    (l) => l.name.toLowerCase().includes(q) || l.state.toLowerCase().includes(q) || l.zipCode?.includes(q),
  )
  if (local.length) return local
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`)
    if (!response.ok) return []
    const data = await response.json() as { results?: GeocodingResult[] }
    return (data.results || []).map((item, index: number) => ({
      locationId: Number(item.id) || Date.now() + index,
      name: item.name, latitude: item.latitude, longitude: item.longitude,
      country: item.country || '', state: item.admin1 || '', zipCode: /^\d{5}$/.test(q) ? q : undefined,
    }))
  } catch {
    return []
  }
}

export async function getCurrentWeather(location: WeatherLocation): Promise<WeatherForecast> {
  try {
    const response = await fetch(weatherUrl(location))
    if (!response.ok) throw new Error('Weather service unavailable')
    const data = await response.json()
    return {
      forecastId: Date.now(), location, forecastDate: new Date(),
      temperatureHigh: data.daily.temperature_2m_max[0], temperatureLow: data.daily.temperature_2m_min[0],
      condition: weatherCodes[data.current.weather_code] || 'Partly Cloudy',
      humidity: data.current.relative_humidity_2m, windSpeed: data.current.wind_speed_10m,
      precipitationChance: data.hourly.precipitation_probability[0] || 0,
      feelsLike: data.current.apparent_temperature, uvIndex: data.daily.uv_index_max[0], visibility: 10,
      sunrise: new Date(data.daily.sunrise[0]), sunset: new Date(data.daily.sunset[0]), source: 'live', timestamp: new Date(),
    }
  } catch {
    return {
    forecastId: Date.now(),
    location,
    forecastDate: new Date(),
    temperatureHigh: demoNumber(location.locationId, 1, 78, 94),
    temperatureLow: demoNumber(location.locationId, 2, 58, 72),
    condition: conditions[location.locationId % conditions.length],
    humidity: demoNumber(location.locationId, 3, 45, 82),
    windSpeed: demoNumber(location.locationId, 4, 4, 18),
    precipitationChance: demoNumber(location.locationId, 5, 5, 65),
    feelsLike: demoNumber(location.locationId, 6, 76, 98), uvIndex: demoNumber(location.locationId, 7, 2, 10), visibility: 9.7,
    sunrise: new Date(new Date().setHours(6, 42, 0, 0)), sunset: new Date(new Date().setHours(17, 29, 0, 0)), source: 'demo',
    timestamp: new Date(),
    }
  }
}

export async function getHourlyForecast(location: WeatherLocation = mockLocations[0]): Promise<HourlyForecast[]> {
  try {
    const response = await fetch(weatherUrl(location))
    if (!response.ok) throw new Error('Weather service unavailable')
    const data = await response.json()
    const sunrise = new Date(data.daily.sunrise[0]).getHours()
    const sunset = new Date(data.daily.sunset[0]).getHours()
    return data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
      time: new Date(time), temperature: data.hourly.temperature_2m[i],
      condition: weatherCodes[data.hourly.weather_code[i]] || 'Partly Cloudy',
      precipitationChance: data.hourly.precipitation_probability[i] || 0,
      isSunrise: new Date(time).getHours() === sunrise, isSunset: new Date(time).getHours() === sunset,
    }))
  } catch {

  const now = new Date()
  const hourly: HourlyForecast[] = []

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 3600000)
    hourly.push({
      time,
      temperature: demoNumber(location.locationId, i + 20, 58, 91),
      condition: conditions[(location.locationId + Math.floor(i / 4)) % conditions.length],
      precipitationChance: demoNumber(location.locationId, i + 60, 0, 72),
      isSunrise: i === 6,
      isSunset: i === 19,
    })
  }
  return hourly
  }
}

export async function getStormData(location: WeatherLocation): Promise<StormReport[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const reports: StormReport[] = []
  const types: StormReport['type'][] = ['lightning', 'flashFlood', 'severeWind']
  const severities: StormReport['severity'][] = ['low', 'medium', 'high']

  const count = 3
  for (let i = 0; i < count; i++) {
    reports.push({
      type: types[(location.locationId + i) % types.length],
      location: {
        ...location,
        locationId: Date.now() + i,
        name: `${location.name} area`,
        latitude: location.latitude + demoNumber(location.locationId, i + 100, -1, 1),
        longitude: location.longitude + demoNumber(location.locationId, i + 110, -1, 1),
      },
      distance: demoNumber(location.locationId, i + 120, 5, 85),
      timestamp: new Date(Date.now() - (i + 1) * 18 * 60000),
      severity: severities[(location.locationId + i) % severities.length],
    })
  }

  return reports
}

export async function getHistoricalWeather(
  startDate: Date,
  endDate: Date,
): Promise<HistoricalWeather[]> {
  await new Promise((resolve) => setTimeout(resolve, 700))

  const records: HistoricalWeather[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    records.push({
      date: new Date(current),
      temperatureHigh: demoNumber(current.getDate(), 1, 65, 93),
      temperatureLow: demoNumber(current.getDate(), 2, 45, 72),
      condition: conditions[current.getDate() % conditions.length],
      humidity: demoNumber(current.getDate(), 3, 35, 88),
      windSpeed: demoNumber(current.getDate(), 4, 2, 22),
      precipitation: demoNumber(current.getDate(), 5, 0, 1.5),
    })
    current.setDate(current.getDate() + 1)
  }

  return records
}
