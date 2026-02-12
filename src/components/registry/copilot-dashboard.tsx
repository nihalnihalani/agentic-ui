"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  sparklineData: number[];
}

interface CopilotDashboardProps {
  metrics?: DashboardMetric[];
  className?: string;
}

const defaultMetrics: DashboardMetric[] = [
  {
    id: "mrr",
    title: "MRR",
    value: "$48.5k",
    change: "+12%",
    changeType: "positive",
    sparklineData: [30, 35, 32, 40, 38, 45, 42, 48],
  },
  {
    id: "churn-rate",
    title: "Churn Rate",
    value: "2.1%",
    change: "-0.3%",
    changeType: "positive",
    sparklineData: [3.2, 3.0, 2.8, 2.9, 2.5, 2.4, 2.2, 2.1],
  },
  {
    id: "nps-score",
    title: "NPS Score",
    value: "72",
    change: "+5",
    changeType: "positive",
    sparklineData: [58, 60, 62, 65, 64, 68, 70, 72],
  },
  {
    id: "active-users",
    title: "Active Users",
    value: "1,234",
    change: "+8%",
    changeType: "positive",
    sparklineData: [980, 1020, 1050, 1080, 1100, 1150, 1200, 1234],
  },
  {
    id: "revenue",
    title: "Revenue",
    value: "$142k",
    change: "+15%",
    changeType: "positive",
    sparklineData: [95, 100, 108, 115, 120, 128, 135, 142],
  },
  {
    id: "avg-ticket",
    title: "Avg Ticket",
    value: "$38",
    change: "+2%",
    changeType: "positive",
    sparklineData: [32, 33, 34, 35, 34, 36, 37, 38],
  },
];

type DateRange = "7d" | "30d" | "90d" | "1y";

