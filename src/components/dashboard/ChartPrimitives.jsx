import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function ChartTooltip({ active, payload, label, valueFormatter, showTotal }) {
  if (!active || !payload?.length) return null;
  const format = valueFormatter || ((v) => v);
  const total = showTotal ? payload.reduce((sum, p) => sum + (p.value || 0), 0) : null;
  return (
    <div className="rounded-md border border-gray-700 bg-black/80 px-3 py-2 text-xs text-white shadow-lg">
      {label && <p className="mb-1 font-medium text-gray-300">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          {p.name}: {format(p.value)}
        </p>
      ))}
      {showTotal && (
        <p className="mt-1 border-t border-white/10 pt-1 font-medium text-gray-300">
          Total: {format(total)}
        </p>
      )}
    </div>
  );
}

export function PieTooltip({ active, payload, total, valueFormatter }) {
  if (!active || !payload?.length) return null;
  const format = valueFormatter || ((v) => v);
  const entry = payload[0];
  const pct = total ? ((entry.value / total) * 100).toFixed(2) : '0.00';
  return (
    <div className="rounded-md border border-gray-700 bg-black/80 px-3 py-2 text-xs text-white shadow-lg">
      <p className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: entry.payload.color }} />
        {entry.name}: {format(entry.value)} ({pct}%)
      </p>
    </div>
  );
}

export function TrendChart({ rows, series, stacked, variant = 'full', axisColor, gridColor, valueFormatter, animate, showTotal }) {
  const isThumb = variant === 'thumb';
  const dataKey = rows?.length ?? 0;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        key={dataKey}
        data={rows}
        margin={isThumb ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 4, right: 8, bottom: 0, left: 0 }}
      >
        {!isThumb && <CartesianGrid stroke={gridColor} vertical={false} />}
        {!isThumb && <XAxis dataKey="label" stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />}
        {!isThumb && (
          <YAxis
            stroke={axisColor}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={valueFormatter ? 56 : 36}
            tickFormatter={valueFormatter}
          />
        )}
        {!isThumb && <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} showTotal={showTotal} />} />}
        {!isThumb && series.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.2}
            strokeWidth={isThumb ? 1.5 : 2}
            dot={false}
            stackId={stacked ? 'stack' : undefined}
            isAnimationActive={animate}
            animationDuration={isThumb ? 600 : 700}
            animationEasing="linear"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BreakdownChart({ data, variant = 'full', animate, legendPosition = 'right', valueFormatter }) {
  const isThumb = variant === 'thumb';
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);
  const dataKey = data?.length ?? 0;
  const legendProps =
    legendPosition === 'bottom'
      ? { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' }
      : legendPosition === 'left'
      ? { layout: 'vertical', align: 'left', verticalAlign: 'middle' }
      : { layout: 'vertical', align: 'right', verticalAlign: 'middle' };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart key={dataKey}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={isThumb ? '55%' : '62%'}
          outerRadius={isThumb ? '90%' : '85%'}
          paddingAngle={1}
          stroke="none"
          isAnimationActive={animate}
          animationDuration={700}
          animationEasing="ease-out"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        {!isThumb && <Tooltip content={<PieTooltip total={total} valueFormatter={valueFormatter} />} />}
        {!isThumb && <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 12 }} {...legendProps} />}
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MetricBarChart({ rows, dataKey: valueKey, name, color, axisColor, gridColor, valueFormatter, animate }) {
  const dataKey = rows?.length ?? 0;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart key={dataKey} data={rows} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis dataKey="label" stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={valueFormatter} />
        <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
        <Bar
          dataKey={valueKey}
          name={name}
          fill={`${color}B3`}
          stroke={color}
          strokeWidth={1.5}
          radius={[6, 6, 0, 0]}
          isAnimationActive={animate}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
