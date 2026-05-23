import { KpiData } from '../utils/parseKpis';

interface Props {
  kpi: KpiData;
}

const iconForKind: Record<KpiData['kind'], string> = {
  qnh: 'wi-barometer',
  wind: 'wi-strong-wind',
  visibility: 'wi-horizon-alt',
  ceiling: 'wi-cloud',
  temperature: 'wi-thermometer',
};

export function KpiTile({ kpi }: Props) {
  return (
    <div className={`kpi kpi--${kpi.kind}`}>
      <div className="kpi__topline">
        <span className="kpi__icon" aria-hidden="true">
          <i className={`wi ${iconForKind[kpi.kind]}`} />
        </span>
        <span className="kpi__label">{kpi.label}</span>
      </div>

      {kpi.kind === 'wind' ? (
        <div className="kpi__wind">
          <div className="kpi__wind-direction">
            {kpi.directionDeg !== undefined && (
              <span className="kpi__wind-arrow" aria-hidden="true">
                <i className={`wi wi-wind from-${kpi.directionDeg}-deg`} />
              </span>
            )}
            <span className="kpi__wind-heading">{kpi.value}</span>
          </div>
          <div className="kpi__wind-speed">
            <span className="kpi__value">{kpi.speed ?? kpi.detail ?? '—'}</span>
            {kpi.speedUnit && <span className="kpi__unit">{kpi.speedUnit}</span>}
          </div>
        </div>
      ) : (
        <div className="kpi__row">
          <span className="kpi__value">{kpi.value}</span>
          {kpi.unit && <span className="kpi__unit">{kpi.unit}</span>}
        </div>
      )}
    </div>
  );
}

export default KpiTile;
