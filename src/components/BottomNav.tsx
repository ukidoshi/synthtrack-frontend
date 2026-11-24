import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { CirclePlus, Clapperboard, Grid2X2, LogIn } from 'lucide-react'

type Page = 'feed' | 'grid'

export function BottomNav({ activePage }: { activePage: Page }) {
  return (
    <Navbar as="nav" fixed="bottom" className="bottom-nav" aria-label="Основная навигация">
      <Nav className="dock-inner">
        <Nav.Link href="#/feed" active={activePage === 'feed'} aria-current={activePage === 'feed' ? 'page' : undefined}>
          <Clapperboard size={21} aria-hidden="true" />
          Лента
        </Nav.Link>
        <Nav.Link as="span" role="link" aria-disabled="true" disabled>
          <CirclePlus size={21} aria-hidden="true" />
          Добавление
        </Nav.Link>
        <Nav.Link href="#/stages" active={activePage === 'grid'} aria-current={activePage === 'grid' ? 'page' : undefined}>
          <Grid2X2 size={21} aria-hidden="true" />
          Плитка
        </Nav.Link>
        <Nav.Link as="span" role="link" aria-disabled="true" disabled>
          <LogIn size={21} aria-hidden="true" />
          Вход
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}
