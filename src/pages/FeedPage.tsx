import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { ChevronDown, ChevronUp, Heart, Thermometer } from 'lucide-react'
import {
  stageImage, stageVideo, synthesisStages,
} from '../data/synthesisStages'
import type { SynthesisStage } from '../data/synthesisStages'

export function FeedPage({ stageId }: { stageId: number | null }) {
  const index = stageId === null ? 0 : synthesisStages.findIndex((stage) => stage.id === stageId)
  const stage = synthesisStages[index]

  if (!stage) {
    return (
      <Alert variant="light" className="empty-grid">
        <h1>Этап не найден</h1>
        <a href="#/stages">Вернуться в плитку</a>
      </Alert>
    )
  }

  const nextStage = synthesisStages[(index + 1) % synthesisStages.length]
  return <FeedStage key={stage.id} stage={stage} nextId={nextStage.id} />
}

function FeedStage({ stage, nextId }: { stage: SynthesisStage; nextId: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="feed-stage" aria-label="Лента стадий синтеза">
      <video
        className="stage-video"
        src={stageVideo(stage)}
        poster={stageImage(stage)}
        autoPlay
        muted
        loop
        playsInline
        controls
        aria-label={`Видео: ${stage.name}`}
      />
      <div className="feed-overlay">
        <div className="feed-metadata">
          <span><Thermometer size={17} aria-hidden="true" /> {stage.temperature_celsius} °C</span>
          <span>Выход {stage.yield_percentage.toLocaleString('ru-RU')} %</span>
          <span aria-label={`Лайков: ${stage.likes_count}`}><Heart size={16} aria-hidden="true" /> {stage.likes_count}</span>
        </div>
        <h1>{stage.name}</h1>
        <p id="stage-description" hidden={!expanded}>{stage.brief_description}</p>
        <div className="feed-actions">
          <Button
            variant="outline-light"
            aria-expanded={expanded}
            aria-controls="stage-description"
            onClick={() => setExpanded((wasExpanded) => !wasExpanded)}
          >
            {expanded ? 'Свернуть' : 'Подробнее'}
            {expanded ? <ChevronUp size={17} aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />}
          </Button>
          <a className="btn btn-primary" href={`#/feed/${nextId}`}>Следующий</a>
        </div>
      </div>
    </article>
  )
}
