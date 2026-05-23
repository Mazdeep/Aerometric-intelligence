import { DecodedMetar } from '../types';

export type KpiKind = 'qnh' | 'wind' | 'visibility' | 'ceiling' | 'temperature';

export interface KpiData {
  kind: KpiKind;
  value: string;
  unit?: string;
  label: string;
  detail?: string;
  directionDeg?: number;
  speed?: string;
  speedUnit?: string;
}

export function buildKpis(decoded: DecodedMetar): KpiData[] {
  const kpis: KpiData[] = [];

  if (decoded.altimeter) {
    const parts = decoded.altimeter.split(' ');
    kpis.push({ kind: 'qnh', value: parts[0], unit: parts[1], label: 'QNH' });
  }

  if (decoded.wind) {
    kpis.push(parseWind(decoded.wind));
  }

  if (decoded.visibility) {
    kpis.push(parseVisibility(decoded.visibility));
  }

  if (decoded.ceiling) {
    const m = decoded.ceiling.match(/^(\w+) @ (\d+) (\w+)$/);
    if (m) kpis.push({ kind: 'ceiling', value: m[2], unit: m[3], label: `${m[1]} Ceil` });
  }

  if (decoded.temperature) {
    const parts = decoded.temperature.split(' / ');
    const strip = (s: string) => s.replace('°C', '');
    const temp = strip(parts[0]);
    const dew  = parts[1] ? strip(parts[1]) : null;
    kpis.push({
      kind: 'temperature',
      value: dew ? `${temp} / ${dew}` : temp,
      unit: '°C',
      label: 'Temp · Dew',
    });
  }

  return kpis;
}

function parseWind(wind: string): KpiData {
  const m = wind.match(/(VRB|\d{3})\/(\d+)(?:G(\d+))? kt/);
  if (!m) return { kind: 'wind', value: '—', label: 'Wind' };
  const dir = m[1] === 'VRB' ? 'Variable' : `${m[1]}°`;
  const speed = m[3] ? `${m[2]}G${m[3]}` : m[2];
  return {
    kind: 'wind',
    value: dir,
    label: 'Wind',
    detail: `${speed} kt`,
    directionDeg: m[1] === 'VRB' ? undefined : Number(m[1]),
    speed,
    speedUnit: 'kt',
  };
}

function parseVisibility(vis: string): KpiData {
  const m = vis.match(/^(\d+) m$/);
  if (!m) return { kind: 'visibility', value: vis, label: 'Vis' };
  const meters = Number(m[1]);
  if (meters === 9999) return { kind: 'visibility', value: '>10', unit: 'km', label: 'Vis' };
  if (meters >= 1000) {
    const km = meters / 1000;
    return {
      kind: 'visibility',
      value: Number.isInteger(km) ? String(km) : km.toFixed(1),
      unit: 'km',
      label: 'Vis',
    };
  }
  return { kind: 'visibility', value: String(meters), unit: 'm', label: 'Vis' };
}
