export type Status = 'idle' | 'loading' | 'error' | 'ready';

export type AirportRole = 'departure' | 'destination' | 'alternate';

export interface AirportMetar {
  role: AirportRole;
  icao: string;
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
  temperature?: string;
  altimeter?: string;
  issued?: string;
  remark?: string;
  isDecoded: boolean;
}
