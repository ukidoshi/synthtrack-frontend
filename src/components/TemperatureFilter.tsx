import { Button, Form } from 'react-bootstrap'
import { ChevronDown } from 'lucide-react'

interface FilterProps {
  value: string
  component: string
  onChange: (value: string) => void
  onComponentChange: (value: string) => void
  onApply: () => void
  onReset: () => void
}

export function TemperatureFilter({ value, component, onChange, onComponentChange, onApply, onReset }: FilterProps) {
  return <details className="filter-box" open>
    <summary className="filter-title">Фильтры <ChevronDown aria-hidden="true" /></summary>
    <Form onSubmit={event => { event.preventDefault(); onApply() }}>
      <div className="form-group">
        <Form.Label htmlFor="filter-temperature">Температура</Form.Label>
        <Form.Control id="filter-temperature" className="form-input" type="number" step="any"
          placeholder="°C" value={value} onChange={event => onChange(event.target.value)} />
        <Form.Label htmlFor="filter-components">Компоненты</Form.Label>
        <Form.Control id="filter-components" className="form-input" type="search"
          placeholder="Название компонента, процесса..." value={component} onChange={event => onComponentChange(event.target.value)} />
      </div>
      <div className="filter-actions">
        <Button variant="" type="submit" className="button button-primary">Применить</Button>
        <Button variant="" type="button" className="button button-outline" onClick={onReset}>Сбросить</Button>
      </div>
    </Form>
  </details>
}
