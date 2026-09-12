import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from "react";
import { usePrefersReducedMotion, TrendChart, BreakdownChart } from "./ChartPrimitives";
import { ModelDemand } from "..";
import { MdKeyboardArrowDown } from "react-icons/md";
import styles from "../../style";

const formatCapacity = (bytes) => {
  if (bytes >= 1099511627776) return (bytes / 1099511627776).toFixed(1) + ' TB';
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  return bytes.toFixed(0) + ' B';
};

const formatDailyLabel = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CHART_TYPES = {
  PARTICIPANTS: 'participants',
  JOBS: 'jobs',
  CAPACITY: 'capacity',
  GPU_BREAKDOWN: 'gpu_breakdown',
  GPU_TREND: 'gpu_trend',
};

const GPU_PALETTE = [
  '#4FD8C4', '#A78BFA', '#60A5FA', '#F59E0B', '#F472B6',
  '#34D399', '#FB923C', '#818CF8', '#FBBF24', '#38BDF8',
];
const GPU_OTHER_COLOR = '#9CA3AF';

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
};
const colorForModel = (name) => GPU_PALETTE[hashString(name) % GPU_PALETTE.length];

const GPU_VENDORS = [
  { label: 'NVIDIA', color: '#76B900', match: /nvidia|geforce|quadro|tesla|titan|\brtx\b|\bgtx\b|\ba(?:100|800|40|30|16|10|6000|5000|4000|2000)\b|\bh(?:100|200)\b|\bl(?:4|40|40s)\b|\bv100\b/i },
  { label: 'AMD', color: '#ED1C24', match: /\bamd\b|radeon|instinct|\bmi\d{2,3}\b|\brx\s?\d{3,4}\b/i },
  { label: 'Apple Silicon', color: '#A2AAAD', match: /apple|\bm[1-4]\b(\s?(pro|max|ultra))?/i },
];
const GPU_VENDOR_OTHER = { label: 'Other', color: GPU_OTHER_COLOR };

const classifyGpuVendor = (modelName) => GPU_VENDORS.find((v) => v.match.test(modelName || '')) || GPU_VENDOR_OTHER;

const buildVendorBreakdown = (byGpuModel) => {
  if (!byGpuModel) return null;
  const totals = {};
  Object.entries(byGpuModel).forEach(([model, count]) => {
    const vendor = classifyGpuVendor(model);
    if (!totals[vendor.label]) totals[vendor.label] = { label: vendor.label, color: vendor.color, count: 0 };
    totals[vendor.label].count += count;
  });
  const entries = Object.values(totals).filter((v) => v.count > 0);
  if (!entries.length) return null;
  entries.sort((a, b) => b.count - a.count);
  return entries;
};

const RANGE_OPTIONS = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
  { label: '1Y', value: 365 },
];
const WEEKLY_THRESHOLD_DAYS = 180;
const MAX_GPU_TREND_SERIES = 6;

const CHART_META = {
  [CHART_TYPES.PARTICIPANTS]: { label: 'Network Participants', description: 'Workers and validators over time', accent: '#4FD8C4' },
  [CHART_TYPES.JOBS]: { label: 'Job Activity', description: 'Jobs completed per day', accent: '#A78BFA' },
  [CHART_TYPES.CAPACITY]: { label: 'GPU Capacity', description: 'Used vs. free compute', accent: '#60A5FA' },
  [CHART_TYPES.GPU_BREAKDOWN]: { label: 'GPU Breakdown', description: 'Benchmarked devices by model', accent: '#F59E0B' },
  [CHART_TYPES.GPU_TREND]: { label: 'GPU Trend', description: 'Model mix over time', accent: '#34D399' },
};

const sliceDaily = (daily, days) => {
  if (!daily?.labels?.length) return null;
  const start = Math.max(0, daily.labels.length - days);
  return {
    labels: daily.labels.slice(start),
    datasets: Object.fromEntries(
      Object.entries(daily.datasets || {}).map(([key, arr]) => [key, (arr || []).slice(start)])
    ),
  };
};

const toRows = (labels, seriesMap) =>
  labels.map((label, i) => {
    const row = { label };
    for (const [key, arr] of Object.entries(seriesMap)) row[key] = arr?.[i] ?? null;
    return row;
  });

const buildBreakdownPieData = (breakdown) => {
  const entries = Object.entries(breakdown || {}).filter(([, count]) => count > 0);
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries.map(([model, count]) => ({ name: model, value: count, color: colorForModel(model) }));
};

