import { useEffect, useState } from 'react'
import { FlaskConical, UserRound } from 'lucide-react'
import { BottomNav } from './components/BottomNav'
import { FeedPage } from './pages/FeedPage'
import { StageGridPage } from './pages/StageGridPage'

const readLocation = () => window.location.hash

export default function App() {
  const [location, setLocation] = useState(readLocation)
  const [temperatureInput, setTemperatureInput] = useState('')
  const [minimumTemperature, setMinimumTemperature] = useState<number | null>(null)

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
    setMinimumTemperature(temperatureInput === '' ? null : Number(temperatureInput))
  }

  function resetTemperature() {
    setTemperatureInput('')
    setMinimumTemperature(null)
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#/stages" aria-label="SynthTrack – плитка">
            <span className="brand-icon"><FlaskConical size={22} /></span>
            <span>SynthTrack</span>
          </a>
          <span className="guest-label"><UserRound size={15} aria-hidden="true" /> Гость</span>
        </div>
      </header>
      <main className={activePage === 'feed' ? 'main-content feed-content' : 'main-content'}>
        {feedRoute ? (
          <FeedPage stageId={feedRoute[1] ? Number(feedRoute[1]) : null} />
        ) : (
          <StageGridPage
            temperatureInput={temperatureInput}
            minimumTemperature={minimumTemperature}
            onTemperatureChange={setTemperatureInput}
            onApply={applyTemperature}
            onReset={resetTemperature}
          />
        )}
      </main>
      <BottomNav activePage={activePage} />
    </>
  )
}
