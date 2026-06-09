import { fetchVatsimAirportInfo, fetchVatsimMetar } from '../vatsim';

afterEach(() => {
  vi.unstubAllGlobals();
});

test('fetches VATSIM METAR text', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    text: async () => 'KSEA 081220Z 19008KT 9999 SCT030 18/10 Q1012',
  }));

  await expect(fetchVatsimMetar('ksea')).resolves.toBe('KSEA 081220Z 19008KT 9999 SCT030 18/10 Q1012');
  expect(fetch).toHaveBeenCalledWith('https://metar.vatsim.net/KSEA');
});

test('fetches VATSIM airport info', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: {
        icao: 'KSEA',
        iata: 'SEA',
        name: 'Seattle-Tacoma International Airport',
        city: 'Seattle, Washington',
        country: 'United States',
        altitude_ft: 423,
        fir_code: 'KZSE',
      },
    }),
  }));

  await expect(fetchVatsimAirportInfo('ksea')).resolves.toMatchObject({
    icao: 'KSEA',
    iata: 'SEA',
    name: 'Seattle-Tacoma International Airport',
  });
  expect(fetch).toHaveBeenCalledWith('https://my.vatsim.net/api/v2/aip/airports/KSEA');
});

test('returns null when VATSIM airport info is missing', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
  }));

  await expect(fetchVatsimAirportInfo('egll')).resolves.toBeNull();
});
