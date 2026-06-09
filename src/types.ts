export type Status = 'idle' | 'loading' | 'error' | 'ready';

export type AirportRole = 'departure' | 'destination' | 'alternate';

export interface AirportMetar {
  role: AirportRole;
  icao: string;
  iataCode?: string;
  name?: string;
  metarRaw: string;
  metarTime?: string;
  metarCategory?: string;
  metarVisibility?: string;
  metarCeiling?: string;
  decoded?: DecodedMetar;
}

export interface DecodedMetar {
  wind?: string;
  visibility?: string;
  ceiling?: string;
  clouds?: string[];
  temperature?: string;
  altimeter?: string;
  issued?: string;
  weather?: string;
  trend?: string;
  remark?: string;
  isDecoded: boolean;
}

export interface VatsimAirportStation {
  callsign: string;
  name: string;
  frequency: string;
  ctaf: boolean;
}

export interface VatsimAirportInfo {
  icao: string;
  iata?: string;
  name?: string;
  altitude_ft?: number;
  transition_alt?: number;
  transition_level?: string;
  city?: string;
  country?: string;
  fir_code?: string;
  general_information?: string;
  stations?: VatsimAirportStation[];
}