function Sparkline({
  data,
  color,
  width = 80,
  height = 32,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CopilotDashboard({
  metrics: propMetrics,
  className,
}: CopilotDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetric[]>(
    propMetrics ?? defaultMetrics
  );
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [highlightedMetrics, setHighlightedMetrics] = useState<Set<string>>(
    new Set()
  );
  const [insight, setInsight] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const highlightTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const triggerHighlight = useCallback((metricId: string) => {
    const existing = highlightTimeouts.current.get(metricId);
    if (existing) clearTimeout(existing);

    setHighlightedMetrics((prev) => new Set(prev).add(metricId));
    const timeout = setTimeout(() => {
      setHighlightedMetrics((prev) => {
        const next = new Set(prev);
        next.delete(metricId);
        return next;
      });
      highlightTimeouts.current.delete(metricId);
    }, 1500);
    highlightTimeouts.current.set(metricId, timeout);
  }, []);

  const dateRangeOptions: DateRange[] = useMemo(
    () => ["7d", "30d", "90d", "1y"],
    []
  );

  // Expose dashboard state to AI
  useCopilotReadable({
    description:
      "Current metrics dashboard state including all KPI metrics, active date range, and any AI-generated insights",
    value: {
      dateRange,
      metrics: metrics.map((m) => ({
        id: m.id,
        title: m.title,
        value: m.value,
        change: m.change,
        changeType: m.changeType,
      })),
      highlightedMetrics: Array.from(highlightedMetrics),
      currentInsight: insight,
      comparisonResult,
    },
  });

  // AI action: filter by date range
  useCopilotAction({
    name: "filterByDateRange",
    description:
      "Change the dashboard date range filter. Available ranges: 7d, 30d, 90d, 1y",
    parameters: [
      {
        name: "range",
        type: "string",
        description:
          'The date range to filter by: "7d", "30d", "90d", or "1y"',
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>Changing date range...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Date range set to <strong>{args.range}</strong>
          </span>
        </div>
      );
    },
    handler: ({ range }) => {
      const validRanges: DateRange[] = ["7d", "30d", "90d", "1y"];
      if (!validRanges.includes(range as DateRange)) {
        return `Invalid range "${range}". Use one of: 7d, 30d, 90d, 1y`;
      }
      setDateRange(range as DateRange);
      return `Date range updated to ${range}`;
    },
  });

  // AI action: highlight a metric
  useCopilotAction({
    name: "highlightMetric",
    description:
      "Highlight a specific metric card to draw attention to it with a violet glow animation",
    parameters: [
      {
        name: "metricId",
        type: "string",
        description: `The ID of the metric to highlight. Available: ${metrics.map((m) => m.id).join(", ")}`,
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Highlighting metric...</span>
          </div>
        );
      }
      const metric = metrics.find((m) => m.id === args.metricId);
      return (
        <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <Sparkles className="h-4 w-4" />
          <span>
            Highlighted <strong>{metric?.title ?? args.metricId}</strong>
          </span>
        </div>
      );
    },
    handler: ({ metricId }) => {
      const metric = metrics.find((m) => m.id === metricId);
      if (!metric) return `Metric "${metricId}" not found`;
      triggerHighlight(metricId);
      return `Highlighted metric: ${metric.title}`;
    },
  });

  // AI action: compare metrics
  useCopilotAction({
    name: "compareMetrics",
    description:
      "Compare two metrics side by side and display a summary of their differences",
    parameters: [
      {
        name: "metricIdA",
        type: "string",
        description: `The ID of the first metric. Available: ${metrics.map((m) => m.id).join(", ")}`,
        required: true,
      },
      {
        name: "metricIdB",
        type: "string",
        description: `The ID of the second metric. Available: ${metrics.map((m) => m.id).join(", ")}`,
        required: true,
      },
      {
        name: "summary",
        type: "string",
        description: "A brief AI-generated comparison summary of the two metrics",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Comparing metrics...</span>
          </div>
        );
      }
      const metricA = metrics.find((m) => m.id === args.metricIdA);
      const metricB = metrics.find((m) => m.id === args.metricIdB);
      return (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>
              Compared <strong>{metricA?.title ?? args.metricIdA}</strong> vs{" "}
              <strong>{metricB?.title ?? args.metricIdB}</strong>
            </span>
          </div>
          {args.summary && (
            <p className="mt-1 text-xs text-amber-400/70">{args.summary}</p>
          )}
        </div>
      );
    },
    handler: ({ metricIdA, metricIdB, summary }) => {
      const metricA = metrics.find((m) => m.id === metricIdA);
      const metricB = metrics.find((m) => m.id === metricIdB);
      if (!metricA) return `Metric "${metricIdA}" not found`;
      if (!metricB) return `Metric "${metricIdB}" not found`;

      triggerHighlight(metricIdA);
      triggerHighlight(metricIdB);

      const result =
        summary ||
        `${metricA.title} (${metricA.value}, ${metricA.change}) vs ${metricB.title} (${metricB.value}, ${metricB.change})`;
      setComparisonResult(result);
      return result;
    },
  });

  // AI action: generate insight
  useCopilotAction({
    name: "generateInsight",
    description:
      "Generate and display an AI insight card below the metrics based on the current dashboard data",
    parameters: [
      {
        name: "insight",
        type: "string",
        description:
          "The AI-generated insight text to display on the dashboard",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Generating insight...</span>
          </div>
        );
      }
      return (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Insight added to dashboard</span>
          </div>
          {args.insight && (
            <p className="mt-1 text-xs text-emerald-400/70 truncate">
              {args.insight}
            </p>
          )}
        </div>
      );
    },
    handler: ({ insight: insightText }) => {
      setInsight(insightText);
      return `Insight displayed: ${insightText}`;
    },
  });

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Date range filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Metrics Dashboard
        </h2>
        <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-card/50 p-1">
          {dateRangeOptions.map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                dateRange === range
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const isHighlighted = highlightedMetrics.has(metric.id);
          return (
            <div
              key={metric.id}
              className={cn(
                "rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300",
                isHighlighted &&
                  "animate-[highlight-glow_1.5s_ease-in-out] border-violet-500/60 shadow-[0_0_16px_rgba(139,92,246,0.35)]"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {metric.value}
                  </p>
                </div>
                <Sparkline
                  data={metric.sparklineData}
                  color={
                    metric.changeType === "positive"
                      ? "rgb(34, 197, 94)"
                      : "rgb(239, 68, 68)"
                  }
                />
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {metric.changeType === "positive" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    metric.changeType === "positive"
                      ? "text-emerald-500"
                      : "text-red-500"
                  )}
                >
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs prev. period
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison result */}
      {comparisonResult && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Metric Comparison
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {comparisonResult}
              </p>
            </div>
            <button
              onClick={() => setComparisonResult(null)}
              className="ml-auto shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* AI Insight card */}
      {insight && (
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AI Insight</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {insight}
              </p>
            </div>
            <button
              onClick={() => setInsight(null)}
              className="ml-auto shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Screen reader live region */}
      <div aria-live="polite" className="sr-only">
        Dashboard showing {metrics.length} metrics for {dateRange} period
        {insight ? `. Insight: ${insight}` : ""}
      </div>
    </div>
  );
}
