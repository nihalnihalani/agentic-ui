"use client";

import { useState, useMemo, useCallback } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";

export interface ChartDataPoint {
  month: string;
  revenue: number;
  users: number;
  growth: number;
}

interface Annotation {
  index: number;
  label: string;
}

const DEFAULT_DATA: ChartDataPoint[] = [
  { month: "Jan", revenue: 28400, users: 820, growth: 4 },
  { month: "Feb", revenue: 31200, users: 910, growth: 7 },
  { month: "Mar", revenue: 29800, users: 880, growth: -2 },
  { month: "Apr", revenue: 34500, users: 1050, growth: 12 },
  { month: "May", revenue: 38900, users: 1200, growth: 14 },
  { month: "Jun", revenue: 42100, users: 1380, growth: 8 },
  { month: "Jul", revenue: 39700, users: 1340, growth: -3 },
  { month: "Aug", revenue: 45600, users: 1520, growth: 11 },
  { month: "Sep", revenue: 49200, users: 1740, growth: 15 },
  { month: "Oct", revenue: 53800, users: 1950, growth: 18 },
  { month: "Nov", revenue: 56400, users: 2180, growth: 10 },
  { month: "Dec", revenue: 62100, users: 2400, growth: 16 },
];

interface CopilotChartProps {
  data?: ChartDataPoint[];
  className?: string;
}

