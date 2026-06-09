import { render, screen } from '@testing-library/react';
import { VatsimMetarCard } from '../VatsimMetarCard';

test('renders airport info from the VATSIM AIP API', () => {
  render(
    <VatsimMetarCard
      icao="KSEA"
      raw="KSEA 081220Z 19008KT 9999 SCT030 18/10 Q1012"
      decoded={{ isDecoded: true, issued: '12:20Z' }}
      airportInfo={{
        icao: 'KSEA',
        iata: 'SEA',
        name: 'Seattle-Tacoma International Airport',
        city: 'Seattle, Washington',
        country: 'United States',
        altitude_ft: 423,
        transition_alt: 18000,
        transition_level: 'FL180',
        fir_code: 'KZSE',
        stations: [
          { callsign: 'SEA_TWR', name: 'Seattle Tower', frequency: '119.900', ctaf: true },
        ],
      }}
    />
  );

  expect(screen.getByText('SEA')).toBeInTheDocument();
  expect(screen.getByText('Seattle-Tacoma International Airport')).toBeInTheDocument();
  expect(screen.getByText('Seattle, Washington, United States')).toBeInTheDocument();
  expect(screen.getByText('423 ft')).toBeInTheDocument();
  expect(screen.getByText('SEA_TWR 119.900')).toBeInTheDocument();
});
