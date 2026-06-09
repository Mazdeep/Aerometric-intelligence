import { VatsimAirportInfo } from '../types';

interface VatsimAirportResponse {
  data?: VatsimAirportInfo;
  message?: string;
}

export async function fetchVatsimMetar(icao: string): Promise<string> {
  const code = icao.trim().toUpperCase();
  const res = await fetch(`https://metar.vatsim.net/${encodeURIComponent(code)}`);
  if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (!text) throw new Error(`No METAR available for ${code} on VATSIM`);
  return text;
}

export async function fetchVatsimAirportInfo(icao: string): Promise<VatsimAirportInfo | null> {
  const code = icao.trim().toUpperCase();
  const res = await fetch(`https://my.vatsim.net/api/v2/aip/airports/${encodeURIComponent(code)}`);
  if (!res.ok) return null;

  const payload = (await res.json()) as VatsimAirportResponse;
  return payload.data ?? null;
}
