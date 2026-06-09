import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { VatsimMetarPage } from '../VatsimMetarPage';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn((url: string) => {
    if (url.includes('/api/v2/aip/airports/')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          data: {
            icao: url.endsWith('/KSEA') ? 'KSEA' : 'EGLL',
            iata: url.endsWith('/KSEA') ? 'SEA' : 'LHR',
            name: url.endsWith('/KSEA') ? 'Seattle-Tacoma International Airport' : 'Heathrow Airport',
            city: url.endsWith('/KSEA') ? 'Seattle, Washington' : 'London',
            country: url.endsWith('/KSEA') ? 'United States' : 'United Kingdom',
            altitude_ft: url.endsWith('/KSEA') ? 423 : 83,
            fir_code: url.endsWith('/KSEA') ? 'KZSE' : 'EGTT',
          },
        }),
      });
    }

    return Promise.resolve({
      ok: true,
      text: async () => 'EGLL 081220Z 20023KT 9999 -RA BKN023 16/12 Q1005 NOSIG',
    });
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('fetches METAR from form submit', async () => {
  const user = userEvent.setup();
  render(<VatsimMetarPage />);

  await act(async () => {
    await user.type(screen.getByLabelText(/ICAO airport code/i), 'egll');
    await user.click(screen.getByRole('button', { name: /Fetch METAR/i }));
  });

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('https://metar.vatsim.net/EGLL');
    expect(fetch).toHaveBeenCalledWith('https://my.vatsim.net/api/v2/aip/airports/EGLL');
  });
  expect(await screen.findByRole('heading', { name: 'EGLL' })).toBeInTheDocument();
  expect(screen.getByText('Heathrow Airport')).toBeInTheDocument();
});

test('fetches METAR from quick pick', async () => {
  const user = userEvent.setup();
  render(<VatsimMetarPage />);

  await act(async () => {
    await user.click(screen.getByRole('button', { name: 'KSEA' }));
  });

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('https://metar.vatsim.net/KSEA');
    expect(fetch).toHaveBeenCalledWith('https://my.vatsim.net/api/v2/aip/airports/KSEA');
  });
  expect(await screen.findByRole('heading', { name: 'KSEA' })).toBeInTheDocument();
});
