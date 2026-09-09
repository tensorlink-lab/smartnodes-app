import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from 'chart.js';
import { ModelDemand } from "..";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Line, Doughnut } from 'react-chartjs-2';
import styles from "../../style";

const formatCapacity = (bytes) => {
  if (bytes >= 1099511627776) { // 1 TB in bytes
    return (bytes / 1099511627776).toFixed(1) + ' TB';
  } else if (bytes >= 1073741824) { // 1 GB in bytes
    return (bytes / 1073741824).toFixed(1) + ' GB';
  } else if (bytes >= 1048576) { // 1 MB in bytes
    return (bytes / 1048576).toFixed(1) + ' MB';
  } else {
    return bytes.toFixed(0) + ' B';
  }
};

const formatDailyLabel = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

// Chart type identifiers + the metadata that drives the dropdown, the
// preview thumbnails, and the accent color used across all three.
const CHART_TYPES = {
  PARTICIPANTS: 'participants',
  JOBS: 'jobs',
  CAPACITY: 'capacity',
  GPU_BREAKDOWN: 'gpu_breakdown',
  GPU_TREND: 'gpu_trend',
};

// Fixed palette for GPU-model series so slice/line colors stay stable
// across re-renders/refreshes rather than being re-picked each time.
const GPU_PALETTE = [
  '#4FD8C4', '#A78BFA', '#60A5FA', '#F59E0B', '#F472B6',
  '#34D399', '#FB923C', '#818CF8', '#FBBF24', '#38BDF8',
];
const GPU_OTHER_COLOR = '#9CA3AF';

// Deterministic hash so the same GPU model name always lands on the same
// palette color, keeping the pie chart and the over-time chart in sync.
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
};
const colorForModel = (name) => GPU_PALETTE[hashString(name) % GPU_PALETTE.length];

const hexToRgba = (hex, alpha) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Classifies a raw GPU model string (e.g. "NVIDIA GeForce RTX 4090") into a
// vendor bucket. Order matters — NVIDIA is checked before AMD so "RTX"
// never collides with the AMD "RX ####" pattern, and vice versa.
const GPU_VENDORS = [
  { label: 'NVIDIA', color: '#76B900', match: /nvidia|geforce|quadro|tesla|titan|\brtx\b|\bgtx\b|\ba(?:100|800|40|30|16|10|6000|5000|4000|2000)\b|\bh(?:100|200)\b|\bl(?:4|40|40s)\b|\bv100\b/i },
  { label: 'AMD', color: '#ED1C24', match: /\bamd\b|radeon|instinct|\bmi\d{2,3}\b|\brx\s?\d{3,4}\b/i },
  { label: 'Apple Silicon', color: '#A2AAAD', match: /apple|\bm[1-4]\b(\s?(pro|max|ultra))?/i },
];
const GPU_VENDOR_OTHER = { label: 'Other', color: GPU_OTHER_COLOR };

const classifyGpuVendor = (modelName) => {
  const match = GPU_VENDORS.find((v) => v.match.test(modelName || ''));
  return match || GPU_VENDOR_OTHER;
};

// Groups a `{ "RTX 4090": 3, "M2 Max": 1, ... }` breakdown into vendor
// totals, e.g. `[{ label: 'NVIDIA', count: 3, color: '#76B900' }, ...]`,
// sorted largest-first.
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

// Range presets, capped at 180 days to match the API's `days` limit
// (Query(30, ge=1, le=180)). "6M" (180 days) is the longest range the
// endpoint supports, so it doubles as our "longer than half a year"
// threshold for switching to weekly aggregates below.
const RANGE_OPTIONS = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
  { label: '1Y', value: 365 },
];
const WEEKLY_THRESHOLD_DAYS = 180;

const CHART_META = {
  [CHART_TYPES.PARTICIPANTS]: {
    label: 'Network Participants',
    description: 'Workers and validators over time',
    accent: '#4FD8C4',
  },
  [CHART_TYPES.JOBS]: {
    label: 'Job Activity',
    description: 'Jobs completed per day',
    accent: '#A78BFA',
  },
  [CHART_TYPES.CAPACITY]: {
    label: 'GPU Capacity',
    description: 'Used vs. free compute',
    accent: '#60A5FA',
  },
  [CHART_TYPES.GPU_BREAKDOWN]: {
    label: 'GPU Breakdown',
    description: 'Benchmarked devices by model',
    accent: '#F59E0B',
  },
  [CHART_TYPES.GPU_TREND]: {
    label: 'GPU Trend',
    description: 'Model mix over time',
    accent: '#34D399',
  },
};

