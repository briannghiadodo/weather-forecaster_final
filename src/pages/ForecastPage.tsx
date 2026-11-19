import { useState } from 'react'
import { WeatherLocation, HourlyForecast } from '../types'
import { getHourlyForecast } from '../services/weatherService'
import HourlyTimeline from '../components/HourlyTimeline'
import './ForecastPage.css'

const conditions: Record<string, string> = {
  Sunny: '☀️',
  'Partly Cloudy': '⛅',
  Cloudy: '☁️',
  Rainy: '🌧️',
  Stormy: '⛈️',
  Thunderstorm: '🌩️',
  Clear: '🌙',
}

function ForecastPage() {
  const [location, setLocation] = useState<WeatherLocation | null>(null)
  const [hourly, setHourly] = useState<HourlyForecast[]>([])
  const [loading, setLoading] = useState(false)

  const handleSelectLocation = async (loc: WeatherLocation) => {
    setLocation(loc)
    setLoading(true)

    try {
      const data = await getHourlyForecast(loc)
      setHourly(data)
    } catch {
      // Error handling placeholder
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forecast-page">
      <div className="page-header">
        <h2>Hourly Forecast</h2>
        <p>24-hour forecast with precipitation and sun times</p>
      </div>

      {/* Location selector */}
      {!location && (
        <div className="location-selector">
          <p className="select-prompt">Select a location to view the forecast</p>
          <div className="quick-locations">
            {[
              { name: 'Houston', state: 'TX', zipCode: '77001', latitude: 29.7604, longitude: -95.3698, locationId: 1, country: 'USA' },
              { name: 'Dallas', state: 'TX', zipCode: '75201', latitude: 32.7767, longitude: -96.7970, locationId: 2, country: 'USA' },
              { name: 'Austin', state: 'TX', zipCode: '78701', latitude: 30.2672, longitude: -97.7431, locationId: 3, country: 'USA' },
              { name: 'New York', state: 'NY', zipCode: '10001', latitude: 40.7128, longitude: -74.0060, locationId: 5, country: 'USA' },
            ].map((loc) => (
              <button
                key={loc.locationId}
                className="quick-loc-btn"
                onClick={() => handleSelectLocation(loc as WeatherLocation)}
              >
                {loc.name}, {loc.state}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      )}

      {location && hourly.length > 0 && (
        <>
          <div className="forecast-location">
            <h3>{location.name}, {location.state}</h3>
          </div>
          <HourlyTimeline hourly={hourly} conditions={conditions} />
        </>
      )}
    </div>
  )
}

export default ForecastPage
