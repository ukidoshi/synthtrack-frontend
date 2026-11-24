import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import { ArrowRight } from 'lucide-react'
import { ChevronDown, Heart } from 'lucide-react'
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

  return <article className="feed-box">
    <video className="feed-video-player" autoPlay muted loop playsInline src={stageVideo(stage)} poster={stageImage(stage)} />
    <div className="feed-overlay" aria-hidden="true" />
    <aside className="feed-sidebar" aria-label="Действия с этапом">
      <div className="feed-badge"><span className="feed-badge-text">{stage.yield_percentage}%<br/>ВЫХОД</span></div>
      <div className="feed-action"><div className="feed-btn"><Heart aria-hidden="true"/></div>
        <span className="feed-action-label">Лайк {stage.likes_count}</span></div>
      <a href={`#/feed/${nextId}`} className="feed-action feed-action-next">
        <div className="feed-btn"><ArrowRight aria-hidden="true"/></div><span className="feed-action-label">Далее</span>
      </a>
    </aside>
    <div className="feed-bottom-info">
      <h1 className="feed-title">{stage.name}</h1>
      <details open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
        <summary className="feed-expand">ПОКАЗАТЬ ВСЁ <ChevronDown size={14} aria-hidden="true"/></summary>
        <p className="feed-desc">{stage.brief_description} Температура стабилизируется на {stage.temperature_celsius}°C.</p>
      </details>
    </div>
  </article>
}
