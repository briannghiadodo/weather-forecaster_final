# Weather Forecaster

A React web application for live weather conditions, hourly forecasting, storm tracking, configurable alerts, saved locations, activity guidance, and climate-data export.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **CSS** (custom, no framework)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout.tsx     # Sidebar navigation layout
│   ├── WeatherCard.tsx    # Current weather display
│   └── HourlyTimeline.tsx # Hourly forecast scroll
├── pages/             # Page components (routes)
│   ├── SearchPage.tsx     # UC1: Search by zip code
│   ├── ForecastPage.tsx   # UC2: Hourly forecast
│   ├── StormPage.tsx      # UC4: Storm tracking
│   ├── AlertsPage.tsx     # UC3/UC6: Alert settings
│   └── ProfilePage.tsx    # UC3: Saved locations
├── services/          # API / data layer
│   └── weatherService.ts  # Mock data (replace with real API)
├── types/             # TypeScript interfaces
│   └── index.ts           # All domain models
├── App.tsx            # Router setup
├── main.tsx           # Entry point
└── index.css          # Global styles & theme
```

## Pages

| Route | Feature | Use Case |
|-------|---------|----------|
| `/search` | Search weather by city/ZIP | UC1 |
| `/forecast` | 24-hour hourly forecast | UC2 |
| `/storm` | Storm/radar tracking | UC4 |
| `/alerts` | Set weather alert thresholds | UC3, UC6 |
| `/profile` | Manage saved locations | UC3 |
| `/dashboard` | Current conditions and risk summary | UC1, UC2, UC4 |
| `/assistant` | Natural-language activity guidance | UC5 |
| `/data` | Climate history and CSV export | UC7 |

## Design

The app uses a presentation-friendly light theme with CSS custom properties defined in `index.css`. Colors, spacing, and breakpoints are centralized in `:root` for easy theming.

## Weather Data

The app uses the public Open-Meteo forecast and geocoding APIs without requiring an API key. A deterministic offline fallback keeps the demonstration usable if the network or provider is unavailable. Storm reports are representative demo data and are clearly separated from the live forecast service.

## Final Demo Features

- Live current conditions with humidity, wind, precipitation, feels-like temperature, UV index, and sunset
- ZIP/city search and a 24-hour timeline
- Nearby hazard cards with distance and severity
- Custom weather thresholds and alert toggles
- Profile and saved-location management
- Natural-language recommendations for outdoor activities
- Seven-day climate table and client-side CSV export
