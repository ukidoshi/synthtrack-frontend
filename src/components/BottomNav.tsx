import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { CirclePlus, Clapperboard, Grid2X2, LogIn } from 'lucide-react'

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
      fixed="bottom"
      className="bottom-nav"
      aria-label="Основная навигация"
    >
      <Nav className="dock-inner">
        <Nav.Link
          href="#/feed"
          active={activePage === 'feed'}
          aria-current={activePage === 'feed' ? 'page' : undefined}
        >
          <Clapperboard size={21} aria-hidden="true" />
          Лента
        </Nav.Link>
        <Nav.Link
          href="#/add"
          active={activePage === 'add'}
          disabled={!chemist}
        >
          <CirclePlus size={21} aria-hidden="true" />
          Добавление
        </Nav.Link>
        <Nav.Link
          href="#/stages"
          active={activePage === 'grid'}
          aria-current={activePage === 'grid' ? 'page' : undefined}
        >
          <Grid2X2 size={21} aria-hidden="true" />
          Плитка
        </Nav.Link>
        <Nav.Link
          href={chemist ? undefined : '#/login'}
          as={chemist ? 'button' : 'a'}
          active={activePage === 'login'}
          onClick={chemist ? logout : undefined}
        >
          <LogIn size={21} aria-hidden="true" />
          {chemist ? 'Выход' : 'Вход'}
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}
