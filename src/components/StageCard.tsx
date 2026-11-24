import Card from 'react-bootstrap/Card'
import { Heart, Thermometer } from 'lucide-react'
import { stageImage } from '../data/synthesisStages'
import type { SynthesisStage } from '../data/synthesisStages'

export function StageCard({ stage }: { stage: SynthesisStage }) {
  return (
    <Card as="article" className="stage-card">
      <a href={`#/feed/${stage.id}`} className="stage-card-link" aria-label={`Открыть в ленте: ${stage.name}`}>
        <Card.Img variant="top" src={stageImage(stage)} alt="" />
        <Card.Body>
          <Card.Title as="h3">{stage.name}</Card.Title>
          <div className="card-metadata">
            <span><Thermometer size={16} aria-hidden="true" /> {stage.temperature_celsius} °C</span>
            <span aria-label={`Лайков: ${stage.likes_count}`}><Heart size={16} aria-hidden="true" /> {stage.likes_count}</span>
          </div>
        </Card.Body>
      </a>
    </Card>
  )
}
