import { parseMetars } from '../simbrief';
import { decodeMetar } from '../../metarDecode';

const sample = `<?xml version="1.0"?>
<OFP>
  <origin>
    <icao_code>TEST</icao_code>
    <name>Test Airport</name>
    <metar>TEST 010000Z 18005KT 8000 SCT020 20/15 Q1013 NOSIG</metar>
    <metar_time>2026-02-01T00:00:00Z</metar_time>
  </origin>
  <destination>
    <icao_code>DEST</icao_code>
    <name>Dest Airport</name>
    <metar>DEST 010000Z VRB02KT 5000 RA BKN015 18/16 Q1009</metar>
  </destination>
  <alternate>
    <icao_code>ALTN</icao_code>
    <metar>ALTN 010000Z 00000KT CAVOK 10/02 Q1018</metar>
  </alternate>
</OFP>`;

describe('parseMetars', () => {
  it('extracts origin, destination, and alternate METARs', () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(sample, 'text/xml');
    const result = parseMetars(doc);
    expect(result.map((r) => r.icao)).toEqual(['TEST', 'DEST', 'ALTN']);
    expect(result[0].role).toBe('departure');
    expect(result[1].role).toBe('destination');
    expect(result[2].role).toBe('alternate');
  });
});

describe('decodeMetar', () => {
  it('decodes basic fields with separated wind', () => {
    const decoded = decodeMetar('TEST 010000Z 18005KT 8000 SCT020 20/15 Q1013');
    expect(decoded.wind).toContain('180/05');
    expect(decoded.wind?.startsWith('↓')).toBe(true);
    expect(decoded.visibility).toBe('8000 m');
    expect(decoded.ceiling).toBe('SCT @ 2000 ft');
    expect(decoded.altimeter).toBe('1013 hPa');
  });
});
