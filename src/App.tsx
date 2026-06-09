import { useEffect, useMemo, useState } from 'react';
import { fetchPlan, parseMetars } from './api/simbrief';
import AirportCard from './components/AirportCard';
import ErrorScreen from './components/ErrorScreen';
import { AirportMetar, Status } from './types';
import { RefreshCw, Navigation } from './icons';

function App() {
  const [status, setStatus] = useState<Status>('idle');
  const [airports, setAirports] = useState<AirportMetar[]>([]);
  const [error, setError] = useState<string>('');
  const [showAlternate, setShowAlternate] = useState<boolean>(false);

  const load = async () => {
    setStatus('loading');
    setError('');
    try {
      const doc = await fetchPlan();
      const data = parseMetars(doc);
      setAirports(data);
      setStatus('ready');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visibleAirports = useMemo(
    () => airports.filter((ap) => ap.role !== 'alternate' || showAlternate),
    [airports, showAlternate]
  );

  if (status === 'error') {
    return <ErrorScreen message={error} onRetry={load} />;
  }

  return (
    <main className="page" aria-live="polite">
      <header className="hero glass">
        <div>
          <p className="eyebrow">SimBrief • METAR Focus</p>
          <h1>Approach-Ready METARs</h1>
          <p className="muted">Departure and destination in a clean, high-contrast layout.</p>
        </div>
        <div className="hero__actions">
          <button
            className={`btn btn-ghost ${showAlternate ? 'btn-ghost--active' : ''}`}
            onClick={() => setShowAlternate((v) => !v)}
          >
            <Navigation size={18} />
            {showAlternate ? 'Hide Alternate' : 'Show Alternate'}
          </button>
          <button className="btn btn-primary" onClick={load} disabled={status === 'loading'}>
            <RefreshCw size={18} />
            {status === 'loading' ? 'Fetching…' : 'Refresh'}
          </button>
        </div>
      </header>

      {status === 'loading' && airports.length === 0 ? (
        <div className="loading">Fetching latest METAR…</div>
      ) : null}

      <section className="grid" aria-label="Airports METAR list">
        {visibleAirports.map((ap) => (
          <AirportCard key={`${ap.role}-${ap.icao}`} airport={ap} />
        ))}
      </section>
    </main>
  );
}

export default App;
