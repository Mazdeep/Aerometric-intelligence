import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default Layout;
