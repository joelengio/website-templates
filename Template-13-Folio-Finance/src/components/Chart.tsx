import { useId, useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useElementWidth } from '../hooks/useElementWidth';

export interface ChartSeries {
  name: string;
  values: number[];
  color: string;
  /** Dashed line (line charts only). */
  dashed?: boolean;
}

export interface ChartMarker {
  x: number;
  label: string;
}

interface Props {
  kind: 'stackedArea' | 'lines' | 'stackedBars';
  xs: number[];
  series: ChartSeries[];
  xFormat: (x: number) => string;
  yFormat: (y: number) => string;
  /** Format used in the readout and data table (defaults to yFormat). */
  valueFormat?: (y: number) => string;
  xTitle: string;
  ariaLabel: string;
  markers?: ChartMarker[];
  /** Show a total row in the readout (stacked charts). */
  showTotal?: boolean;
  totalLabel?: string;
  tableCaption?: string;
  /** Maximum rows in the data table (long series are sampled). */
  tableMaxRows?: number;
}

const M = { top: 14, right: 14, bottom: 38, left: 58 };

function niceCeil(max: number): number {
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const f = max / pow;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * pow;
}

/**
 * Dependency-free SVG chart drawn at the container's real pixel width. Hover/touch or use ← → Home End to
 * inspect any point; the same data is available as a table for screen-reader and keyboard users.
 */
