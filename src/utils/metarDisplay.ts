import { DecodedMetar } from '../types';

export interface PrimaryStat {
  label: string;
  value: string;
  unit?: string;
  secondary?: string;
}

export interface DisplayRow {
  label: string;
  value: string;
}

export interface MetarDisplay {
  qnh: PrimaryStat;
  temperature: PrimaryStat;
  wind: PrimaryStat;
  rows: DisplayRow[];
}

const CLOUD_LABELS: Record<string, string> = {
  FEW: 'Few',
  SCT: 'Scattered',
  BKN: 'Broken',
  OVC: 'Overcast',
};

const WEATHER_LABELS: Record<string, string> = {
  TS: 'Thunderstorm',
  TSRA: 'Thunderstorm Rain',
  SHRA: 'Rain Showers',
  RA: 'Rain',
  RASN: 'Rain and Snow',
  SN: 'Snow',
  DZ: 'Drizzle',
  FG: 'Fog',
  BR: 'Mist',
  HZ: 'Haze',
  SA: 'Sand',
  PL: 'Ice Pellets',
  GR: 'Hail',
};

export function buildMetarDisplay(raw: string, decoded?: DecodedMetar): MetarDisplay {
  return {
    qnh: parseQnh(raw, decoded),
    temperature: parseTemperature(raw, decoded),
    wind: parseWind(raw, decoded),
    rows: buildRows(raw, decoded),
  };
}

function buildRows(raw: string, decoded?: DecodedMetar): DisplayRow[] {
  const rows: DisplayRow[] = [];
  const visibility = parseVisibility(raw, decoded);
  const cloud = parseClouds(raw, decoded);
  const ceiling = parseCeiling(raw, decoded);
  const weather = parseWeather(raw, decoded);
  const trend = parseTrend(raw, decoded);

  if (visibility) rows.push({ label: 'Visibility', value: visibility });
  if (cloud) rows.push({ label: 'Cloud', value: cloud });
  if (ceiling) rows.push({ label: 'Ceiling', value: ceiling });
  if (weather) rows.push({ label: 'Weather', value: weather });
  if (trend) rows.push({ label: 'Trend', value: trend });

  return rows;
}

function parseQnh(raw: string, decoded?: DecodedMetar): PrimaryStat {
  const qnhMatch = raw.match(/\bQ(\d{4})\b/);
  if (qnhMatch) {
    const hpa = Number(qnhMatch[1]);
    return {
      label: 'QNH',
      value: String(hpa),
      unit: 'hPa',
      secondary: `${(hpa * 0.029529983071445).toFixed(2)} inHg`,
    };
  }

  const altimeterMatch = raw.match(/\bA(\d{4})\b/);
  if (altimeterMatch) {
    const inHg = Number(altimeterMatch[1]) / 100;
    return {
      label: 'QNH',
      value: String(Math.round(inHg / 0.029529983071445)),
      unit: 'hPa',
      secondary: `${inHg.toFixed(2)} inHg`,
    };
  }

  if (decoded?.altimeter) {
    const [value, unit] = decoded.altimeter.split(' ');
    return { label: 'QNH', value: value || '-', unit: unit || undefined };
  }

  return { label: 'QNH', value: '-' };
}

function parseTemperature(raw: string, decoded?: DecodedMetar): PrimaryStat {
  const match = raw.match(/\s(M?\d{2})\/(M?\d{2}|\/\/)\b/);
  const celsius = match ? metarTempToNumber(match[1]) : decoded?.temperature ? Number(decoded.temperature.split(' / ')[0].replace('°C', '')) : null;

  if (celsius === null || Number.isNaN(celsius)) {
    return { label: 'Temperature', value: '-' };
  }

  const fahrenheit = Math.round((celsius * 9) / 5 + 32);
  return {
    label: 'Temperature',
    value: formatSigned(celsius),
    unit: '°C',
    secondary: `${fahrenheit} °F`,
  };
}

