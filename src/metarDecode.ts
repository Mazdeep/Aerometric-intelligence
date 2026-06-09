import { DecodedMetar } from './types';

// Minimal METAR decoder to extract key fields for readability.
export function decodeMetar(raw: string): DecodedMetar {
  const text = raw.trim();
  if (!text) return { isDecoded: false, remark: 'No METAR provided' };

  try {
    const windMatch = text.match(/\b(VRB|\d{3})(\d{2,3})(G(\d{2,3}))?KT/);
    const visibilityMatch = text.match(/\s(\d{4})\s/);
    const altimeterMatch = text.match(/\bQ(\d{4})\b|\bA(\d{4})\b/);
    const tempMatch = text.match(/\s(M?\d{2})\/(M?\d{2})\b/);
    const timeMatch = text.match(/\b(\d{2})(\d{2})(\d{2})Z/);
    const cloudMatches = Array.from(text.matchAll(/\b(FEW|SCT|BKN|OVC)(\d{3})(CB|TCU)?\b/g));
    const phenomenaMatch = text.match(/(?:^|\s)(\+|-)?(TSRA|SHRA|RASN|TS|RA|SN|DZ|FG|BR|HZ|SA|PL|GR)\b/);
    const trendMatch = text.match(/\b(NOSIG|BECMG|TEMPO)\b/);

    const wind = windMatch ? formatWind(windMatch[1], windMatch[2], windMatch[4]) : undefined;

    const visibility = visibilityMatch ? `${visibilityMatch[1]} m` : undefined;

    let altimeter: string | undefined;
    if (altimeterMatch) {
      const [full] = altimeterMatch;
      if (full.startsWith('Q')) altimeter = `${full.slice(1)} hPa`;
      else if (full.startsWith('A')) altimeter = `${(Number(full.slice(1)) / 100).toFixed(2)} inHg`;
    }

    const temperature = tempMatch
      ? `${formatTemp(tempMatch[1])} / ${formatTemp(tempMatch[2])}`
      : undefined;

    const issued = timeMatch ? `${timeMatch[2]}:${timeMatch[3]}Z` : undefined;

    const clouds = cloudMatches.map((match) => {
      const type = match[1];
      const height = (Number(match[2]) * 100).toFixed(0);
      const suffix = match[3] ? ` ${match[3]}` : '';
      return `${type} @ ${height} ft${suffix}`;
    });

    const ceilingLayer = cloudMatches.find((match) => match[1] === 'BKN' || match[1] === 'OVC') ?? cloudMatches[0];
    const ceiling = ceilingLayer
      ? `${ceilingLayer[1]} @ ${(Number(ceilingLayer[2]) * 100).toFixed(0)} ft`
      : undefined;

    const isDecoded = Boolean(wind || visibility || altimeter || temperature || ceiling || issued);

    return {
      isDecoded,
      wind,
      visibility,
      altimeter,
      temperature,
      ceiling,
      clouds,
      issued,
      weather: phenomenaMatch ? formatWeather(phenomenaMatch[0].trim()) : undefined,
      trend: trendMatch ? formatTrend(trendMatch[1]) : undefined,
      remark: phenomenaMatch ? phenomenaMatch[0].trim() : isDecoded ? undefined : 'Unable to decode',
    };
  } catch (err) {
    return { isDecoded: false, remark: 'Decode error' };
  }
}

function formatWeather(token: string): string {
  const intensity = token.startsWith('+') ? 'Heavy ' : token.startsWith('-') ? 'Light ' : '';
  const clean = token.replace(/^[-+]/, '');
  const map: Record<string, string> = {
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
  return `${intensity}${map[clean] ?? clean}`;
}

function formatTrend(token: string): string {
  const map: Record<string, string> = {
    NOSIG: 'No significant change',
    BECMG: 'Becoming',
    TEMPO: 'Temporary change',
  };
  return map[token] ?? token;
}

function formatTemp(token: string): string {
  return token.startsWith('M') ? `-${Number(token.slice(1))}°C` : `${Number(token)}°C`;
}

function formatWind(dirToken: string, spdToken: string, gustToken?: string): string {
  if (dirToken === 'VRB') {
    return `VRB/${spdToken}${gustToken ? `G${gustToken}` : ''} kt`;
  }
  const heading = Number(dirToken);
  const arrow = headingToArrow(heading);
  return `${arrow} ${dirToken}/${spdToken}${gustToken ? `G${gustToken}` : ''} kt`;
}

function headingToArrow(deg: number): string {
  if (Number.isNaN(deg)) return '↻';
  const sectors = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const idx = Math.round((deg % 360) / 45) % 8;
  return sectors[idx];
}
