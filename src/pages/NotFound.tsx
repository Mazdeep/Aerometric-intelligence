import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="error-screen" aria-label="Page not found">
      <div className="not-found-content">
        <p className="eyebrow">404 • Page Not Found</p>
        <h1 className="not-found-title">Lost in the clouds?</h1>
        <p className="muted">That route doesn't exist in our airspace.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            SimBrief METAR
          </Link>
          <Link to="/vatsim" className="btn btn-ghost">
            VATSIM Live
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
