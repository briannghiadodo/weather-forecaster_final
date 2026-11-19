import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import WeatherCard from '../components/WeatherCard'
import HourlyTimeline from '../components/HourlyTimeline'
import { getCurrentWeather, getHourlyForecast, getStormData, mockLocations } from '../services/weatherService'
import { HourlyForecast, StormReport, WeatherForecast } from '../types'
import './DemoPages.css'

const icons: Record<string, string> = { Sunny: '☀️', 'Partly Cloudy': '⛅', Cloudy: '☁️', Rainy: '🌧️', Stormy: '⛈️', Thunderstorm: '🌩️', Clear: '🌙' }
const dashboardLocation = mockLocations[0]

export default function DashboardPage() {
  const [weather, setWeather] = useState<WeatherForecast | null>(null)
  const [hourly, setHourly] = useState<HourlyForecast[]>([])
  const [storms, setStorms] = useState<StormReport[]>([])

  useEffect(() => {
    Promise.all([getCurrentWeather(dashboardLocation), getHourlyForecast(dashboardLocation), getStormData(dashboardLocation)]).then(([current, hours, reports]) => {
      setWeather(current); setHourly(hours); setStorms(reports)
    })
  }, [])

  return <div className="demo-page dashboard-page">
    <div className="hero-header">
      <div><span className="eyebrow">Thursday · Houston, Texas</span><h2>Good morning, Nghia.</h2><p>Here is what the weather means for your day.</p></div>
      <Link className="btn btn-primary" to="/search">Change location</Link>
    </div>
    <div className="status-strip"><span className="status-dot" /> Conditions refreshed automatically <strong>· Next update in 14 min</strong></div>
    {weather ? <WeatherCard weather={weather} /> : <div className="skeleton-card" />}
    <div className="dashboard-grid">
      <section className="card"><div className="section-heading"><div><span className="eyebrow">Next 24 hours</span><h3>Hourly outlook</h3></div><Link to="/forecast">Full forecast →</Link></div>{hourly.length > 0 && <HourlyTimeline hourly={hourly.slice(0, 8)} conditions={icons} />}</section>
      <section className="card risk-card"><div className="section-heading"><div><span className="eyebrow">Local risk center</span><h3>{storms.length} conditions to watch</h3></div><Link to="/storm">Track storms →</Link></div>
        {storms.slice(0, 2).map((storm, i) => <div className="risk-row" key={i}><span>{storm.type === 'lightning' ? '⚡' : storm.type === 'flashFlood' ? '🌊' : '💨'}</span><div><strong>{storm.type.replace(/([A-Z])/g, ' $1')}</strong><small>{storm.distance} mi away · {storm.severity} risk</small></div></div>)}
      </section>
    </div>
  </div>
}
