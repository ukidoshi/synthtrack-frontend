import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { FileX, Video, Flag, LogIn } from 'lucide-react'

type Page = 'feed' | 'grid' | 'add' | 'login'

export function BottomNav({
  activePage,
  chemist,
  logout,
}: {
  activePage: Page
  chemist: string
  logout: () => void
}) {
  return (
    <Navbar
      as="nav"

      className="bottom-dock"
      aria-label="Основная навигация"
    >
      <Nav className="tabs-row">
        <Nav.Link
          className="tab-item"
          href="#/feed"
          active={activePage === 'feed'}
          aria-current={activePage === 'feed' ? 'page' : undefined}
        >
          <Video size={21} aria-hidden="true" />
          <span>Лента</span>
        </Nav.Link>
        <Nav.Link
          className="tab-item"
          href="#/add"
          active={activePage === 'add'}
          disabled={!chemist}
        >
          <FileX size={21} aria-hidden="true" />
          <span>Добавление</span>
        </Nav.Link>
        <Nav.Link
          className="tab-item"
          href="#/stages"
          active={activePage === 'grid'}
          aria-current={activePage === 'grid' ? 'page' : undefined}
        >
          <Flag size={21} aria-hidden="true" />
          <span>Плитка</span>
        </Nav.Link>
        <Nav.Link
          className="tab-item"
          href={chemist ? undefined : '#/login'}
          as={chemist ? 'button' : 'a'}
          active={activePage === 'login'}
          onClick={chemist ? logout : undefined}
        >
          <LogIn size={21} aria-hidden="true" />
          <span>{chemist ? 'Выход' : 'Вход'}</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}
