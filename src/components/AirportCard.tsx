import { useState } from 'react';
import { AirportMetar } from '../types';
import { buildMetarDisplay } from '../utils/metarDisplay';
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

export function AirportCard({ airport }: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const { icao, iataCode, name, metarRaw, decoded, metarTime, role } = airport;
  const display = buildMetarDisplay(metarRaw, decoded);

  return (
    <article className="metar-card card-anim" aria-label={`${roleLabel[role]} ${icao}`}>
      <header className="metar-card__header">
        <div className="metar-card__identity">
          <div className="metar-card__title-row">
            <h2>{icao}</h2>
            {iataCode && <span className="airport-code-badge">{iataCode}</span>}
          </div>
          {name && <p>{name}</p>}
        </div>
        {metarTime && <span className="metar-card__obs">OBS {formatIsoTime(metarTime)}</span>}
      </header>

      <div className="metar-card__rule" />

      <section className="metar-card__primary" aria-label={`${icao} primary weather`}>
        <div className="primary-stat">
          <span className="primary-stat__label">{display.qnh.label}</span>
          <div className="primary-stat__value">
            <strong>{display.qnh.value}</strong>
            {display.qnh.unit && <span>{display.qnh.unit}</span>}
          </div>
          {display.qnh.secondary && <p>{display.qnh.secondary}</p>}
        </div>

        <div className="primary-stat primary-stat--temperature">
          <span className="primary-stat__label">{display.temperature.label}</span>
          <div className="primary-stat__value">
            <strong>{display.temperature.value}</strong>
            {display.temperature.unit && <span>{display.temperature.unit}</span>}
          </div>
          {display.temperature.secondary && <p>{display.temperature.secondary}</p>}
        </div>
      </section>

      <div className="metar-card__rule" />

      <section className="wind-block" aria-label={`${icao} wind`}>
        <span className="primary-stat__label">{display.wind.label}</span>
        <div className="primary-stat__value">
          <strong>{display.wind.value}</strong>
          {display.wind.unit && <span>{display.wind.unit}</span>}
        </div>
        {display.wind.secondary && <p>{display.wind.secondary}</p>}
      </section>

      <div className="metar-card__rule" />

      <dl className="metar-details">
        {display.rows.map((row) => (
          <div className="metar-details__row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>

      <button
        className={`raw-toggle${showRaw ? ' raw-toggle--open' : ''}`}
        onClick={() => setShowRaw((v) => !v)}
        aria-expanded={showRaw}
        type="button"
      >
        <ChevronDown size={14} className="raw-toggle__chevron" />
        Show raw METAR
      </button>

      {showRaw && (
        <div className="metar-raw" aria-label="Raw METAR">
          <code>{metarRaw}</code>
        </div>
      )}
    </article>
  );
}

export default AirportCard;