const buildGpuModelTrendRows = (device, days) => {
  if (!device?.labels?.length) return null;
  const start = Math.max(0, device.labels.length - days);
  const labels = device.labels.slice(start);
  const byDay = device.gpu_model_breakdown_by_day || {};

  const totals = {};
  labels.forEach((date) => {
    Object.entries(byDay[date] || {}).forEach(([model, count]) => {
      totals[model] = (totals[model] || 0) + count;
    });
  });

  const allModels = Object.keys(totals);
  if (!allModels.length) return null;

  const topModels = allModels.sort((a, b) => totals[b] - totals[a]).slice(0, MAX_GPU_TREND_SERIES);
  const otherModels = allModels.filter((m) => !topModels.includes(m));

  const series = topModels.map((model) => ({ key: model, label: model, color: colorForModel(model) }));
  const seriesMap = Object.fromEntries(
    topModels.map((model) => [model, labels.map((date) => (byDay[date] || {})[model] || 0)])
  );

  if (otherModels.length) {
    series.push({ key: '__other', label: 'Other', color: GPU_OTHER_COLOR });
    seriesMap.__other = labels.map((date) => {
      const day = byDay[date] || {};
      return otherModels.reduce((sum, m) => sum + (day[m] || 0), 0);
    });
  }

  return {
    rows: toRows(labels.map(formatDailyLabel), seriesMap),
    series,
    hasOther: otherModels.length > 0,
    totalModels: allModels.length,
  };
};

const resolveDeviceSnapshot = (device) => {
  const current = device?.current ?? null;
  const hasCurrentBreakdown = !!(current?.by_gpu_model && Object.keys(current.by_gpu_model).length);
  if (hasCurrentBreakdown) return { ...current, date: null, isStale: false };

  const labels = device?.labels ?? [];
  const gpuByDay = device?.gpu_model_breakdown_by_day ?? {};
  const backendByDay = device?.backend_breakdown_by_day ?? {};
  const datasets = device?.datasets ?? {};

  for (let i = labels.length - 1; i >= 0; i--) {
    const date = labels[i];
    const breakdown = gpuByDay[date];
    if (breakdown && Object.keys(breakdown).length) {
      return {
        by_gpu_model: breakdown,
        by_backend: backendByDay[date] || {},
        avg_tflops: datasets.avg_tflops?.[i] ?? null,
        avg_bandwidth_gb_s: datasets.avg_bandwidth_gb_s?.[i] ?? null,
        total_benchmarked: datasets.total_benchmarked?.[i] ?? 0,
        date,
        isStale: true,
      };
    }
  }
  return current ? { ...current, date: null, isStale: false } : null;
};

