import type { FormEvent } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { SlidersHorizontal } from 'lucide-react'

interface TemperatureFilterProps {
  value: string
  onChange: (value: string) => void
  onApply: () => void
  onReset: () => void
}

export function TemperatureFilter({ value, onChange, onApply, onReset }: TemperatureFilterProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply()
  }

  return (
    <Form className="temperature-filter" onSubmit={handleSubmit}>
      <h2><SlidersHorizontal size={17} aria-hidden="true" /> Фильтр по температуре</h2>
      <Form.Group controlId="filter-temperature" className="temperature-field">
        <Form.Label>Минимальная температура</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            step="any"
            placeholder="Любая"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          <InputGroup.Text>°C</InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <div className="filter-buttons">
        <Button type="submit" variant="primary">Применить</Button>
        <Button type="button" variant="outline-secondary" onClick={onReset}>Сбросить</Button>
      </div>
    </Form>
  )
}
