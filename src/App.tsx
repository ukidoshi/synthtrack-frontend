import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, Spinner } from 'react-bootstrap'
import { FlaskConical, UserRound } from 'lucide-react'
import { BottomNav } from './components/BottomNav'
import { FeedPage } from './pages/FeedPage'
import { StageGridPage } from './pages/StageGridPage'
import { ChemistLogin } from './pages/ChemistLogin'
import { SynthesisDraft } from './pages/SynthesisDraft'
import {
  actions,
  loadSynthesisStages,
  tokenKey,
  useAppDispatch,
  useSynthesis,
} from './store'

const readLocation = () => window.location.hash
export default function App() {
  const [location, setLocation] = useState(readLocation)
  const { chemist, minimum, pending, mock, error } = useSynthesis()
  const dispatch = useAppDispatch()
  useEffect(() => {
    function sync() {
      setLocation(readLocation())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  const feed = /^#\/feed(?:\/(\d+)(\/next)?)?$/.exec(location)
  const id = feed?.[1] ? Number(feed[1]) : undefined
  const next = Boolean(feed?.[2])
  const page = feed
    ? 'feed'
    : location === '#/add' && chemist
      ? 'add'
      : (location === '#/login' || location === '#/add') && !chemist
        ? 'login'
        : 'grid'
  useEffect(() => {
    if (page === 'login') return
    const request = dispatch(loadSynthesisStages({ page, id, next }))
    return () => request.abort()
  }, [dispatch, page, id, next, minimum, chemist])
  async function logout() {
    dispatch(actions.authPending(true))
    try {
      await axios.post(
        '/api/chemists/logout',
        {},
        {
          timeout: 8000,
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem(tokenKey),
          },
        },
      )
    } catch (e) {
      if (!axios.isAxiosError(e) || e.response?.status !== 401) {
        dispatch(actions.authPending(false))
        dispatch(actions.showError('Не удалось выйти. Повторите запрос.'))
        return
      }
    }
    localStorage.removeItem(tokenKey)
    dispatch(actions.session(''))
    window.location.hash = '/stages'
  }
  return (
    <>
      <div inert={pending > 0}>
        <header className="site-header">
          <div className="header-inner">
            <a className="wordmark" href="#/stages">
              <span className="brand-icon">
                <FlaskConical size={22} />
              </span>
              SynthTrack
            </a>
            <span className="guest-label">
              <UserRound size={15} />
              {chemist || 'Гость'}
            </span>
          </div>
        </header>
        <main
          className={
            page === 'feed' ? 'main-content feed-content' : 'main-content'
          }
        >
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => dispatch(actions.showError(''))}
            >
              {error}
            </Alert>
          )}
          {mock && page !== 'login' && (
            <small>Сервис недоступен · демонстрационные данные</small>
          )}
          {page === 'feed' ? (
            <FeedPage />
          ) : page === 'add' ? (
            <SynthesisDraft />
          ) : page === 'login' ? (
            <ChemistLogin />
          ) : (
            <StageGridPage />
          )}
        </main>
        <BottomNav activePage={page} chemist={chemist} logout={logout} />
      </div>
      {pending > 0 && (
        <div className="loading-screen" role="status">
          <Spinner animation="border" />
          <span>Загрузка…</span>
        </div>
      )}
    </>
  )
}
