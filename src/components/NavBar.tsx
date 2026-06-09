import { NavLink } from 'react-router-dom';
import { Sun } from '../icons';

interface Props {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function NavBar({ theme, onToggleTheme }: Props) {
  return (
    <nav className="app-nav" aria-label="Main navigation">
      <div className="app-nav__brand-wrap">
        <span className="app-nav__mark" aria-hidden="true" />
        <span className="app-nav__brand">AeroMetar</span>
        <span className="app-nav__badge">WX Briefing</span>
      </div>

      <div className="nav-segment" aria-label="Weather views">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
        >
          Flight Plan
        </NavLink>
        <NavLink
          to="/vatsim"
          className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
        >
          Live Lookup
        </NavLink>
      </div>

      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <Sun size={24} />
      </button>
    </nav>
  );
}

export default NavBar;
