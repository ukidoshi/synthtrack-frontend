import { StageCard } from '../components/StageCard'
import { TemperatureFilter } from '../components/TemperatureFilter'
import { synthesisStages } from '../data/synthesisStages'

interface StageGridPageProps {
  componentInput: string
  component: string
  onComponentChange: (value: string) => void
  temperatureInput: string
  minimumTemperature: number | null
  onTemperatureChange: (value: string) => void
  onApply: () => void
  onReset: () => void
}

export function StageGridPage({
  componentInput, component, onComponentChange, temperatureInput, minimumTemperature, onTemperatureChange, onApply, onReset,
}: StageGridPageProps) {
  const visibleStages = synthesisStages.filter(stage =>
    (minimumTemperature === null || stage.temperature_celsius >= minimumTemperature) &&
    (stage.name + ' ' + stage.brief_description).toLocaleLowerCase('ru').includes(component)
  )
  return <>
    <header className="header-section"><h1 className="app-title">SynthTrack</h1></header>
    <section className="grid-container" aria-label="Этапы синтеза">
      <TemperatureFilter value={temperatureInput} component={componentInput} onChange={onTemperatureChange}
        onComponentChange={onComponentChange} onApply={onApply} onReset={onReset} />
      <div className="cards-grid">
        {visibleStages.map((stage, index) => <StageCard key={stage.id} stage={stage} number={index + 1} />)}
        {!visibleStages.length && <p className="grid-empty" role="status">Записи не найдены</p>}
      </div>
    </section>
  </>
}
