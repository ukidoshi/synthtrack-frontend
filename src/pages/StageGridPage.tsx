import Alert from 'react-bootstrap/Alert'
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
  const { stages: visibleStages, chemist, temperature } = useSynthesis()
  const dispatch = useAppDispatch()
  return (
    <>
      <h1>Этапы синтеза</h1>
      <TemperatureFilter
        value={temperature}
        onChange={(value) => dispatch(actions.editTemperature(value))}
        onApply={() => dispatch(actions.applyTemperature())}
        onReset={() => dispatch(actions.resetTemperature())}
      />
      <p className="result-count" role="status">
        Показано {visibleStages.length}
      </p>
      {visibleStages.length > 0 ? (
        <div className="stage-grid" aria-label="Этапы синтеза">
          {visibleStages.map((stage) => (
            <div key={stage.id}>
              <StageCard stage={stage} />
              {chemist && stage.is_owner === 1 && (
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    if (window.confirm('Удалить этот этап синтеза?'))
                      dispatch(deleteSynthesisStage(stage.id))
                  }}
                >
                  Удалить
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Alert variant="light" className="empty-grid">
          Нет этапов с такой температурой. Измените или сбросьте фильтр.
        </Alert>
      )}
    </>
  )
}
