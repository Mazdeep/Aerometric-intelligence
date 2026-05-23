import { useState } from 'react';
import { AirportMetar } from '../types';
import { buildKpis } from '../utils/parseKpis';
import KpiTile from './KpiTile';
import {
  ChevronDown,
} from '../icons';

interface Props {
  airport: AirportMetar;
}

const roleLabel: Record<AirportMetar['role'], string> = {
  departure: 'Departure',
  destination: 'Destination',
  alternate: 'Alternate',
};

function formatIsoTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}Z`;
}

function pickWeatherIconClass(airport: AirportMetar): string {
  const raw = airport.metarRaw.toUpperCase();
  if (raw.includes('TS')) return 'wi-thunderstorm storm';
  if (raw.includes('SN') || raw.includes('RASN')) return 'wi-snow snow';
  if (raw.includes('RA')) return 'wi-rain rain';
  if (raw.includes('FG') || raw.includes('BR') || raw.includes('HZ')) return 'wi-fog fog';
  if (airport.metarCategory?.toLowerCase() === 'vfr') return 'wi-day-sunny clear';
  if (airport.metarCategory?.toLowerCase() === 'ifr') return 'wi-cloudy cloudy';
  return 'wi-day-sunny-overcast cloudy';
}

export function AirportCard({ airport }: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const { icao, name, metarRaw, decoded, metarTime, metarCategory, role } = airport;
  const kpis = decoded ? buildKpis(decoded) : [];

  return (
    <article className="card glass card-anim" aria-label={`${roleLabel[role]} ${icao}`}>
      <header className="card__header">
        <div>
          <p className="card__eyebrow">{roleLabel[role]}</p>
          <h2 className="card__title">{icao}</h2>
          {name && <p className="card__subtitle">{name}</p>}
        </div>
        <div className="card__meta">
          {metarCategory && (
            <span className={`pill pill--${metarCategory.toLowerCase()}`}>
              {metarCategory.toUpperCase()}
            </span>
          )}
          {metarTime && (
            <span className="pill pill--ghost">{formatIsoTime(metarTime)}</span>
          )}
          <div className="weather-icon" aria-hidden="true">
            <i className={`wi ${pickWeatherIconClass(airport)}`} />
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
          <code>{metarRaw}</code>
        </div>
      )}
    </article>
  );
}

export default AirportCard;
