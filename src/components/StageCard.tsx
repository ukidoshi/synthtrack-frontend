import Card from 'react-bootstrap/Card'
import { stageImage } from '../data/synthesisStages'
import type { SynthesisStage } from '../data/synthesisStages'

export function StageCard({ stage, number }: { stage: SynthesisStage, number: number }) {
  return <article className="stage-card">
    <Card as="a" className="stage-tile" href={`#/feed/${stage.id}`} aria-label={`Открыть этап: ${stage.name}`}>
      <img className="stage-tile-img" src={stageImage(stage)} alt="" />
      <span className="stage-tile-num">ЭТАП {String(number).padStart(2, '0')}</span>
      <span className="stage-tile-title">{stage.name}</span>
      <span className="stage-tile-details"><span className="temp-label">Температура: {stage.temperature_celsius}°C</span></span>
    </Card>
  </article>
}