// Slices the last N entries out of a `{ labels, datasets }` daily block,
// keeping every category array aligned with the trimmed labels.
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

const buildLineData = (labels, series, { tension = 0.4 } = {}) => ({
  labels,
  datasets: series.map(({ label, data, color, bg }) => ({
    label,
    data,
    borderColor: color,
    backgroundColor: bg,
    fill: true,
    tension,
  })),
});

// Turns a `{ "RTX 4090": 3, "A100": 2, ... }` breakdown into doughnut-ready
// chart data, sorted so the largest slices lead. Colors are hashed from the
// model name so they line up with the same model's line in the trend chart.
const buildBreakdownDoughnutData = (breakdown) => {
  const entries = Object.entries(breakdown || {}).filter(([, count]) => count > 0);
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return {
    labels: entries.map(([model]) => model),
    datasets: [
      {
        data: entries.map(([, count]) => count),
        backgroundColor: entries.map(([model]) => colorForModel(model)),
        borderColor: 'transparent',
        hoverOffset: 6,
      },
    ],
  };
};

// Number of top GPU models that get their own series in the trend chart;
// anything beyond that gets folded into a catch-all "Other" series so the
// legend stays readable as more device types come online.
const MAX_GPU_TREND_SERIES = 6;

// Builds a stacked-area "composition over time" chart from
// `device.gpu_model_breakdown_by_day`, restricted to the last `days`
// entries in `device.labels`. Straight (non-curved) lines are used since
// these are whole device counts, not a continuous quantity.
const buildGpuModelTrendData = (device, days) => {
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

  const series = topModels.map((model) => {
    const color = colorForModel(model);
    return {
      label: model,
      data: labels.map((date) => (byDay[date] || {})[model] || 0),
      color,
      bg: hexToRgba(color, 0.15),
    };
  });

  if (otherModels.length) {
    series.push({
      label: 'Other',
      data: labels.map((date) => {
        const day = byDay[date] || {};
        return otherModels.reduce((sum, m) => sum + (day[m] || 0), 0);
      }),
      color: GPU_OTHER_COLOR,
      bg: hexToRgba(GPU_OTHER_COLOR, 0.15),
    });
  }

  return {
    chartData: buildLineData(labels.map(formatDailyLabel), series, { tension: 0 }),
    hasOther: otherModels.length > 0,
    totalModels: allModels.length,
  };
};

