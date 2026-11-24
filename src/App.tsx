import { useEffect, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { FeedPage } from './pages/FeedPage'
import { StageGridPage } from './pages/StageGridPage'

const readLocation = () => window.location.hash

export default function App() {
  const [location, setLocation] = useState(readLocation)
  const [temperatureInput, setTemperatureInput] = useState('')
  const [minimumTemperature, setMinimumTemperature] = useState<number | null>(null)

  const [componentInput, setComponentInput] = useState('')
  const [component, setComponent] = useState('')

  useEffect(() => {
    function syncLocation() {
      setLocation(readLocation())
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', syncLocation)
    return () => window.removeEventListener('hashchange', syncLocation)
  }, [])

  const feedRoute = /^#\/feed(?:\/([1-9]\d*))?\/?$/.exec(location)
  const activePage = feedRoute ? 'feed' : 'grid'

  function applyTemperature() {
    setComponent(componentInput.trim().toLocaleLowerCase('ru'))
    setMinimumTemperature(temperatureInput === '' ? null : Number(temperatureInput))
  }

  function resetTemperature() {
    setComponentInput('')
    setComponent('')
    setTemperatureInput('')
    setMinimumTemperature(null)
  }

  return (
    <div className="mobile-wrapper">
      <main className="viewport-content" key={location}>
        {feedRoute ? (
          <FeedPage stageId={feedRoute[1] ? Number(feedRoute[1]) : null} />
        ) : (
          <StageGridPage
            componentInput={componentInput}
            component={component}
            onComponentChange={setComponentInput}
            temperatureInput={temperatureInput}
            minimumTemperature={minimumTemperature}
            onTemperatureChange={setTemperatureInput}
            onApply={applyTemperature}
            onReset={resetTemperature}
          />
        )}
      </main>
      <BottomNav activePage={activePage} />
    </div>
  )
}
