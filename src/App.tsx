import { useEffect, useMemo, useState } from 'react';
import { fetchPlan, parseMetars } from './api/simbrief';
import AirportCard from './components/AirportCard';
import ErrorScreen from './components/ErrorScreen';
import { AirportMetar, Status } from './types';

function App() {
  const [status, setStatus] = useState<Status>('idle');
  const [airports, setAirports] = useState<AirportMetar[]>([]);
  const [error, setError] = useState<string>('');
  const [showAlternate, setShowAlternate] = useState(false);

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

  const routeTitle = useMemo(() => {
    const departure = airports.find((ap) => ap.role === 'departure')?.icao;
    const destination = airports.find((ap) => ap.role === 'destination')?.icao;
    return departure && destination ? `${departure} -> ${destination}` : 'Flight Plan METAR';
  }, [airports]);

  const visibleAirports = useMemo(
    () => airports.filter((ap) => ap.role !== 'alternate' || showAlternate),
    [airports, showAlternate]
  );

  const alternateCount = useMemo(
    () => airports.filter((ap) => ap.role === 'alternate').length,
    [airports]
  );

  if (status === 'error') {
    return <ErrorScreen message={error} onRetry={load} />;
  }

  return (
    <main className="page" aria-live="polite">
      <header className="flight-hero">
        <div>
          <h1>{routeTitle}</h1>
          <p>Live from SimBrief</p>
        </div>
        {alternateCount > 0 && (
          <button
            className={`alternate-toggle${showAlternate ? ' alternate-toggle--active' : ''}`}
            type="button"
            onClick={() => setShowAlternate((value) => !value)}
          >
            {showAlternate ? 'Hide Alternate' : `Show Alternate (${alternateCount})`}
          </button>
        )}
      </header>

      {status === 'loading' && airports.length === 0 ? (
        <div className="loading">Fetching latest METAR...</div>
      ) : null}

      <section className="metar-grid" aria-label="Airports METAR list">
        {visibleAirports.map((ap) => (
          <AirportCard key={`${ap.role}-${ap.icao}`} airport={ap} />
        ))}
      </section>
    </main>
  );
}

export default App;
