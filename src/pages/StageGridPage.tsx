import { Trash2 } from 'lucide-react'
import { StageCard } from '../components/StageCard'
import { TemperatureFilter } from '../components/TemperatureFilter'
import {
  actions,
  useAppDispatch,
  useSynthesis,
  deleteSynthesisStage,
} from '../store'
import Button from 'react-bootstrap/Button'

export function StageGridPage() {
  const {
    stages: visibleStages,
    chemist,
    temperature,
    componentInput,
  } = useSynthesis()
  const dispatch = useAppDispatch()
  return (
    <>
      <header className="header-section">
        <h1 className="app-title">SynthTrack</h1>
      </header>
      <section className="grid-container" aria-label="Этапы синтеза">
        <TemperatureFilter
          component={componentInput}
          onComponentChange={(value) => dispatch(actions.editComponent(value))}
          value={temperature}
          onChange={(value) => dispatch(actions.editTemperature(value))}
          onApply={() => dispatch(actions.applyTemperature())}
          onReset={() => dispatch(actions.resetTemperature())}
        />
        {visibleStages.length > 0 ? (
          <div className="cards-grid" aria-label="Этапы синтеза">
            {visibleStages.map((stage, index) => (
              <div key={stage.id} className="stage-item">
                <StageCard stage={stage} number={index + 1} />
                {chemist && stage.is_owner === 1 && (
                  <Button
                    variant=""
                    className="button button-primary delete-stage"
                    aria-label={`Удалить этап: ${stage.name}`}
                    onClick={() => {
                      if (window.confirm('Удалить этот этап синтеза?'))
                        dispatch(deleteSynthesisStage(stage.id))
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="grid-empty">Записи не найдены</p>
        )}
      </section>
    </>
  )
}
