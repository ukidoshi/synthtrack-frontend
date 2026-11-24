import { Button, Form } from 'react-bootstrap'
import type { FormEvent } from 'react'
import {
  createSynthesisDraft,
  publishSynthesisStage,
  useAppDispatch,
  useSynthesis,
} from '../store'

export function SynthesisDraft() {
  const { draft } = useSynthesis()
  const dispatch = useAppDispatch()
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    function file(key: string) {
      const value = data.get(key)
      return value instanceof File && value.size ? value : undefined
    }
    if (!draft) {
      const image = file('image')
      const video = file('video')
      await dispatch(
        createSynthesisDraft({
          name: String(data.get('name')),
          ...(image && { media_image: image }),
          ...(video && { media_video: video }),
        }),
      )
      return
    }
    const result = await dispatch(
      publishSynthesisStage({
        id: draft.id,
        data: {
          brief_description: String(data.get('description')),
          yield_percentage: Number(data.get('yield')),
          reaction_temperature_celsius: Number(data.get('temperature')),
        },
      }),
    )
    if (publishSynthesisStage.fulfilled.match(result))
      window.location.hash = '/stages'
  }
  return (
    <>
      <h1>{draft ? draft.name : 'Добавление этапа'}</h1>
      <Form key={draft?.id ?? 'new'} onSubmit={submit} className="editor-form">
        {draft ? (
          <>
            <label>
              Описание
              <Form.Control
                as="textarea"
                name="description"
                required
                maxLength={1000}
              />
            </label>
            <label>
              Выход продукта, %
              <Form.Control
                name="yield"
                type="number"
                step="any"
                min="0"
                max="100"
                required
              />
            </label>
            <label>
              Температура, °C
              <Form.Control
                name="temperature"
                type="number"
                min="-273"
                max="2000"
                required
              />
            </label>
          </>
        ) : (
          <>
            <label>
              Название этапа
              <Form.Control name="name" maxLength={150} required />
            </label>
            <label>
              Изображение
              <Form.Control name="image" type="file" accept="image/*" />
            </label>
            <label>
              Видео
              <Form.Control name="video" type="file" accept="video/*" />
            </label>
          </>
        )}
        <Button type="submit">{draft ? 'Опубликовать' : 'Далее'}</Button>
      </Form>
    </>
  )
}