const NetworkDashboard = ({
  loading,
  fetchNetworkData,
  networkStats,
  networkHistory,
  modelDemandData,
  error,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [selectedChart, setSelectedChart] = useState(CHART_TYPES.PARTICIPANTS);
  const [selectedRangeDays, setSelectedRangeDays] = useState(90);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dailySlice = sliceDaily(networkHistory?.daily, selectedRangeDays);
  const weekly = networkHistory?.weekly ?? null;
  const preferWeekly = selectedRangeDays >= WEEKLY_THRESHOLD_DAYS && !!weekly;

  const participants = useMemo(() => {
    if (preferWeekly && weekly?.datasets?.avg_workers && weekly?.datasets?.avg_validators) {
      return {
        rows: toRows(weekly.labels, { workers: weekly.datasets.avg_workers, validators: weekly.datasets.avg_validators }),
        series: [
          { key: 'workers', label: 'Workers (weekly avg)', color: '#4FD8C4' },
          { key: 'validators', label: 'Validators (weekly avg)', color: '#A78BFA' },
        ],
      };
    }
    if (!dailySlice) return null;
    return {
      rows: toRows(dailySlice.labels.map(formatDailyLabel), {
        workers: dailySlice.datasets.workers,
        validators: dailySlice.datasets.validators,
      }),
      series: [
        { key: 'workers', label: 'Workers', color: '#4FD8C4' },
        { key: 'validators', label: 'Validators', color: '#A78BFA' },
      ],
    };
  }, [preferWeekly, weekly, dailySlice]);

  const jobs = useMemo(() => {
    if (preferWeekly && weekly?.datasets?.avg_jobs) {
      return {
        rows: toRows(weekly.labels, { jobs: weekly.datasets.avg_jobs }),
        series: [{ key: 'jobs', label: 'Jobs (weekly avg)', color: '#A78BFA' }],
      };
    }
    if (!dailySlice) return null;
    return {
      rows: toRows(dailySlice.labels.map(formatDailyLabel), { jobs: dailySlice.datasets.jobs }),
      series: [{ key: 'jobs', label: 'Jobs', color: '#A78BFA' }],
    };
  }, [preferWeekly, weekly, dailySlice]);

  const capacity = useMemo(() => {
    if (!dailySlice?.datasets?.total_capacity || !dailySlice?.datasets?.used_capacity) return null;
    const free = dailySlice.datasets.total_capacity.map((total, i) => total - dailySlice.datasets.used_capacity[i]);
    return {
      rows: toRows(dailySlice.labels.map(formatDailyLabel), { used: dailySlice.datasets.used_capacity, free }),
      series: [
        { key: 'used', label: 'Used Capacity', color: '#60A5FA' },
        { key: 'free', label: 'Free Capacity', color: '#22C55E' },
      ],
    };
  }, [dailySlice]);

  const deviceCurrent = resolveDeviceSnapshot(networkHistory?.device);
  const gpuBreakdownData = buildBreakdownPieData(deviceCurrent?.by_gpu_model);
  const vendorBreakdown = buildVendorBreakdown(deviceCurrent?.by_gpu_model);
  const vendorTotal = vendorBreakdown ? vendorBreakdown.reduce((sum, v) => sum + v.count, 0) : 0;

  const gpuTrend = useMemo(
    () => buildGpuModelTrendRows(networkHistory?.device, selectedRangeDays),
    [networkHistory?.device, selectedRangeDays]
  );

  const axisColor = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const charts = {
    [CHART_TYPES.PARTICIPANTS]: participants && { kind: 'area', ...participants },
    [CHART_TYPES.JOBS]: jobs && { kind: 'area', ...jobs },
    [CHART_TYPES.CAPACITY]: capacity && { kind: 'area', ...capacity, stacked: true, valueFormatter: formatCapacity },
    [CHART_TYPES.GPU_BREAKDOWN]: gpuBreakdownData && { kind: 'pie', data: gpuBreakdownData },
    [CHART_TYPES.GPU_TREND]: gpuTrend && { kind: 'area', rows: gpuTrend.rows, series: gpuTrend.series, stacked: true },
  };

  const weeklyAwareTypes = new Set([CHART_TYPES.PARTICIPANTS, CHART_TYPES.JOBS]);

  const renderChart = (key, variant) => {
    const chart = charts[key];
    if (!chart) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-[#5B6272]">
          No data available
        </div>
      );
    }
    if (chart.kind === 'pie') {
      return <BreakdownChart data={chart.data} variant={variant} animate={!prefersReducedMotion} />;
    }
    return (
      <TrendChart
        rows={chart.rows}
        series={chart.series}
        stacked={chart.stacked}
        valueFormatter={chart.valueFormatter}
        variant={variant}
        axisColor={axisColor}
        gridColor={gridColor}
        animate={!prefersReducedMotion}
      />
    );
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1380px] flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FD8C4]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1380px] flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading network data</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchNetworkData}
            className="mt-4 px-4 py-2 bg-[#4FD8C4] text-[#0A0D13] font-medium rounded-full hover:bg-[#6EE2D1] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const activeMeta = CHART_META[selectedChart];
  const activeIsWeekly = preferWeekly && weeklyAwareTypes.has(selectedChart);
  const activeChart = charts[selectedChart];

  return (
    <div className="w-full mt-2 max-w-[1380px] space-y-2">
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0 }}
        className="mb-6 -mx-1 sm:-mx-3"
      >
        {/* Active Networks Section */}
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#4FD8C4]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
              Active Networks
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex min-w-[220px] max-w-[340px] flex-1 items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm px-4 py-3 shadow-sm"
            >
              <div className="relative flex h-3 w-3 items-center justify-center shrink-0">
                <motion.span
                  className="absolute h-3 w-3 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.55, 0, 0.55] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-[#EDEFF4]">Tensorlink</span>
                  <span className="text-xs text-gray-500 dark:text-[#8B93A7]">On-demand AI compute</span>
                </div>
                <span className="rounded-full border border-emerald-200 dark:border-emerald-400/20 bg-emerald-50 dark:bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 shrink-0">
                  Online
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex min-w-[220px] flex-1 items-center gap-3 rounded-xl border border-dashed border-gray-300 dark:border-white/10 px-4 py-3"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-white/20 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 dark:text-[#8B93A7]">More networks</span>
                <span className="text-xs italic text-gray-400 dark:text-[#5B6272]">Coming soon</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Analytics card */}
        <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6 min-h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#4FD8C4]" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
                  Telemetry
                </span>
              </div>
              <h1 className={`${styles.landingText} font-bold text-xl sm:text-2xl text-neutral-900 dark:text-[#EDEFF4]`}>
                Tensorlink Network Analytics
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8B93A7] mt-1">
                {activeMeta.description}
                {activeIsWeekly && ' · weekly averages'}
              </p>
            </div>

            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex w-full sm:w-[240px] items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-[#EDEFF4] hover:border-gray-300 dark:hover:border-white/20 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeMeta.accent }} />
                  {activeMeta.label}
                </span>
                <MdKeyboardArrowDown className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-20 mt-2 w-full sm:w-[240px] overflow-hidden rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12151c] shadow-lg"
                  >
                    {Object.entries(CHART_META).map(([key, meta]) => (
                      <button
                        key={key}
                        onClick={() => { setSelectedChart(key); setDropdownOpen(false); }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                          selectedChart === key
                            ? 'bg-gray-50 dark:bg-white/[0.06] font-medium text-gray-900 dark:text-[#EDEFF4]'
                            : 'text-gray-600 dark:text-[#9AA2B4] hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: meta.accent }} />
                        {meta.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {selectedChart === CHART_TYPES.GPU_BREAKDOWN ? (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-gray-400 dark:text-[#5B6272]">
                {deviceCurrent?.isStale && deviceCurrent.date
                  ? `Showing most recent benchmark data (${formatDailyLabel(deviceCurrent.date)})`
                  : 'Showing current network snapshot'}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-[#8B93A7]">Range</span>
              <div className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-0.5">
                {RANGE_OPTIONS.map((opt) => {
                  const isActive = selectedRangeDays === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedRangeDays(opt.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-gray-900 text-white dark:bg-white/10 dark:text-[#EDEFF4]'
                          : 'text-gray-500 dark:text-[#8B93A7] hover:text-gray-800 dark:hover:text-[#EDEFF4]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {preferWeekly && (
                <span className="text-xs text-gray-400 dark:text-[#5B6272]">
                  Showing weekly averages{!weeklyAwareTypes.has(selectedChart) ? ` (${activeMeta.label} stays daily)` : ''}
                </span>
              )}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChart}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="relative rounded-xl border bg-white dark:bg-white/[0.015] p-4 sm:p-6 h-[400px] sm:h-[460px] flex flex-col"
              style={{ borderColor: `${activeMeta.accent}40` }}
            >
              <div className="flex-1 min-h-0">{renderChart(selectedChart, 'full')}</div>

              {selectedChart === CHART_TYPES.GPU_BREAKDOWN && deviceCurrent && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-gray-100 dark:border-white/5 pt-3 text-xs text-gray-500 dark:text-[#8B93A7]">
                  {typeof deviceCurrent.total_benchmarked === 'number' && (
                    <span><span className="font-medium text-gray-800 dark:text-[#EDEFF4]">{deviceCurrent.total_benchmarked}</span> devices benchmarked</span>
                  )}
                  {typeof deviceCurrent.avg_tflops === 'number' && (
                    <span>Avg <span className="font-medium text-gray-800 dark:text-[#EDEFF4]">{deviceCurrent.avg_tflops.toFixed(1)}</span> TFLOPS</span>
                  )}
                  {typeof deviceCurrent.avg_bandwidth_gb_s === 'number' && (
                    <span>Avg <span className="font-medium text-gray-800 dark:text-[#EDEFF4]">{deviceCurrent.avg_bandwidth_gb_s.toFixed(1)}</span> GB/s bandwidth</span>
                  )}
                </div>
              )}

              {selectedChart === CHART_TYPES.GPU_BREAKDOWN && vendorBreakdown && (
                <div className="mt-3 border-t border-gray-100 dark:border-white/5 pt-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-[#8B93A7]">By vendor</span>
                  <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                    {vendorBreakdown.map((v) => (
                      <div key={v.label} style={{ width: `${(v.count / vendorTotal) * 100}%`, backgroundColor: v.color }} title={`${v.label}: ${v.count}`} />
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {vendorBreakdown.map((v) => (
                      <span key={v.label} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#8B93A7]">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: v.color }} />
                        {v.label} · {v.count} ({((v.count / vendorTotal) * 100).toFixed(0)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedChart === CHART_TYPES.GPU_TREND && gpuTrend?.hasOther && (
                <div className="mt-4 border-t border-gray-100 dark:border-white/5 pt-3 text-xs text-gray-500 dark:text-[#8B93A7]">
                  Showing the top {MAX_GPU_TREND_SERIES} of {gpuTrend.totalModels} GPU models seen in this range; the rest are grouped as "Other".
                </div>
              )}

              {!activeChart && (
                <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-[#5B6272]">
                  No data available
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Preview thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
            {Object.entries(CHART_META).map(([key, meta]) => {
              const isActive = selectedChart === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedChart(key)}
                  className={`group relative rounded-lg border p-3 text-left transition-all duration-200 ${
                    isActive ? 'shadow-sm' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                  style={isActive ? { borderColor: meta.accent, backgroundColor: `${meta.accent}0D` } : undefined}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${isActive ? 'text-gray-900 dark:text-[#EDEFF4]' : 'text-gray-500 dark:text-[#8B93A7]'}`}>
                      {meta.label}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.accent }} />
                  </div>
                  <div className="h-12 sm:h-14">
                    {charts[key] ? renderChart(key, 'thumb') : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-300 dark:text-[#3B4152]">—</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <ModelDemand modelDemandData={modelDemandData} loading={loading} error={error} />
      </motion.div>
    </div>
  );
};

export default NetworkDashboard;