// `device.current` reflects only devices benchmarked *today* and is empty
// on most days in practice (benchmarking is sparse - only new/reconnecting
// devices get re-measured). So when it's empty, fall back to the most
// recent day in `gpu_model_breakdown_by_day` that actually has data, using
// the aligned index into `device.datasets` for that day's avg tflops/
// bandwidth/total benchmarked so the stats strip matches the breakdown shown.
const resolveDeviceSnapshot = (device) => {
  const current = device?.current ?? null;
  const hasCurrentBreakdown = !!(current?.by_gpu_model && Object.keys(current.by_gpu_model).length);
  if (hasCurrentBreakdown) {
    return { ...current, date: null, isStale: false };
  }

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

  // Nothing benchmarked in the whole window - surface whatever `current` was
  // (likely all zeros/empty) so downstream code still has a shape to read.
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
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [selectedChart, setSelectedChart] = useState(CHART_TYPES.PARTICIPANTS);
  const [selectedRangeDays, setSelectedRangeDays] = useState(90);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Close the dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // We fetch a single hardcoded 180-day window (with weekly aggregates)
  // once, and derive every range option from it client-side — no network
  // call happens when the range buttons are clicked.
  const dailySlice = sliceDaily(networkHistory?.daily, selectedRangeDays);
  const weekly = networkHistory?.weekly ?? null;
  // The API's weekly aggregates only cover the categories in `CATEGORIES`,
  // which doesn't include total/used capacity — so there's no weekly
  // series for the Capacity chart (or the GPU device data). Both always
  // fall back to the daily slice, even in "6M" mode.
  const preferWeekly = selectedRangeDays >= WEEKLY_THRESHOLD_DAYS && !!weekly;

  const getUserChartData = () => {
    if (preferWeekly && weekly?.datasets?.avg_workers && weekly?.datasets?.avg_validators) {
      return buildLineData(weekly.labels, [
        { label: 'Workers (weekly avg)', data: weekly.datasets.avg_workers, color: 'rgb(79, 216, 196)', bg: 'rgba(79, 216, 196, 0.1)' },
        { label: 'Validators (weekly avg)', data: weekly.datasets.avg_validators, color: 'rgb(167, 139, 250)', bg: 'rgba(167, 139, 250, 0.1)' },
      ]);
    }
    if (!dailySlice) return null;
    return buildLineData(dailySlice.labels.map(formatDailyLabel), [
      { label: 'Workers', data: dailySlice.datasets.workers, color: 'rgb(79, 216, 196)', bg: 'rgba(79, 216, 196, 0.1)' },
      { label: 'Validators', data: dailySlice.datasets.validators, color: 'rgb(167, 139, 250)', bg: 'rgba(167, 139, 250, 0.1)' },
    ]);
  };

  const getJobsChartData = () => {
    if (preferWeekly && weekly?.datasets?.avg_jobs) {
      return buildLineData(weekly.labels, [
        { label: 'Jobs (weekly avg)', data: weekly.datasets.avg_jobs, color: 'rgb(167, 139, 250)', bg: 'rgba(167, 139, 250, 0.1)' },
      ]);
    }
    if (!dailySlice) return null;
    return buildLineData(dailySlice.labels.map(formatDailyLabel), [
      { label: 'Jobs', data: dailySlice.datasets.jobs, color: 'rgb(167, 139, 250)', bg: 'rgba(167, 139, 250, 0.1)' },
    ]);
  };

  const getCapacityChartData = () => {
    if (!dailySlice?.datasets?.total_capacity || !dailySlice?.datasets?.used_capacity) return null;
    const freeCapacity = dailySlice.datasets.total_capacity.map(
      (total, i) => total - dailySlice.datasets.used_capacity[i]
    );
    return buildLineData(dailySlice.labels.map(formatDailyLabel), [
      { label: 'Used Capacity', data: dailySlice.datasets.used_capacity, color: 'rgb(96, 165, 250)', bg: 'rgba(96, 165, 250, 0.1)' },
      { label: 'Free Capacity', data: freeCapacity, color: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.1)' },
    ]);
  };

  // GPU breakdown is a current snapshot (not a time series), so it isn't
  // sliced by the selected date range. It prefers `device.current`, but
  // falls back to the most recently benchmarked day when today's snapshot
  // is empty (see resolveDeviceSnapshot above).
  const deviceCurrent = resolveDeviceSnapshot(networkHistory?.device);
  const gpuBreakdownData = buildBreakdownDoughnutData(deviceCurrent?.by_gpu_model);
  const getGpuBreakdownData = () => gpuBreakdownData;
  const vendorBreakdown = buildVendorBreakdown(deviceCurrent?.by_gpu_model);
  const vendorTotal = vendorBreakdown ? vendorBreakdown.reduce((sum, v) => sum + v.count, 0) : 0;

  // GPU trend has no weekly aggregate (same situation as Capacity), so it
  // always reads straight from the daily device breakdown for the selected
  // range, regardless of the weekly-averages toggle.
  const gpuTrendResult = buildGpuModelTrendData(networkHistory?.device, selectedRangeDays);
  const getGpuTrendData = () => gpuTrendResult?.chartData ?? null;

  const axisColor = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const legendColor = isDarkMode ? '#EDEFF4' : '#111827';

  const userChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 12,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 12 },
          color: legendColor,
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        display: true,
        stacked: true,
        grid: { display: true, color: gridColor },
        ticks: { display: true, color: axisColor, font: { size: 11 } },
      },
      y: {
        display: true,
        stacked: true,
        grid: { display: true, color: gridColor },
        ticks: { display: true, color: axisColor, font: { size: 11 } },
      },
    },
    elements: {
      point: { radius: 2, hoverRadius: 5 },
    },
    animation: { duration: 900, easing: 'easeInOutQuart' },
    interaction: { intersect: false, mode: 'index' },
  };

  const capacityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 12,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 12 },
          color: legendColor,
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            const bytes = context.parsed.y;
            if (bytes >= 1099511627776) {
              label += (bytes / 1099511627776).toFixed(2) + ' TB';
            } else if (bytes >= 1073741824) {
              label += (bytes / 1073741824).toFixed(2) + ' GB';
            } else {
              label += bytes.toFixed(2) + ' Bytes';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        stacked: true,
        grid: { display: true, color: gridColor },
        ticks: { display: true, color: axisColor, font: { size: 11 } },
      },
      y: {
        display: true,
        stacked: true,
        grid: { display: true, color: gridColor },
        ticks: {
          display: true,
          color: axisColor,
          font: { size: 11 },
          callback: function(value) {
            return formatCapacity(value);
          }
        },
      },
    },
    elements: {
      point: { radius: 2, hoverRadius: 5 },
    },
    animation: { duration: 900, easing: 'easeInOutQuart' },
    interaction: { intersect: false, mode: 'index' },
  };

  const gpuBreakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 12,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 12 },
          color: legendColor,
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum, v) => sum + v, 0);
            const pct = total ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${value} (${pct}%)`;
          },
        },
      },
    },
    animation: { duration: 900, easing: 'easeInOutQuart' },
  };

  const gpuTrendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 12,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 12 },
          color: legendColor,
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            return `${label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        stacked: true,
        grid: { display: true, color: gridColor },
        ticks: { display: true, color: axisColor, font: { size: 11 } },
      },
      y: {
        display: true,
        stacked: true,
        beginAtZero: true,
        grid: { display: true, color: gridColor },
        ticks: { display: true, color: axisColor, font: { size: 11 }, precision: 0 },
      },
    },
    elements: {
      point: { radius: 2, hoverRadius: 5 },
    },
    animation: { duration: 900, easing: 'easeInOutQuart' },
    interaction: { intersect: false, mode: 'index' },
  };

  const jobsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        display: true,
        grid: { display: true, color: gridColor },
        ticks: { display: true, color: axisColor, font: { size: 11 } },
      },
      y: {
        display: true,
        grid: { display: true, color: gridColor },
        ticks: { display: true, color: axisColor, font: { size: 11 } },
      },
    },
    elements: {
      point: { radius: 2, hoverRadius: 5 },
    },
    animation: { duration: 900, easing: 'easeInOutQuart' },
    interaction: { intersect: false, mode: 'index' },
  };

  // Minimal, axis-free variant used for the small preview thumbnails
  const buildSparklineOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      point: { radius: 0 },
      line: { borderWidth: 2 },
    },
    animation: { duration: 600 },
  });

  // Same idea, for the GPU breakdown doughnut thumbnail (no axes to hide,
  // just strip the legend/tooltip so it reads as a plain sparkline).
  const buildBreakdownSparklineOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: false },
    },
    animation: { duration: 600 },
  });

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

  const userChartData = getUserChartData();
  const capacityChartData = getCapacityChartData();
  const jobsChartData = getJobsChartData();
  const gpuBreakdownChartData = getGpuBreakdownData();
  const gpuTrendChartData = getGpuTrendData();

  const chartDataMap = {
    [CHART_TYPES.PARTICIPANTS]: { data: userChartData, options: userChartOptions, weeklyAware: true, type: 'line' },
    [CHART_TYPES.JOBS]: { data: jobsChartData, options: jobsChartOptions, weeklyAware: true, type: 'line' },
    [CHART_TYPES.CAPACITY]: { data: capacityChartData, options: capacityChartOptions, weeklyAware: false, type: 'line' },
    [CHART_TYPES.GPU_BREAKDOWN]: { data: gpuBreakdownChartData, options: gpuBreakdownOptions, weeklyAware: false, type: 'doughnut' },
    [CHART_TYPES.GPU_TREND]: { data: gpuTrendChartData, options: gpuTrendChartOptions, weeklyAware: false, type: 'line' },
  };

  const activeMeta = CHART_META[selectedChart];
  const activeIsWeekly = preferWeekly && chartDataMap[selectedChart].weeklyAware;

  // react-chartjs-2 sometimes fails to redraw in place when the number of
  // data points changes (e.g. switching ranges, or daily vs. weekly).
  // Deriving a key from the rendered data itself forces a clean remount
  // whenever it changes, which reliably fixes that.
  const dataVersion = chartDataMap[selectedChart].data?.labels?.length ?? 0;

  return (
    <div className="w-full mt-2 max-w-[1380px] space-y-2">
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0 }}
        className="mb-6 -mx-1 sm:-mx-3"
      >
        {/* Active Networks Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#4FD8C4]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
              Active Networks
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Tensorlink - Active Network */}
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

            {/* Coming Soon */}
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
          {/* Header + chart selector */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#4FD8C4]" />
                <span className=" text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
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

            {/* Dropdown selector */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex w-full sm:w-[240px] items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-[#EDEFF4] hover:border-gray-300 dark:hover:border-white/20 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: activeMeta.accent }}
                  />
                  {activeMeta.label}
                </span>
                <MdKeyboardArrowDown
                  className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
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

          {/* Date range selector — not applicable to the GPU breakdown,
              since that's a current snapshot rather than a time series. */}
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
              <span className=" text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-[#8B93A7]">
                Range
              </span>
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
                  Showing weekly averages{!chartDataMap[selectedChart].weeklyAware ? ` (${activeMeta.label} stays daily)` : ''}
                </span>
              )}
            </div>
          )}

          {/* Big featured chart */}
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
              {chartDataMap[selectedChart].data ? (
                <>
                  <div className="flex-1 min-h-0">
                    {chartDataMap[selectedChart].type === 'doughnut' ? (
                      <Doughnut
                        key={`${selectedChart}-${dataVersion}`}
                        data={chartDataMap[selectedChart].data}
                        options={chartDataMap[selectedChart].options}
                      />
                    ) : (
                      <Line
                        key={`${selectedChart}-${dataVersion}`}
                        data={chartDataMap[selectedChart].data}
                        options={chartDataMap[selectedChart].options}
                      />
                    )}
                  </div>
                  {selectedChart === CHART_TYPES.GPU_BREAKDOWN && deviceCurrent && (
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-gray-100 dark:border-white/5 pt-3 text-xs text-gray-500 dark:text-[#8B93A7]">
                      {typeof deviceCurrent.total_benchmarked === 'number' && (
                        <span>
                          <span className="font-medium text-gray-800 dark:text-[#EDEFF4]">{deviceCurrent.total_benchmarked}</span> devices benchmarked
                        </span>
                      )}
                      {typeof deviceCurrent.avg_tflops === 'number' && (
                        <span>
                          Avg <span className="font-medium text-gray-800 dark:text-[#EDEFF4]">{deviceCurrent.avg_tflops.toFixed(1)}</span> TFLOPS
                        </span>
                      )}
                      {typeof deviceCurrent.avg_bandwidth_gb_s === 'number' && (
                        <span>
                          Avg <span className="font-medium text-gray-800 dark:text-[#EDEFF4]">{deviceCurrent.avg_bandwidth_gb_s.toFixed(1)}</span> GB/s bandwidth
                        </span>
                      )}
                    </div>
                  )}
                  {selectedChart === CHART_TYPES.GPU_BREAKDOWN && vendorBreakdown && (
                    <div className="mt-3 border-t border-gray-100 dark:border-white/5 pt-3">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-[#8B93A7]">
                        By vendor
                      </span>
                      <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                        {vendorBreakdown.map((v) => (
                          <div
                            key={v.label}
                            style={{ width: `${(v.count / vendorTotal) * 100}%`, backgroundColor: v.color }}
                            title={`${v.label}: ${v.count}`}
                          />
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
                  {selectedChart === CHART_TYPES.GPU_TREND && gpuTrendResult?.hasOther && (
                    <div className="mt-4 border-t border-gray-100 dark:border-white/5 pt-3 text-xs text-gray-500 dark:text-[#8B93A7]">
                      Showing the top {MAX_GPU_TREND_SERIES} of {gpuTrendResult.totalModels} GPU models seen in this range; the rest are grouped as “Other”.
                    </div>
                  )}
                </>
              ) : (
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
              const chartInfo = chartDataMap[key];
              const thumbVersion = chartInfo.data?.labels?.length ?? 0;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedChart(key)}
                  className={`group relative rounded-lg border p-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'shadow-sm'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
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
                    {chartInfo.data ? (
                      chartInfo.type === 'doughnut' ? (
                        <Doughnut key={`${key}-${thumbVersion}`} data={chartInfo.data} options={buildBreakdownSparklineOptions()} />
                      ) : (
                        <Line key={`${key}-${thumbVersion}`} data={chartInfo.data} options={buildSparklineOptions()} />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-300 dark:text-[#3B4152]">
                        —
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <ModelDemand
          modelDemandData={modelDemandData}
          loading={loading}
          error={error}
        />
      </motion.div>
    </div>
  );
};

export default NetworkDashboard;
