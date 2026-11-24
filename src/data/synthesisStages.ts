export interface SynthesisStage {
  is_owner?: number
  is_liked?: number
  id: number
  name: string
  brief_description: string
  temperature_celsius: number
  yield_percentage: number
  likes_count: number
  image_url: string | null
  video_url: string | null
}

const mediaDirectory = `${import.meta.env.BASE_URL}media/`

export const defaultStageImage = `${mediaDirectory}default-reaction.svg`
export const defaultStageVideo = `${mediaDirectory}default-reaction.mp4`

export const synthesisStages: readonly SynthesisStage[] = [
  {
    id: 1,
    name: 'Восстановление нитробензола',
    brief_description: 'Первая стадия учебной подборки. Карточка показывает температуру реакции, процент выхода и короткий видеоматериал.',
    temperature_celsius: 80,
    yield_percentage: 82.5,
    likes_count: 2,
    image_url: `${mediaDirectory}reduction.jpg`,
    video_url: `${mediaDirectory}reduction.mp4`,
  },
  {
    id: 2,
    name: 'Ацилирование 4-аминофенола',
    brief_description: 'Вторая стадия учебной подборки. Выход стадии показывает долю полученного продукта от теоретически возможного количества.',
    temperature_celsius: 100,
    yield_percentage: 91,
    likes_count: 1,
    image_url: `${mediaDirectory}acylation.jpg`,
    video_url: `${mediaDirectory}acylation.mp4`,
  },
  {
    id: 3,
    name: 'Перекристаллизация парацетамола',
    brief_description: 'Стадия очистки. В демонстрационной записи поля фото и видео пустые, поэтому отображаются локальные медиа по умолчанию.',
    temperature_celsius: 25,
    yield_percentage: 76.4,
    likes_count: 0,
    image_url: null,
    video_url: null,
  },
]

export function stageImage(stage: SynthesisStage) {
  return stage.image_url?.trim() || defaultStageImage
}

export function stageVideo(stage: SynthesisStage) {
  return stage.video_url?.trim() || defaultStageVideo
}
