import Alert from 'react-bootstrap/Alert'
import { StageCard } from '../components/StageCard'
import { TemperatureFilter } from '../components/TemperatureFilter'
import { synthesisStages } from '../data/synthesisStages'

interface StageGridPageProps {
  temperatureInput: string
  minimumTemperature: number | null
  onTemperatureChange: (value: string) => void
  onApply: () => void
  onReset: () => void
}

export function StageGridPage({
  temperatureInput, minimumTemperature, onTemperatureChange, onApply, onReset,
}: StageGridPageProps) {
  const visibleStages = minimumTemperature === null
    ? synthesisStages
    : synthesisStages.filter((stage) => stage.temperature_celsius >= minimumTemperature)

  return (
    <>
      <h1>Этапы синтеза</h1>
      <TemperatureFilter
        value={temperatureInput}
        onChange={onTemperatureChange}
        onApply={onApply}
        onReset={onReset}
      />
      <p className="result-count" role="status">Показано {visibleStages.length} из {synthesisStages.length}</p>
      {visibleStages.length > 0 ? (
        <div className="stage-grid" aria-label="Этапы синтеза">
          {visibleStages.map((stage) => <StageCard key={stage.id} stage={stage} />)}
        </div>
      ) : (
        <Alert variant="light" className="empty-grid">Нет этапов с такой температурой. Измените или сбросьте фильтр.</Alert>
      )}
    </>
  )
}
