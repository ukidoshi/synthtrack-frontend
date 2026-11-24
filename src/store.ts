import {
  configureStore,
  createAsyncThunk,
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Api } from './api/SynthTrack'
import type { SynthesisStage as ApiStage } from './api/SynthTrack'
import { synthesisStages } from './data/synthesisStages'
import type { SynthesisStage } from './data/synthesisStages'

const client = new Api({ baseURL: '/api', timeout: 8000 })
const api = client.synthesisStages
export const tokenKey = 'synthtrack.access_token'
const initialState = {
  chemist: '',
  temperature: '',
  componentInput: '',
  component: '',
  minimum: null as number | null,
  pending: 0,
  stages: [] as SynthesisStage[],
  current: null as SynthesisStage | null,
  draft: null as ApiStage | null,
  mock: false,
  error: '',
  request: '',
}
type State = { synthesis: typeof initialState }
const task = createAsyncThunk.withTypes<{ state: State }>()
function headers(state: State) {
  return state.synthesis.chemist
    ? { Authorization: 'Bearer ' + localStorage.getItem(tokenKey) }
    : {}
}
function published(s: ApiStage): SynthesisStage {
  if (s.temperature_celsius == null || s.yield_percentage == null)
    throw Error('Неполные данные этапа')
  const media = (url: string | null) =>
    url ? '/s3' + new URL(url, window.location.origin).pathname : null
  return {
    ...s,
    brief_description: s.brief_description ?? '',
    temperature_celsius: s.temperature_celsius,
    yield_percentage: s.yield_percentage,
    image_url: media(s.image_url),
    video_url: media(s.video_url),
  }
}
export const loadSynthesisStages = task(
  'synthesis/load',
  async (
    route: { page: string; id?: number; next?: boolean },
    { getState, signal },
  ) => {
    const state = getState()
    const options = { headers: headers(state), signal }
    const min = state.synthesis.minimum
    try {
      if (route.page === 'grid') {
        const query = {
          filter_temperature: min === null ? undefined : Math.ceil(min),
          filter_desc: state.synthesis.component || undefined,
        }
        const response = await api.listSynthesisStages(query, options)
        return {
          stages: response.data.data
            .map(published)
            .filter((s) => min === null || s.temperature_celsius >= min),
          mock: false,
        }
      }
      if (route.page === 'add') {
        const response = await api.getSynthesisDraft(options)
        return { draft: response.data.data, mock: false }
      }
      const response =
        route.id === undefined
          ? await api.firstSynthesisStage(options)
          : await api.getSynthesisFeed(route.id, { next: route.next }, options)
      return { current: published(response.data.data), mock: false }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 404 &&
        route.page !== 'grid'
      )
        return { current: null, draft: null, mock: false }
      if (
        signal.aborted ||
        state.synthesis.chemist ||
        !axios.isAxiosError(error) ||
        (error.response && error.response.status < 500)
      )
        throw error
      const index =
        route.id === undefined
          ? 0
          : synthesisStages.findIndex((s) => s.id === route.id)
      return {
        stages: synthesisStages.filter(
          (s) =>
            (min === null || s.temperature_celsius >= min) &&
            (s.name + ' ' + s.brief_description)
              .toLocaleLowerCase('ru')
              .includes(state.synthesis.component),
        ),
        current:
          index < 0
            ? null
            : synthesisStages[
                (index + (route.next ? 1 : 0)) % synthesisStages.length
              ],
        mock: true,
      }
    }
  },
)
type Draft = Parameters<typeof api.createSynthesisDraft>[0]
type Details = Parameters<typeof api.publishSynthesisStage>[1]
export const createSynthesisDraft = task(
  'synthesis/createDraft',
  async (data: Draft, { getState }) =>
    (await api.createSynthesisDraft(data, { headers: headers(getState()) }))
      .data.data,
)
export const publishSynthesisStage = task(
  'synthesis/publish',
  async ({ id, data }: { id: number; data: Details }, { getState }) => {
    await api.publishSynthesisStage(id, data, { headers: headers(getState()) })
  },
)
export const deleteSynthesisStage = task(
  'synthesis/delete',
  async (id: number, { getState }) => {
    await api.deleteSynthesisStage(id, { headers: headers(getState()) })
  },
)
export const likeSynthesisStage = task(
  'synthesis/like',
  async (stage: SynthesisStage, { getState }) => {
    const options = { headers: headers(getState()) }
    await api.setSynthesisLike(
      stage.id,
      { action: stage.is_liked ? 0 : 1 },
      options,
    )
    return published(
      (await api.getSynthesisFeed(stage.id, {}, options)).data.data,
    )
  },
)

const slice = createSlice({
  name: 'synthesis',
  initialState,
  reducers: {
    session: (_, action: PayloadAction<string>) => ({
      ...initialState,
      chemist: action.payload,
    }),
    editTemperature: (s, a: PayloadAction<string>) => {
      s.temperature = a.payload
    },
    editComponent: (s, action: PayloadAction<string>) => {
      s.componentInput = action.payload
    },
    applyTemperature: (s) => {
      s.component = s.componentInput.trim().toLocaleLowerCase('ru')
      s.minimum = s.temperature === '' ? null : Number(s.temperature)
    },
    resetTemperature: (s) => {
      s.minimum = null
      s.temperature = ''
      s.componentInput = ''
      s.component = ''
    },
    authPending: (s, a: PayloadAction<boolean>) => {
      s.pending += a.payload ? 1 : -1
    },
    showError: (s, a: PayloadAction<string>) => {
      s.error = a.payload
    },
  },
  extraReducers: (b) =>
    b
      .addCase(loadSynthesisStages.pending, (s, a) => {
        s.request = a.meta.requestId
        s.mock = false
        s.current = null
        s.stages = []
        s.draft = null
      })
      .addCase(loadSynthesisStages.fulfilled, (s, a) => {
        if (s.request === a.meta.requestId) Object.assign(s, a.payload)
      })
      .addCase(createSynthesisDraft.fulfilled, (s, a) => {
        s.draft = a.payload
      })
      .addCase(likeSynthesisStage.fulfilled, (s, a) => {
        s.current = a.payload
      })
      .addCase(deleteSynthesisStage.fulfilled, (s, a) => {
        s.stages = s.stages.filter((x) => x.id !== a.meta.arg)
      })
      .addMatcher(isPending, (s) => {
        s.pending++
        s.error = ''
      })
      .addMatcher(isFulfilled, (s) => {
        s.pending = Math.max(0, s.pending - 1)
      })
      .addMatcher(isRejected, (s, a) => {
        s.pending = Math.max(0, s.pending - 1)
        if (!a.meta.aborted) s.error = a.error.message || 'Ошибка запроса'
      }),
})
export const actions = slice.actions
export const store = configureStore({ reducer: { synthesis: slice.reducer } })
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()
export const useSynthesis = () => useSelector((s: State) => s.synthesis)
