import { useState } from 'react';
import { decodeMetar } from '../metarDecode';
import { DecodedMetar } from '../types';
import { RefreshCw } from '../icons';
import VatsimMetarCard from '../components/VatsimMetarCard';

type FetchStatus = 'idle' | 'loading' | 'ready' | 'error';

interface VatsimResult {
  icao: string;
  raw: string;
  decoded: DecodedMetar;
}

async function fetchVatsimMetar(icao: string): Promise<string> {
  const res = await fetch(`https://metar.vatsim.net/${icao}`);
  if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (!text) throw new Error(`No METAR available for ${icao} on VATSIM`);
  return text;
}

const QUICK_PICKS = ['EGLL', 'EIDW', 'KJFK', 'KLAX', 'EDDF', 'OMDB'];

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
      const raw = await fetchVatsimMetar(trimmed);
      setResult({ icao: trimmed, raw, decoded: decodeMetar(raw) });
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
      <header className="hero glass">
        <div>
          <p className="eyebrow">VATSIM • Live METAR</p>
          <h1>Live METAR Lookup</h1>
          <p className="muted">Enter any ICAO code to fetch the latest real-time METAR from VATSIM.</p>
        </div>
      </header>

      <form className="vatsim-search glass" onSubmit={handleSubmit} aria-label="ICAO search">
        <input
          className="vatsim-input"
          type="text"
          value={icao}
          onChange={(e) => setIcao(e.target.value.toUpperCase())}
          placeholder="e.g. EGLL"
          maxLength={4}
          minLength={3}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          aria-label="ICAO airport code"
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={status === 'loading' || icao.trim().length < 3}
        >
          <RefreshCw size={18} />
          {status === 'loading' ? 'Fetching…' : 'Fetch METAR'}
        </button>
      </form>

      <div className="vatsim-quick-picks" aria-label="Quick pick airports">
        {QUICK_PICKS.map((code) => (
          <button
            key={code}
            className="pill vatsim-quick-btn"
            onClick={() => { setIcao(code); load(code); }}
            disabled={status === 'loading'}
            type="button"
          >
            {code}
          </button>
        ))}
      </div>

      {status === 'error' && (
        <div className="vatsim-error glass" role="alert">
          <p className="vatsim-error__msg">{error}</p>
          <button
            className="btn btn-ghost"
            onClick={() => { setStatus('idle'); setError(''); }}
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}

      {status === 'loading' && (
        <p className="loading">Fetching METAR for {icao.trim().toUpperCase()}…</p>
      )}

      {result && status === 'ready' && (
        <section className="grid vatsim-result" aria-label="METAR result">
          <VatsimMetarCard icao={result.icao} raw={result.raw} decoded={result.decoded} />
        </section>
      )}
    </main>
  );
}

export default VatsimMetarPage;
