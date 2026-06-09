import { buildMetarDisplay } from '../metarDisplay';

describe('buildMetarDisplay', () => {
  it('formats QNH, temperature, CAVOK, and trend rows', () => {
    const display = buildMetarDisplay('LATI 081220Z 30007KT 260V330 CAVOK 29/15 Q1016 NOSIG');

    expect(display.qnh).toMatchObject({
      value: '1016',
      unit: 'hPa',
      secondary: '30.00 inHg',
    });
    expect(display.temperature).toMatchObject({
      value: '+29',
      unit: '°C',
      secondary: '84 °F',
    });
    expect(display.wind).toMatchObject({
      value: '7',
      unit: 'kt',
      secondary: '300° WNW (260-330°)',
    });
    expect(display.rows).toContainEqual({ label: 'Visibility', value: 'CAVOK' });
    expect(display.rows).toContainEqual({ label: 'Cloud', value: 'No cloud below 5000 ft' });
    expect(display.rows).toContainEqual({ label: 'Trend', value: 'No significant change' });
  });

  it('formats multiple cloud layers and weather', () => {
    const display = buildMetarDisplay('EGLL 081220Z 20023KT 9999 -RA FEW003 BKN023 BKN029 BKN036 16/12 Q1005');

    expect(display.rows).toContainEqual({ label: 'Visibility', value: '10 km or more' });
    expect(display.rows).toContainEqual({
      label: 'Cloud',
      value: 'Few 300 ft · Broken 2,300 ft · Broken 2,900 ft · Broken 3,600 ft',
    });
    expect(display.rows).toContainEqual({ label: 'Ceiling', value: '2,300 ft' });
    expect(display.rows).toContainEqual({ label: 'Weather', value: 'Light Rain' });
  });
});
