import { useState } from 'react';
import { decodeMetar } from '../metarDecode';
import { DecodedMetar, VatsimAirportInfo } from '../types';
import { fetchVatsimAirportInfo, fetchVatsimMetar } from '../api/vatsim';
import VatsimMetarCard from '../components/VatsimMetarCard';

type FetchStatus = 'idle' | 'loading' | 'ready' | 'error';

interface VatsimResult {
  icao: string;
  raw: string;
  decoded: DecodedMetar;
  airportInfo: VatsimAirportInfo | null;
}

const QUICK_PICKS = ['EGLL', 'KSEA', 'OMDB', 'EHAM', 'LEBL'];

export function VatsimMetarPage() {
  const [icao, setIcao] = useState('');
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [result, setResult] = useState<VatsimResult | null>(null);
  const [error, setError] = useState('');

  const load = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 3) return;
    setStatus('loading');
    setError('');
    setResult(null);
    try {
      const [raw, airportInfo] = await Promise.all([
        fetchVatsimMetar(trimmed),
        fetchVatsimAirportInfo(trimmed).catch(() => null),
      ]);
      setResult({ icao: trimmed, raw, decoded: decodeMetar(raw), airportInfo });
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch METAR');
      setStatus('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    load(icao);
  };

  return (
    <main className="page" aria-live="polite">
      <form className="lookup-search" onSubmit={handleSubmit} aria-label="ICAO search">
        <label className="lookup-search__label" htmlFor="icao-search">ICAO</label>
        <div className="lookup-search__field">
          <input
            id="icao-search"
            className="lookup-search__input"
            type="text"
            value={icao}
            onChange={(e) => setIcao(e.target.value.toUpperCase())}
            placeholder="E.G. EGLL"
            maxLength={4}
            minLength={3}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            aria-label="ICAO airport code"
          />
        </div>
        <button
          className="lookup-search__button"
          type="submit"
          disabled={status === 'loading' || icao.trim().length < 3}
        >
          {status === 'loading' ? 'Fetching...' : 'Fetch METAR'}
        </button>
      </form>

      <div className="quick-picks" aria-label="Quick pick airports">
        <span>Quick</span>
        {QUICK_PICKS.map((code) => (
          <button
            key={code}
            className="quick-pick"
            onClick={() => { setIcao(code); load(code); }}
            disabled={status === 'loading'}
            type="button"
          >
            {code}
          </button>
        ))}
      </div>

      {status === 'error' && (
        <div className="vatsim-error" role="alert">
          <p className="vatsim-error__msg">{error}</p>
          <button
            className="text-button"
            onClick={() => { setStatus('idle'); setError(''); }}
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}

      {status === 'loading' && (
        <p className="loading">Fetching METAR for {icao.trim().toUpperCase()}...</p>
      )}

      {result && status === 'ready' && (
        <section className="metar-grid metar-grid--lookup" aria-label="METAR result">
          <VatsimMetarCard
            icao={result.icao}
            raw={result.raw}
            decoded={result.decoded}
            airportInfo={result.airportInfo}
          />
        </section>
      )}

      {!result && status !== 'loading' && status !== 'error' && (
        <section className="lookup-empty" aria-label="Live airport weather">
          <h1>Live airport weather</h1>
          <p>Enter any ICAO code to pull the current METAR from<br />the VATSIM network.</p>
        </section>
      )}
    </main>
  );
}

export default VatsimMetarPage;
