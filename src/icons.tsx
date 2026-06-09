import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const makeIcon = (path: React.ReactNode) => ({ size = 20, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {path}
  </svg>
);

export const RefreshCw = makeIcon(
  <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
    <path d="M20.49 15A9 9 0 0 1 5.64 18.36L1 14" />
  </>
);

export const Navigation = makeIcon(
  <>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </>
);

export const Cloud = makeIcon(
  <>
    <path d="M17.5 19a4.5 4.5 0 0 0-.5-9 7 7 0 0 0-13.93 1.5" />
    <path d="M5 19h12.5" />
  </>
);

export const CloudRain = makeIcon(
  <>
    <path d="M16 13v-1a4 4 0 0 0-8 0v1" />
    <path d="M12 20v2" />
    <path d="M8 19v2" />
    <path d="M16 19v2" />
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
  </>
);

export const CloudSun = makeIcon(
  <>
    <path d="M12 2v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="m4.93 19.07 1.41-1.41" />
    <path d="M12 20v2" />
    <path d="m19.07 19.07-1.41-1.41" />
    <path d="M20 12h2" />
    <path d="m19.07 4.93-1.41 1.41" />
    <path d="M17.5 19a4.5 4.5 0 0 0-.5-9 7 7 0 0 0-13.93 1.5" />
  </>
);

export const CloudFog = makeIcon(
  <>
    <path d="M20 17.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15" />
    <path d="M4 22h16" />
    <path d="M7 18h10" />
  </>
);

export const Snowflake = makeIcon(
  <>
    <path d="M12 2v20" />
    <path d="m4.93 4.93 14.14 14.14" />
    <path d="m4.93 19.07 14.14-14.14" />
    <path d="M2 12h20" />
  </>
);

export const Sun = makeIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </>
);

export const Gauge = makeIcon(
  <>
    <path d="M12 14l4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </>
);

export const Thermometer = makeIcon(
  <>
    <path d="M14 14.76V3.5a2.5 2.5 0 1 0-5 0v11.26" />
    <path d="M14 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </>
);

export const Wind = makeIcon(
  <>
    <path d="M9.59 4.59A2 2 0 1 1 12 7H2" />
    <path d="M17.73 7.73A2 2 0 1 1 20 10H2" />
    <path d="M14.17 15.17A2 2 0 1 1 16 18H2" />
  </>
);

export const Eye = makeIcon(
  <>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const Clock3 = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </>
);

export const ArrowUp = makeIcon(
  <>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </>
);

export default {
  RefreshCw,
  Navigation,
  Cloud,
  CloudRain,
  CloudSun,
  CloudFog,
  Snowflake,
  Sun,
  Gauge,
  Thermometer,
  Wind,
  Eye,
  Clock3,
  ArrowUp,
};