export function Chart({ kind, xs, series, xFormat, yFormat, valueFormat, xTitle, ariaLabel, markers = [], showTotal = false, totalLabel = 'Total', tableCaption, tableMaxRows = 40 }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>(640);
  const [active, setActive] = useState<number | null>(null);
  const uid = useId().replace(/:/g, '');
  const fmt = valueFormat ?? yFormat;
  const height = width < 520 ? 270 : 340;
  const innerW = Math.max(120, width - M.left - M.right);
  const innerH = height - M.top - M.bottom;
  const n = xs.length;
  const stacked = kind !== 'lines';

  const { yMax, cumulative } = useMemo(() => {
    const cum: number[][] = [];
    let running = new Array(n).fill(0);
    for (const s of series) {
      running = running.map((v, i) => v + Math.max(0, s.values[i] ?? 0));
      cum.push(running);
    }
    const peak = stacked ? Math.max(...running, 0) : Math.max(...series.flatMap((s) => s.values), 0);
    return { yMax: niceCeil(peak), cumulative: cum };
  }, [series, n, stacked]);

  const xMin = xs[0];
  const xMax = xs[n - 1];
  const band = kind === 'stackedBars';
  const slot = innerW / n;
  const px = (i: number) => (band ? M.left + slot * i + slot / 2 : M.left + (xMax === xMin ? innerW / 2 : ((xs[i] - xMin) / (xMax - xMin)) * innerW));
  const pxVal = (x: number) => M.left + (xMax === xMin ? innerW / 2 : ((x - xMin) / (xMax - xMin)) * innerW);
  const py = (v: number) => M.top + innerH - (v / yMax) * innerH;

  const yTicks = Array.from({ length: 5 }, (_, i) => (yMax * i) / 4);
  const maxXTicks = width < 420 ? 4 : width < 700 ? 6 : 9;
  const step = Math.max(1, Math.ceil(n / maxXTicks));
  const xTickIdx = xs.map((_, i) => i).filter((i) => i % step === 0);
  if (xTickIdx[xTickIdx.length - 1] !== n - 1 && n - 1 - xTickIdx[xTickIdx.length - 1] >= step * 0.6) xTickIdx.push(n - 1);

  const setFromEvent = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(px(i) - x);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    setActive(best);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = active ?? -1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = Math.min(n - 1, cur + 1);
    else if (e.key === 'ArrowLeft') next = Math.max(0, cur === -1 ? 0 : cur - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else if (e.key === 'Escape') next = null;
    else return;
    e.preventDefault();
    setActive(next);
  };

  const paths = useMemo(() => {
    if (kind === 'stackedBars') return [];
    return series.map((s, si) => {
      if (kind === 'lines') {
        return { line: s.values.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(''), area: '' };
      }
      const top = cumulative[si];
      const bottom = si ? cumulative[si - 1] : new Array(n).fill(0);
      const topPath = top.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join('');
      const botPath = bottom.map((_v, i) => `L${px(n - 1 - i).toFixed(1)},${py(bottom[n - 1 - i]).toFixed(1)}`).join('');
      return { line: topPath, area: `${topPath}${botPath}Z` };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, series, cumulative, width, yMax, n]);

  const readoutIdx = active;
  const total = readoutIdx === null ? 0 : series.reduce((s, ser) => s + (ser.values[readoutIdx] ?? 0), 0);
  const rowStep = Math.max(1, Math.ceil(n / tableMaxRows));
  const tableRows = xs.map((_, i) => i).filter((i) => i % rowStep === 0 || i === n - 1);

  return (
    <figure className="chart">
      <div className="chart__legend" aria-hidden="true">
        {series.map((s) => (
          <span key={s.name}>
            <i style={{ background: s.color }} className={s.dashed ? 'is-dashed' : ''} />
            {s.name}
          </span>
        ))}
      </div>
      <div
        ref={ref}
        className="chart__frame"
        tabIndex={0}
        role="group"
        aria-label={`${ariaLabel}. Use left and right arrow keys to inspect values; a data table follows.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          focusable="false"
          onPointerMove={setFromEvent}
          onPointerDown={setFromEvent}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}
        >
          <g className="chart__grid">
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={width - M.right} y1={py(t)} y2={py(t)} />
                <text x={M.left - 8} y={py(t)} textAnchor="end" dominantBaseline="middle">
                  {yFormat(t)}
                </text>
              </g>
            ))}
          </g>
          <g className="chart__xaxis">
            {xTickIdx.map((i) => (
              <text key={i} x={px(i)} y={height - 16} textAnchor={i === 0 && !band ? 'start' : i === n - 1 && !band ? 'end' : 'middle'}>
                {xFormat(xs[i])}
              </text>
            ))}
            <text x={M.left + innerW / 2} y={height - 2} textAnchor="middle" className="chart__axis-title">
              {xTitle}
            </text>
          </g>
          {kind === 'stackedArea' &&
            paths.map((p, i) => <path key={`a${i}`} d={p.area} fill={series[i].color} fillOpacity={0.82} />)}
          {kind === 'stackedArea' &&
            paths.map((p, i) => <path key={`l${i}`} d={p.line} fill="none" stroke={series[i].color} strokeWidth={1.5} />)}
          {kind === 'lines' &&
            paths.map((p, i) => <path key={`l${i}`} d={p.line} fill="none" stroke={series[i].color} strokeWidth={2.4} strokeDasharray={series[i].dashed ? '6 5' : undefined} strokeLinejoin="round" />)}
          {kind === 'stackedBars' &&
            xs.map((_, i) =>
              series.map((s, si) => {
                const bottom = si ? cumulative[si - 1][i] : 0;
                const top = cumulative[si][i];
                const w = Math.max(3, slot * 0.68);
                return <rect key={`${i}-${si}`} x={px(i) - w / 2} y={py(top)} width={w} height={Math.max(0, py(bottom) - py(top))} fill={s.color} opacity={active === null || active === i ? 1 : 0.55} />;
              }),
            )}
          {markers.map((m) => (
            <g key={m.label} className="chart__marker">
              <line x1={pxVal(m.x)} x2={pxVal(m.x)} y1={M.top} y2={M.top + innerH} />
              <text x={Math.min(pxVal(m.x) + 6, width - M.right - 4)} y={M.top + 12} textAnchor={pxVal(m.x) > width - 130 ? 'end' : 'start'} dx={pxVal(m.x) > width - 130 ? -12 : 0}>
                {m.label}
              </text>
            </g>
          ))}
          {readoutIdx !== null && (
            <g className="chart__cursor">
              <line x1={px(readoutIdx)} x2={px(readoutIdx)} y1={M.top} y2={M.top + innerH} />
              {series.map((s, si) => (
                <circle key={s.name} cx={px(readoutIdx)} cy={py(stacked ? cumulative[si][readoutIdx] : s.values[readoutIdx])} r={4.5} fill={s.color} stroke="#fff" strokeWidth={1.5} />
              ))}
            </g>
          )}
        </svg>
      </div>
      <div className="chart__readout" aria-live="polite" id={`${uid}-readout`}>
        {readoutIdx === null ? (
          <span className="chart__hint">Hover, tap or use the arrow keys to read exact values.</span>
        ) : (
          <>
            <strong>{xTitle}: {xFormat(xs[readoutIdx])}</strong>
            {series.map((s) => (
              <span key={s.name}>
                <i style={{ background: s.color }} /> {s.name}: <b>{fmt(s.values[readoutIdx])}</b>
              </span>
            ))}
            {showTotal && (
              <span>
                {totalLabel}: <b>{fmt(total)}</b>
              </span>
            )}
          </>
        )}
      </div>
      <details className="chart__table">
        <summary>View chart data as a table</summary>
        <div className="table-scroll" role="region" aria-label={`${ariaLabel} data table`} tabIndex={0}>
          <table>
            <caption>{tableCaption ?? ariaLabel}</caption>
            <thead>
              <tr>
                <th scope="col">{xTitle}</th>
                {series.map((s) => (
                  <th scope="col" key={s.name}>
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((i) => (
                <tr key={i}>
                  <th scope="row">{xFormat(xs[i])}</th>
                  {series.map((s) => (
                    <td key={s.name}>{fmt(s.values[i])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
