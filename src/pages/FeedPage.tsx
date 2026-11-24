import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { ChevronDown, ArrowRight, Heart } from 'lucide-react'
import { stageImage, stageVideo } from '../data/synthesisStages'
import type { SynthesisStage } from '../data/synthesisStages'

import { likeSynthesisStage, useAppDispatch, useSynthesis } from '../store'

export function FeedPage() {
  const { current: stage } = useSynthesis()
  if (!stage) {
    return (
      <Alert variant="light" className="empty-grid">
        <h1>Этап не найден</h1>
        <a href="#/stages">Вернуться в плитку</a>
      </Alert>
    )
  }

  return <FeedStage key={stage.id} stage={stage} />
}
function FeedStage({ stage }: { stage: SynthesisStage }) {
  const { chemist } = useSynthesis()
  const dispatch = useAppDispatch()
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="feed-box">
      <video
        className="feed-video-player"
        autoPlay
        muted
        loop
        playsInline
        src={stageVideo(stage)}
        poster={stageImage(stage)}
      />
      <div className="feed-overlay" aria-hidden="true" />
      <aside className="feed-sidebar" aria-label="Действия с этапом">
        <div className="feed-badge">
          <span className="feed-badge-text">
            {stage.yield_percentage}%<br />
            ВЫХОД
          </span>
        </div>
        <div className="feed-action">
          {chemist ? (
            <Button
              className="feed-btn"
              variant=""
              aria-label={stage.is_liked ? 'Снять лайк' : 'Нравится'}
              aria-pressed={Boolean(stage.is_liked)}
              onClick={() => dispatch(likeSynthesisStage(stage))}
            >
              <Heart />
            </Button>
          ) : (
            <div className="feed-btn">
              <Heart aria-hidden="true" />
            </div>
          )}
          <span className="feed-action-label">Лайк {stage.likes_count}</span>
        </div>
        <a
          href={`#/feed/${stage.id}/next`}
          className="feed-action feed-action-next"
        >
          <div className="feed-btn">
            <ArrowRight aria-hidden="true" />
          </div>
          <span className="feed-action-label">Далее</span>
        </a>
      </aside>
      <div className="feed-bottom-info">
        <h1 className="feed-title">{stage.name}</h1>
        <details
          open={expanded}
          onToggle={(event) => setExpanded(event.currentTarget.open)}
        >
          <summary className="feed-expand">
            ПОКАЗАТЬ ВСЁ <ChevronDown size={14} aria-hidden="true" />
          </summary>
          <p className="feed-desc">
            {stage.brief_description} Температура стабилизируется на{' '}
            {stage.temperature_celsius}°C.
          </p>
        </details>
      </div>
    </article>
  )
}
