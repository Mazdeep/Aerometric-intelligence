import { useState } from 'react';
import { DecodedMetar, VatsimAirportInfo } from '../types';
import { buildMetarDisplay } from '../utils/metarDisplay';
import {
  ChevronDown,
} from '../icons';

interface Props {
  icao: string;
  raw: string;
  decoded: DecodedMetar;
  airportInfo?: VatsimAirportInfo | null;
}

export function VatsimMetarCard({ icao, raw, decoded, airportInfo }: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const display = buildMetarDisplay(raw, decoded);
  const airportRows = buildAirportRows(airportInfo);

  return (
    <article className="metar-card metar-card--lookup card-anim" aria-label={`METAR for ${icao}`}>
      <header className="metar-card__header">
        <div className="metar-card__identity">
          <div className="metar-card__title-row">
            <h2>{icao}</h2>
            {airportInfo?.iata && <span className="airport-code-badge">{airportInfo.iata}</span>}
          </div>
          <p>{airportInfo?.name ?? 'Live METAR'}</p>
        </div>
        {decoded.issued && <span className="metar-card__obs">OBS {decoded.issued}</span>}
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

      {airportRows.length > 0 && (
        <>
          <div className="metar-card__rule" />
          <dl className="metar-details metar-details--airport">
            {airportRows.map((row) => (
              <div className="metar-details__row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

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
          <code>{raw}</code>
        </div>
      )}
    </article>
  );
}

export default VatsimMetarCard;

function buildAirportRows(airportInfo?: VatsimAirportInfo | null) {
  if (!airportInfo) return [];

  const rows: Array<{ label: string; value: string }> = [];
  const location = [airportInfo.city, airportInfo.country].filter(Boolean).join(', ');
  const transition = [airportInfo.transition_alt ? `${airportInfo.transition_alt.toLocaleString('en-US')} ft` : null, airportInfo.transition_level]
    .filter(Boolean)
    .join(' / ');
  const stations = airportInfo.stations
    ?.filter((station) => station.callsign && station.frequency)
    .slice(0, 3)
    .map((station) => `${station.callsign} ${station.frequency}`)
    .join(' · ');

  if (location) rows.push({ label: 'Airport', value: location });
  if (typeof airportInfo.altitude_ft === 'number') {
    rows.push({ label: 'Elevation', value: `${airportInfo.altitude_ft.toLocaleString('en-US')} ft` });
  }
  if (airportInfo.fir_code) rows.push({ label: 'FIR', value: airportInfo.fir_code });
  if (transition) rows.push({ label: 'Transition', value: transition });
  if (stations) rows.push({ label: 'Stations', value: stations });

  return rows;
}
