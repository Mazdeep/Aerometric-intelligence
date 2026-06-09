import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export function Layout() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = window.localStorage.getItem('aerometar-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('aerometar-theme', theme);
  }, [theme]);

  return (
    <>
      <NavBar theme={theme} onToggleTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))} />
      <Outlet />
    </>
  );
}

export default Layout;
