import { render, screen } from '@testing-library/react';
import { AirportCard } from '../AirportCard';
import { AirportMetar } from '../../types';

const airport: AirportMetar = {
  role: 'departure',
  icao: 'TEST',
  name: 'Test Airport',
  metarRaw: 'TEST 010000Z 18005KT 8000 SCT020 20/15 Q1013',
  decoded: {
    isDecoded: true,
    wind: '18005 kt',
    visibility: '8000 m',
    ceiling: 'SCT @ 2000 ft',
    temperature: '20°C / 15°C',
    altimeter: '1013 hPa',
  },
};

test('renders raw and decoded METAR', () => {
  render(<AirportCard airport={airport} />);
  expect(screen.getByText(/TEST/)).toBeInTheDocument();
  expect(screen.getByText(/Raw METAR/)).toBeInTheDocument();
  expect(screen.getByText(/Wind/)).toBeInTheDocument();
});
