import { useState } from 'react';
import { DecodedMetar } from '../types';
import { buildKpis } from '../utils/parseKpis';
import KpiTile from './KpiTile';
import {
  ChevronDown,
} from '../icons';

interface Props {
  icao: string;
  raw: string;
  decoded: DecodedMetar;
}

type FlightCategory = 'vfr' | 'mvfr' | 'ifr';

function deriveCategory(decoded: DecodedMetar): FlightCategory | null {
  let ceilingFt: number | null = null;
  let visM: number | null = null;

  if (decoded.ceiling) {
    const m = decoded.ceiling.match(/@ (\d+) ft/);
    if (m) ceilingFt = Number(m[1]);
  }
  if (decoded.visibility) {
    const m = decoded.visibility.match(/(\d+) m/);
    if (m) visM = Number(m[1]);
  }

  if (ceilingFt === null && visM === null) return null;
  if ((ceilingFt !== null && ceilingFt < 1000) || (visM !== null && visM < 1600)) return 'ifr';
  if ((ceilingFt !== null && ceilingFt < 3000) || (visM !== null && visM < 5000)) return 'mvfr';
  return 'vfr';
}

function pickWeatherIconClass(raw: string): string {
  const r = raw.toUpperCase();
  if (r.includes('TS')) return 'wi-thunderstorm storm';
  if (r.includes('SN') || r.includes('RASN')) return 'wi-snow snow';
  if (r.includes('RA')) return 'wi-rain rain';
  if (r.includes('FG') || r.includes('BR') || r.includes('HZ')) return 'wi-fog fog';
  if (r.includes('SKC') || r.includes('CAVOK')) return 'wi-day-sunny clear';
  if (r.includes('OVC') || r.includes('BKN')) return 'wi-cloudy cloudy';
  return 'wi-day-sunny-overcast cloudy';
}

export function VatsimMetarCard({ icao, raw, decoded }: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const category = deriveCategory(decoded);
  const kpis = buildKpis(decoded);

  return (
    <article className="card glass card-anim" aria-label={`METAR for ${icao}`}>
      <header className="card__header">
        <div>
          <p className="card__eyebrow">Live METAR · VATSIM</p>
          <h2 className="card__title">{icao}</h2>
          {decoded.issued && (
            <p className="card__subtitle">{decoded.issued}</p>
          )}
        </div>
        <div className="card__meta">
          {category && (
            <span className={`pill pill--${category}`}>{category.toUpperCase()}</span>
          )}
          <div className="weather-icon" aria-hidden="true">
            <i className={`wi ${pickWeatherIconClass(raw)}`} />
          </div>
        </div>
      </header>

      {kpis.length > 0 ? (
        <div className="kpi-grid">
          {kpis.map((kpi, i) => (
            <KpiTile key={`${kpi.kind}-${i}`} kpi={kpi} />
          ))}
        </div>
      ) : (
        <p className="muted kpi-empty">No decoded data available</p>
      )}

      <button
        className={`raw-toggle${showRaw ? ' raw-toggle--open' : ''}`}
        onClick={() => setShowRaw((v) => !v)}
        aria-expanded={showRaw}
        type="button"
      >
        <ChevronDown size={14} className="raw-toggle__chevron" />
        Raw METAR
      </button>

      {showRaw && (
        <div className="metar-raw glass-soft" aria-label="Raw METAR">
          <code>{raw}</code>
        </div>
      )}
    </article>
  );
}

export default VatsimMetarCard;
