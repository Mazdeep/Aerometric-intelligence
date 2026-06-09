import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import App from '../App';
import { AirportMetar } from '../types';
import { fetchPlan, parseMetars } from '../api/simbrief';

vi.mock('../api/simbrief', () => ({
  fetchPlan: vi.fn(),
  parseMetars: vi.fn(),
}));

const airports: AirportMetar[] = [
  {
    role: 'departure',
    icao: 'LATI',
    iataCode: 'TIA',
    name: 'Tirana',
    metarRaw: 'LATI 081220Z 30007KT 260V330 CAVOK 29/15 Q1016 NOSIG',
    metarTime: '2026-06-08T12:20:00Z',
    decoded: { isDecoded: true },
  },
  {
    role: 'destination',
    icao: 'EGLL',
    iataCode: 'LHR',
    name: 'Heathrow',
    metarRaw: 'EGLL 081220Z 20023KT 9999 -RA BKN023 16/12 Q1005',
    metarTime: '2026-06-08T12:20:00Z',
    decoded: { isDecoded: true },
  },
  {
    role: 'alternate',
    icao: 'EGCC',
    iataCode: 'MAN',
    name: 'Manchester',
    metarRaw: 'EGCC 081220Z 13008KT 070V210 9999 BKN024 17/11 Q1001',
    metarTime: '2026-06-08T12:20:00Z',
    decoded: { isDecoded: true },
  },
];

test('hides alternate flight-plan cards until enabled by the user', async () => {
  const user = userEvent.setup();
  vi.mocked(fetchPlan).mockResolvedValue(new Document());
  vi.mocked(parseMetars).mockReturnValue(airports);

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText('LATI -> EGLL')).toBeInTheDocument();
  });

  expect(screen.getByText('LATI')).toBeInTheDocument();
  expect(screen.getByText('EGLL')).toBeInTheDocument();
  expect(screen.queryByText('EGCC')).not.toBeInTheDocument();

  await act(async () => {
    await user.click(screen.getByRole('button', { name: /Show Alternate \(1\)/i }));
  });

  expect(screen.getByText('EGCC')).toBeInTheDocument();
});
