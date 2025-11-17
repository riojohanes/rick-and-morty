import { NavLink } from 'react-router-dom'

export const Header = () => {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__subtitle">Rick & Morty</span>
        <strong>Character Hub</strong>
      </div>

      <nav className="app-header__nav" aria-label="Main navigation">
        <NavLink to="/" end>
          Characters
        </NavLink>
        <NavLink to="/locations">By Location</NavLink>
      </nav>
    </header>
  )
}

