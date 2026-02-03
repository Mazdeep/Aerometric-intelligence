import { AirportMetar } from '../types';
import {
  Cloud,
  CloudRain,
  CloudSun,
  CloudFog,
  Snowflake,
  Sun,
  Gauge,
  Thermometer,
  Wind,
  Eye,
  Clock3,
  ArrowUp,
} from '../icons';

interface Props {
  airport: AirportMetar;
}

const roleLabel: Record<AirportMetar['role'], string> = {
  departure: 'Departure',
  destination: 'Destination',
  alternate: 'Alternate',
};

export function AirportCard({ airport }: Props) {
  const { icao, name, metarRaw, decoded, metarTime, metarCategory, metarVisibility, metarCeiling, role } = airport;
  const weatherIcon = pickWeatherIcon(airport);

  return (
    <article className="card glass card-anim" aria-label={`${roleLabel[role]} ${icao}`}>
      <header className="card__header">
        <div>
          <p className="card__eyebrow">{roleLabel[role]}</p>
          <h2 className="card__title">{icao}</h2>
          {name && <p className="card__subtitle">{name}</p>}
        </div>
        <div className="card__meta">
          {metarCategory && <span className={`pill pill--${metarCategory}`}>{metarCategory.toUpperCase()}</span>}
          {metarTime && <span className="pill pill--ghost">METAR @ {formatIsoTime(metarTime)}</span>}
          <div className="weather-icon">{weatherIcon}</div>
        </div>
      </header>

      <section className="card__body">
        <div className="metar-decoded">
          <h3>Decoded</h3>
          {decoded?.isDecoded ? (
            <ul>
              {decoded.altimeter && (
                <li><Gauge size={16} /> <span>QNH</span><strong>{decoded.altimeter}</strong></li>
              )}
              {decoded.temperature && (
                <li><Thermometer size={16} /> <span>Temp/Dew</span><strong>{decoded.temperature}</strong></li>
              )}
              {decoded.wind && (
                <li><Wind size={16} /> <span>Wind</span><strong>{decoded.wind}</strong></li>
              )}
              {decoded.visibility && (
                <li><Eye size={16} /> <span>Visibility</span><strong>{decoded.visibility}</strong></li>
              )}
              {decoded.ceiling && (
                <li><ArrowUp size={16} /> <span>Ceiling</span><strong>{decoded.ceiling}</strong></li>
              )}
              {decoded.issued && (
                <li><Clock3 size={16} /> <span>Issued</span><strong>{decoded.issued}</strong></li>
              )}
            </ul>
          ) : (
            <p className="muted">{decoded?.remark || 'Unable to decode METAR'}</p>
          )}
          {metarVisibility && <p className="muted inline-meta">SimBrief visibility: {metarVisibility} m</p>}
          {metarCeiling && <p className="muted inline-meta">SimBrief ceiling: {metarCeiling} ft</p>}
        </div>
        <div className="metar-raw glass-soft" aria-label="Raw METAR">
          <p className="eyebrow">Raw METAR</p>
          <code>{metarRaw}</code>
        </div>
      </section>
    </article>
  );
}

function formatIsoTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toUTCString().replace(/:\d{2} GMT$/, ' GMT');
}

function pickWeatherIcon(airport: AirportMetar) {
  const raw = airport.metarRaw.toUpperCase();
  if (raw.includes('TS')) return <CloudRain size={30} className="icon storm" />;
  if (raw.includes('SN') || raw.includes('RASN')) return <Snowflake size={30} className="icon snow" />;
  if (raw.includes('RA')) return <CloudRain size={30} className="icon rain" />;
  if (raw.includes('FG') || raw.includes('BR') || raw.includes('HZ')) return <CloudFog size={30} className="icon fog" />;
  if (airport.metarCategory?.toLowerCase() === 'vfr') return <Sun size={30} className="icon clear" />;
  if (airport.metarCategory?.toLowerCase() === 'ifr') return <Cloud size={30} className="icon cloudy" />;
  return <CloudSun size={30} className="icon cloudy" />;
}

export default AirportCard;
