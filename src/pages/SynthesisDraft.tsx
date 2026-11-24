import { Button, Form } from 'react-bootstrap'
import { useEffect, useState, type FormEvent } from 'react'
import { defaultStageImage, defaultStageVideo } from '../data/synthesisStages'
import {
  createSynthesisDraft,
  publishSynthesisStage,
  useAppDispatch,
  useSynthesis,
} from '../store'

function DraftMedia({
  kind,
  url,
  editable,
}: {
  kind: 'image' | 'video'
  url?: string | null
  editable: boolean
}) {
  const [file, setFile] = useState<File>()
  const [preview, setPreview] = useState('')
  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }
    const local = URL.createObjectURL(file)
    setPreview(local)
    return () => URL.revokeObjectURL(local)
  }, [file])
  const image = kind === 'image'
  const title = image ? 'Фото этапа' : 'Короткое видео'
  const source =
    preview ||
    (url && '/s3' + new URL(url, window.location.origin).pathname) ||
    (image ? defaultStageImage : defaultStageVideo)
  return (
    <div className="form-group">
      <span className="form-label">{title}</span>
      <label
        className={
          editable ? 'draft-media-frame draft-media-pick' : 'draft-media-frame'
        }
        htmlFor={editable ? kind : undefined}
      >
        {image ? (
          <img src={source} className="draft-media-content" alt={title} />
        ) : (
          <video
            src={source}
            className="draft-media-content"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        {editable && (
          <span className="draft-media-badge">
            {image ? 'Выбрать фото' : 'Выбрать видео'}
          </span>
        )}
      </label>
      {editable && (
        <Form.Control
          id={kind}
          name={kind}
          type="file"
          aria-label={title}
          className="form-input form-file"
          accept={image ? 'image/*' : 'video/mp4,video/webm,video/quicktime'}
          onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0])}
        />
      )}
    </div>
  )
}

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
    <section className="draft-empty">
      <div>
        <p className="eyebrow">{draft ? 'Черновик' : 'Новый этап'}</p>
        <h1>{draft ? draft.name : 'Создайте черновик'}</h1>
        <p className="draft-empty-copy">
          {draft
            ? 'Заполните параметры реакции и опубликуйте этап.'
            : 'Выберите фото и видео, укажите название.'}
        </p>
      </div>
      <Form
        key={draft?.id ?? 'new'}
        className="form-stack draft-create-form"
        onSubmit={submit}
      >
        <div className="draft-media">
          <DraftMedia kind="image" editable={!draft} url={draft?.image_url} />
          <DraftMedia kind="video" editable={!draft} url={draft?.video_url} />
        </div>
        {draft ? (
          <>
            <label className="form-group form-label">
              Температура, °C
              <Form.Control
                className="form-input"
                name="temperature"
                type="number"
                min="-273"
                max="2000"
                required
              />
            </label>
            <label className="form-group form-label">
              Выход продукта, %
              <Form.Control
                className="form-input"
                name="yield"
                type="number"
                step="any"
                min="0"
                max="100"
                required
              />
            </label>
            <label className="form-group form-label">
              Краткое описание
              <Form.Control
                className="form-input"
                as="textarea"
                name="description"
                maxLength={1000}
                required
              />
            </label>
          </>
        ) : (
          <label className="form-group form-label">
            Название этапа реакции
            <Form.Control
              className="form-input"
              name="name"
              maxLength={150}
              placeholder="Например, ацетилирование"
              required
            />
          </label>
        )}
        <Button variant="" className="button button-primary" type="submit">
          {draft ? 'Опубликовать' : 'Далее'}
        </Button>
      </Form>
    </section>
  )
}
