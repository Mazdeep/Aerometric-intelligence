import { NavLink } from 'react-router-dom';

export function NavBar() {
  return (
    <nav className="app-nav" aria-label="Main navigation">
      <span className="app-nav__brand">Aerometric</span>
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
      >
        SimBrief METAR
      </NavLink>
      <NavLink
        to="/vatsim"
        className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
      >
        VATSIM Live
      </NavLink>
    </nav>
  );
}

export default NavBar;
