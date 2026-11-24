import { Nav, Navbar } from 'react-bootstrap'
import { FileX, Flag, LogIn, Video } from 'lucide-react'

export function BottomNav({ activePage }: { activePage: 'feed' | 'grid' }) {
  return <Navbar as="nav" className="bottom-dock" aria-label="Основная навигация">
    <Nav className="tabs-row">
      <Nav.Link href="#/feed" className="tab-item" active={activePage === 'feed'} aria-current={activePage === 'feed' ? 'page' : undefined}><Video/><span>Лента</span></Nav.Link>
      <Nav.Link as="span" disabled aria-disabled="true" className="tab-item"><FileX/><span>Добавление</span></Nav.Link>
      <Nav.Link href="#/stages" className="tab-item" active={activePage === 'grid'} aria-current={activePage === 'grid' ? 'page' : undefined}><Flag/><span>Плитка</span></Nav.Link>
      <Nav.Link as="span" disabled aria-disabled="true" className="tab-item"><LogIn/><span>Вход</span></Nav.Link>
    </Nav>
  </Navbar>
}