export function CopilotChart({
  data = DEFAULT_DATA,
  className,
}: CopilotChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [dateRange, setDateRange] = useState<{ start: number; end: number }>({
    start: 0,
    end: data.length - 1,
  });
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const filteredData = useMemo(
    () => data.slice(dateRange.start, dateRange.end + 1),
    [data, dateRange]
  );

  const maxRevenue = useMemo(
    () => Math.max(...filteredData.map((d) => d.revenue)),
    [filteredData]
  );

  // Chart layout constants
  const svgWidth = 720;
  const svgHeight = 360;
  const paddingLeft = 70;
  const paddingRight = 20;
  const paddingTop = 40;
  const paddingBottom = 50;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Axis scale helpers
  const niceMax = useMemo(() => {
    const raw = maxRevenue * 1.1;
    const step = Math.pow(10, Math.floor(Math.log10(raw)));
    return Math.ceil(raw / step) * step;
  }, [maxRevenue]);

  const yTicks = useMemo(() => {
    const count = 5;
    return Array.from({ length: count + 1 }, (_, i) =>
      Math.round((niceMax / count) * i)
    );
  }, [niceMax]);

  const scaleY = useCallback(
    (value: number) => {
      return paddingTop + chartHeight - (value / niceMax) * chartHeight;
    },
    [niceMax, chartHeight]
  );

  const barWidth = useMemo(() => {
    const count = filteredData.length;
    if (count === 0) return 0;
    const gap = 8;
    return Math.max(12, (chartWidth - gap * (count - 1)) / count);
  }, [filteredData.length, chartWidth]);

  const getBarX = useCallback(
    (index: number) => {
      const count = filteredData.length;
      if (count === 0) return paddingLeft;
      const totalBarsWidth = barWidth * count;
      const totalGaps = chartWidth - totalBarsWidth;
      const gap = count > 1 ? totalGaps / (count - 1) : 0;
      return paddingLeft + index * (barWidth + gap);
    },
    [filteredData.length, barWidth, chartWidth]
  );

  const getPointX = useCallback(
    (index: number) => {
      return getBarX(index) + barWidth / 2;
    },
    [getBarX, barWidth]
  );

  // Build the SVG line path
  const linePath = useMemo(() => {
    if (filteredData.length === 0) return "";
    return filteredData
      .map((d, i) => {
        const x = getPointX(i);
        const y = scaleY(d.revenue);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [filteredData, getPointX, scaleY]);

  // Resolve the highlighted index relative to filteredData
  const resolvedHighlight = useMemo(() => {
    if (highlightedIndex === null) return null;
    const offsetIndex = highlightedIndex - dateRange.start;
    if (offsetIndex < 0 || offsetIndex >= filteredData.length) return null;
    return offsetIndex;
  }, [highlightedIndex, dateRange.start, filteredData.length]);

  // Resolve annotations relative to filteredData
  const resolvedAnnotations = useMemo(() => {
    return annotations
      .map((a) => ({
        ...a,
        offsetIndex: a.index - dateRange.start,
      }))
      .filter(
        (a) => a.offsetIndex >= 0 && a.offsetIndex < filteredData.length
      );
  }, [annotations, dateRange.start, filteredData.length]);

  const formatRevenue = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  // Expose chart state to AI
  useCopilotReadable({
    description:
      "Current chart state including data points, chart type, visible date range, highlighted point, and annotations",
    value: {
      chartType,
      totalDataPoints: data.length,
      visibleDataPoints: filteredData.length,
      dateRange: {
        startMonth: data[dateRange.start]?.month,
        endMonth: data[dateRange.end]?.month,
        startIndex: dateRange.start,
        endIndex: dateRange.end,
      },
      highlightedIndex,
      annotations,
      data: filteredData,
    },
  });

  // AI action: change chart type
  useCopilotAction({
    name: "changeChartType",
    description:
      'Switch the chart visualization between bar chart and line chart. Use "bar" or "line".',
    parameters: [
      {
        name: "type",
        type: "string",
        description: 'The chart type to switch to: "bar" or "line"',
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <svg
              className="h-4 w-4 animate-spin text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <span>Switching chart type...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {args.type === "bar" ? (
              <>
                <rect x="3" y="12" width="4" height="9" rx="1" />
                <rect x="10" y="7" width="4" height="14" rx="1" />
                <rect x="17" y="3" width="4" height="18" rx="1" />
              </>
            ) : (
              <polyline points="3 17 9 11 13 15 21 7" />
            )}
          </svg>
          <span>
            Switched to <strong>{args.type}</strong> chart
          </span>
        </div>
      );
    },
    handler: ({ type }) => {
      if (type !== "bar" && type !== "line") {
        return `Invalid chart type "${type}". Use "bar" or "line".`;
      }
      setChartType(type);
      return `Chart type changed to ${type}`;
    },
  });

  // AI action: filter date range
  useCopilotAction({
    name: "filterDateRange",
    description:
      "Filter the chart to show only data points within a specific index range (0-based). For example, startIndex=0 endIndex=5 shows Jan through Jun.",
    parameters: [
      {
        name: "startIndex",
        type: "number",
        description:
          "The start index (0-based, inclusive). 0 = Jan, 11 = Dec.",
        required: true,
      },
      {
        name: "endIndex",
        type: "number",
        description:
          "The end index (0-based, inclusive). 0 = Jan, 11 = Dec.",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <svg
              className="h-4 w-4 animate-pulse text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>Filtering date range...</span>
          </div>
        );
      }
      const startMonth = data[args.startIndex ?? 0]?.month ?? "?";
      const endMonth = data[args.endIndex ?? data.length - 1]?.month ?? "?";
      return (
        <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm text-purple-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>
            Showing <strong>{startMonth}</strong> to{" "}
            <strong>{endMonth}</strong>
          </span>
        </div>
      );
    },
    handler: ({ startIndex, endIndex }) => {
      const clampedStart = Math.max(0, Math.min(startIndex, data.length - 1));
      const clampedEnd = Math.max(
        clampedStart,
        Math.min(endIndex, data.length - 1)
      );
      setDateRange({ start: clampedStart, end: clampedEnd });
      return `Date range set to ${data[clampedStart]?.month} - ${data[clampedEnd]?.month}`;
    },
  });

  // AI action: highlight data point
  useCopilotAction({
    name: "highlightDataPoint",
    description:
      "Highlight a specific data point on the chart with a glow effect. Use the 0-based index of the data point in the full dataset.",
    parameters: [
      {
        name: "index",
        type: "number",
        description:
          "The 0-based index of the data point to highlight. 0 = Jan, 11 = Dec.",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <svg
              className="h-4 w-4 animate-pulse text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Highlighting data point...</span>
          </div>
        );
      }
      const month = data[args.index ?? 0]?.month ?? "?";
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>
            Highlighted <strong>{month}</strong>
          </span>
        </div>
      );
    },
    handler: ({ index }) => {
      if (index < 0 || index >= data.length) {
        return `Index ${index} is out of range (0-${data.length - 1})`;
      }
      setHighlightedIndex(index);
      return `Highlighted data point at index ${index} (${data[index]?.month})`;
    },
  });

  // AI action: add annotation
  useCopilotAction({
    name: "addAnnotation",
    description:
      "Add a text annotation above a specific data point on the chart. Use the 0-based index of the data point.",
    parameters: [
      {
        name: "index",
        type: "number",
        description:
          "The 0-based index of the data point to annotate. 0 = Jan, 11 = Dec.",
        required: true,
      },
      {
        name: "label",
        type: "string",
        description: "The annotation text to display above the data point",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <svg
              className="h-4 w-4 animate-pulse text-amber-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            <span>Adding annotation...</span>
          </div>
        );
      }
      const month = data[args.index ?? 0]?.month ?? "?";
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
          <span>
            Annotated <strong>{month}</strong>: &quot;{args.label}&quot;
          </span>
        </div>
      );
    },
    handler: ({ index, label }) => {
      if (index < 0 || index >= data.length) {
        return `Index ${index} is out of range (0-${data.length - 1})`;
      }
      setAnnotations((prev) => [...prev, { index, label }]);
      return `Annotation "${label}" added at index ${index} (${data[index]?.month})`;
    },
  });

  return (
    <div className={cn("w-full", className)}>
      {/* Header controls */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          SaaS Revenue Overview
        </h3>
        <div className="flex items-center gap-1 rounded-lg border border-border/50 p-0.5">
          <button
            onClick={() => setChartType("bar")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              chartType === "bar"
                ? "bg-blue-500/20 text-blue-400"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType("line")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              chartType === "line"
                ? "bg-violet-500/20 text-violet-400"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Line
          </button>
        </div>
      </div>

      {/* Active state badges */}
      {(dateRange.start !== 0 ||
        dateRange.end !== data.length - 1 ||
        highlightedIndex !== null ||
        annotations.length > 0) && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {(dateRange.start !== 0 || dateRange.end !== data.length - 1) && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-400">
              Range: {data[dateRange.start]?.month} -{" "}
              {data[dateRange.end]?.month}
              <button
                onClick={() =>
                  setDateRange({ start: 0, end: data.length - 1 })
                }
                className="ml-0.5 rounded hover:text-purple-300"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {highlightedIndex !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
              Highlight: {data[highlightedIndex]?.month}
              <button
                onClick={() => setHighlightedIndex(null)}
                className="ml-0.5 rounded hover:text-emerald-300"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {annotations.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
              {annotations.length} annotation(s)
              <button
                onClick={() => setAnnotations([])}
                className="ml-0.5 rounded hover:text-amber-300"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setDateRange({ start: 0, end: data.length - 1 });
              setHighlightedIndex(null);
              setAnnotations([]);
            }}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Chart */}
      <div className="overflow-hidden rounded-lg border border-border/50">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
          role="img"
          aria-label={`${chartType === "bar" ? "Bar" : "Line"} chart showing SaaS revenue from ${filteredData[0]?.month ?? ""} to ${filteredData[filteredData.length - 1]?.month ?? ""}`}
        >
          {/* SVG defs for glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="#10b981" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Y-axis grid lines and labels */}
          {yTicks.map((tick) => {
            const y = scaleY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize="11"
                >
                  {formatRevenue(tick)}
                </text>
              </g>
            );
          })}

          {/* X-axis baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="currentColor"
            strokeOpacity={0.15}
          />

          {/* Bar chart */}
          {chartType === "bar" &&
            filteredData.map((d, i) => {
              const x = getBarX(i);
              const barHeight = (d.revenue / niceMax) * chartHeight;
              const y = paddingTop + chartHeight - barHeight;
              const isHighlighted = resolvedHighlight === i;

              return (
                <g key={`bar-${i}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={3}
                    className={cn(
                      "transition-all duration-300",
                      isHighlighted ? "fill-emerald-400" : "fill-blue-500"
                    )}
                    fillOpacity={isHighlighted ? 0.9 : 0.7}
                    filter={isHighlighted ? "url(#glow)" : undefined}
                  />
                  {/* Hover area for tooltip-like effect */}
                  <rect
                    x={x}
                    y={paddingTop}
                    width={barWidth}
                    height={chartHeight}
                    fill="transparent"
                  />
                </g>
              );
            })}

          {/* Line chart */}
          {chartType === "line" && filteredData.length > 0 && (
            <>
              {/* Area fill under line */}
              <path
                d={`${linePath} L ${getPointX(filteredData.length - 1)} ${paddingTop + chartHeight} L ${getPointX(0)} ${paddingTop + chartHeight} Z`}
                fill="url(#lineGradient)"
                opacity={0.15}
              />
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Line path */}
              <path
                d={linePath}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {filteredData.map((d, i) => {
                const x = getPointX(i);
                const y = scaleY(d.revenue);
                const isHighlighted = resolvedHighlight === i;

                return (
                  <circle
                    key={`point-${i}`}
                    cx={x}
                    cy={y}
                    r={isHighlighted ? 6 : 4}
                    className={cn(
                      "transition-all duration-300",
                      isHighlighted ? "fill-emerald-400" : "fill-violet-400"
                    )}
                    stroke={isHighlighted ? "#10b981" : "#8b5cf6"}
                    strokeWidth="2"
                    filter={isHighlighted ? "url(#glow)" : undefined}
                  />
                );
              })}
            </>
          )}

          {/* X-axis month labels */}
          {filteredData.map((d, i) => {
            const x = getPointX(i);
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={paddingTop + chartHeight + 20}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="11"
              >
                {d.month}
              </text>
            );
          })}

          {/* Revenue values on top of bars / points */}
          {filteredData.map((d, i) => {
            const x = getPointX(i);
            const y =
              chartType === "bar"
                ? paddingTop + chartHeight - (d.revenue / niceMax) * chartHeight - 8
                : scaleY(d.revenue) - 12;
            const isHighlighted = resolvedHighlight === i;

            return (
              <text
                key={`value-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="10"
                className={cn(
                  isHighlighted
                    ? "fill-emerald-400 font-semibold"
                    : "fill-muted-foreground"
                )}
              >
                {formatRevenue(d.revenue)}
              </text>
            );
          })}

          {/* Annotations */}
          {resolvedAnnotations.map((ann, i) => {
            const x = getPointX(ann.offsetIndex);
            const dataPoint = filteredData[ann.offsetIndex];
            const baseY =
              chartType === "bar"
                ? paddingTop +
                  chartHeight -
                  (dataPoint.revenue / niceMax) * chartHeight -
                  22
                : scaleY(dataPoint.revenue) - 26;

            return (
              <g key={`ann-${i}`}>
                {/* Annotation line */}
                <line
                  x1={x}
                  y1={baseY + 10}
                  x2={x}
                  y2={baseY + 18}
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeOpacity={0.5}
                />
                {/* Annotation background */}
                <rect
                  x={x - 40}
                  y={baseY - 8}
                  width={80}
                  height={18}
                  rx={4}
                  fill="#f59e0b"
                  fillOpacity={0.15}
                  stroke="#f59e0b"
                  strokeOpacity={0.3}
                  strokeWidth="1"
                />
                {/* Annotation text */}
                <text
                  x={x}
                  y={baseY + 5}
                  textAnchor="middle"
                  fontSize="9"
                  className="fill-amber-400 font-medium"
                >
                  {ann.label.length > 14
                    ? ann.label.slice(0, 12) + "..."
                    : ann.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          Showing {filteredData.length} of {data.length} months
        </span>
        <div className="flex items-center gap-3">
          {chartType === "bar" && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500/70" />
              Revenue
            </span>
          )}
          {chartType === "line" && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded bg-violet-400" />
              Revenue
            </span>
          )}
          {resolvedHighlight !== null && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              Highlighted
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
