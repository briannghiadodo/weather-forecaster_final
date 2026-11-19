import { useEffect, useState } from 'react'
import { getHistoricalWeather } from '../services/weatherService'
import { HistoricalWeather } from '../types'
import './DemoPages.css'

export default function DataPage() {
  const [rows, setRows] = useState<HistoricalWeather[]>([])
  useEffect(() => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 6); getHistoricalWeather(start, end).then(setRows) }, [])
  const downloadCsv = () => {
    const header = 'date,high_f,low_f,condition,humidity,wind_mph,precipitation_in'
    const csv = [header, ...rows.map(r => [r.date.toISOString().slice(0, 10), r.temperatureHigh, r.temperatureLow, r.condition, r.humidity, r.windSpeed, r.precipitation].join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const a = document.createElement('a'); a.href = url; a.download = 'houston-climate-data.csv'; a.click(); URL.revokeObjectURL(url)
  }
  return <div className="demo-page data-page">
    <div className="hero-header"><div><span className="eyebrow">Portable forecast records</span><h2>Climate Data</h2><p>Review and export structured weather history for Houston.</p></div><button className="btn btn-primary" onClick={downloadCsv}>⇩ Export CSV</button></div>
    <div className="data-summary"><div><span>7</span><small>days selected</small></div><div><span>{rows.length ? Math.round(rows.reduce((s,r)=>s+r.temperatureHigh,0)/rows.length) : '—'}°</span><small>average high</small></div><div><span>{rows.length ? rows.reduce((s,r)=>s+r.precipitation,0).toFixed(2) : '—'} in</span><small>total rain</small></div></div>
    <div className="card data-table-card"><div className="section-heading"><div><span className="eyebrow">Houston, TX</span><h3>Seven-day history</h3></div><span className="source-pill">CSV ready</span></div><table><thead><tr><th>Date</th><th>Conditions</th><th>High / Low</th><th>Humidity</th><th>Wind</th><th>Rain</th></tr></thead><tbody>{rows.map(row => <tr key={row.date.toISOString()}><td>{row.date.toLocaleDateString([], { month:'short', day:'numeric' })}</td><td>{row.condition}</td><td><strong>{row.temperatureHigh}°</strong> / {row.temperatureLow}°</td><td>{row.humidity}%</td><td>{row.windSpeed} mph</td><td>{row.precipitation} in</td></tr>)}</tbody></table></div>
  </div>
}