function parseWind(raw: string, decoded?: DecodedMetar): PrimaryStat {
  const match = raw.match(/\b(VRB|\d{3})(\d{2,3})(?:G(\d{2,3}))?KT(?:\s+(\d{3})V(\d{3}))?/);
  if (!match) {
    return { label: 'Wind', value: decoded?.wind ?? '-' };
  }

  const direction = match[1];
  const speed = Number(match[2]);
  const gust = match[3] ? Number(match[3]) : null;
  const variableFrom = match[4];
  const variableTo = match[5];

  let detail = direction === 'VRB' ? 'Variable' : `${Number(direction)}° ${degreesToCompass(Number(direction))}`;
  if (variableFrom && variableTo) {
    detail += ` (${Number(variableFrom)}-${Number(variableTo)}°)`;
  }

  return {
    label: 'Wind',
    value: gust ? `${speed}G${gust}` : String(speed),
    unit: 'kt',
    secondary: detail,
  };
}

function parseVisibility(raw: string, decoded?: DecodedMetar): string | null {
  if (/\bCAVOK\b/.test(raw)) return 'CAVOK';

  const match = raw.match(/\s(\d{4})\s/);
  if (match) return formatVisibilityMeters(Number(match[1]));

  if (!decoded?.visibility) return null;
  const meters = Number(decoded.visibility.match(/\d+/)?.[0]);
  return Number.isFinite(meters) ? formatVisibilityMeters(meters) : decoded.visibility;
}

function parseClouds(raw: string, decoded?: DecodedMetar): string | null {
  if (/\bCAVOK\b/.test(raw)) return 'No cloud below 5000 ft';

  const cloudMatches = Array.from(raw.matchAll(/\b(FEW|SCT|BKN|OVC)(\d{3})(CB|TCU)?\b/g));
  if (cloudMatches.length > 0) {
    return cloudMatches.map(formatCloudMatch).join(' · ');
  }

  if (decoded?.clouds?.length) {
    return decoded.clouds.map(formatDecodedCloud).join(' · ');
  }

  return null;
}

function parseCeiling(raw: string, decoded?: DecodedMetar): string | null {
  const ceiling = Array.from(raw.matchAll(/\b(BKN|OVC)(\d{3})(CB|TCU)?\b/g))[0];
  if (ceiling) return formatFeet(Number(ceiling[2]) * 100);

  if (decoded?.ceiling) {
    const match = decoded.ceiling.match(/@ (\d+) ft/);
    if (match) return formatFeet(Number(match[1]));
  }

  return null;
}

function parseWeather(raw: string, decoded?: DecodedMetar): string | null {
  const match = raw.match(/(?:^|\s)(\+|-)?(TSRA|SHRA|RASN|TS|RA|SN|DZ|FG|BR|HZ|SA|PL|GR)\b/);
  if (match) return formatWeatherToken(match[0].trim());
  return decoded?.weather ?? null;
}

function parseTrend(raw: string, decoded?: DecodedMetar): string | null {
  if (/\bNOSIG\b/.test(raw)) return 'No significant change';
  if (/\bBECMG\b/.test(raw)) return 'Becoming';
  if (/\bTEMPO\b/.test(raw)) return 'Temporary change';
  return decoded?.trend ?? null;
}

function formatVisibilityMeters(meters: number): string {
  if (meters >= 9999) return '10 km or more';
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${Number.isInteger(km) ? km : km.toFixed(1)} km`;
  }
  return `${meters} m`;
}

function formatCloudMatch(match: RegExpMatchArray): string {
  const label = CLOUD_LABELS[match[1]] ?? match[1];
  const suffix = match[3] ? ` ${match[3]}` : '';
  return `${label} ${formatFeet(Number(match[2]) * 100)}${suffix}`;
}

function formatDecodedCloud(cloud: string): string {
  const match = cloud.match(/^(\w+) @ (\d+) ft(.*)$/);
  if (!match) return cloud;
  const label = CLOUD_LABELS[match[1]] ?? match[1];
  return `${label} ${formatFeet(Number(match[2]))}${match[3] ?? ''}`;
}

function formatWeatherToken(token: string): string {
  const intensity = token.startsWith('+') ? 'Heavy ' : token.startsWith('-') ? 'Light ' : '';
  const clean = token.replace(/^[-+]/, '');
  return `${intensity}${WEATHER_LABELS[clean] ?? clean}`;
}

function formatFeet(value: number): string {
  return `${value.toLocaleString('en-US')} ft`;
}

function metarTempToNumber(token: string): number {
  return token.startsWith('M') ? -Number(token.slice(1)) : Number(token);
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function degreesToCompass(degrees: number): string {
  const points = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return points[Math.round((degrees % 360) / 22.5) % 16];
}
