"use client";

import { useState, useCallback } from "react";
import { CopilotKit, useCopilotChatSuggestions, useCopilotAction } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotDashboard, DashboardMetric } from "@/components/registry/copilot-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComponentPageHeader } from "@/components/layout/component-page-header";
import { getComponentBySlug } from "@/lib/components-data";
import { CodeBlock } from "@/components/layout/code-block";
import { ComponentNav } from "@/components/layout/component-nav";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import { Loader2, RefreshCw, CheckCircle } from "lucide-react";


const codeSnippet = `import { CopilotDashboard } from "@/components/registry/copilot-dashboard";

// Uses built-in sample metrics:
<CopilotDashboard />

// With custom metrics:
<CopilotDashboard
  metrics={[
    {
      id: "mrr",
      title: "Monthly Revenue",
      value: "$48.5k",
      change: "+12%",
      changeType: "positive",
      sparklineData: [30, 35, 32, 40, 38, 45, 42, 48],
    },
    // ...
  ]}
/>`;

function DashboardChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this dashboard, such as 'Highlight declining metrics', 'Compare MRR vs churn', 'Show last quarter only', or 'Refresh live data'.",
    maxSuggestions: 3,
  });
  return null;
}

function DashboardDemo() {
  const [dataSource, setDataSource] = useState<"mock" | "live">("mock");
  const [liveMetrics, setLiveMetrics] = useState<DashboardMetric[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/metrics?range=30d");
      const data: DashboardMetric[] = await res.json();
      setLiveMetrics(data);
      setDataSource("live");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // AI action: refresh live metrics
  useCopilotAction({
    name: "refreshMetrics",
    description:
      "Refresh the dashboard by fetching live metrics data from the API. Switches to live data mode automatically.",
    parameters: [],
    render: ({ status }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Fetching live metrics...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>Live metrics refreshed</span>
        </div>
      );
    },
    handler: async () => {
      await fetchMetrics();
      return "Live metrics refreshed successfully";
    },
  });

  return (
    <>
      {/* Live Demo */}
      <div className="relative mb-8 rounded-xl">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
        <Card className="relative border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Demo</CardTitle>
                <CardDescription>
                  A metrics dashboard with AI insights. Open the chat to highlight
                  metrics, compare KPIs, filter by date range, or generate insights.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {/* Data source toggle */}
                <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
                  <button
                    onClick={() => setDataSource("mock")}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      dataSource === "mock"
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Mock Data
                  </button>
                  <button
                    onClick={async () => {
                      if (!liveMetrics) {
                        await fetchMetrics();
                      } else {
                        setDataSource("live");
                      }
                    }}
                    disabled={isLoading}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      dataSource === "live"
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Live Data"
                    )}
                  </button>
                </div>
                {dataSource === "live" && (
                  <button
                    onClick={fetchMetrics}
                    disabled={isLoading}
                    className="rounded-md border border-border/50 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    title="Refresh live data"
                  >
                    <RefreshCw
                      className={cn(
                        "h-3.5 w-3.5",
                        isLoading && "animate-spin"
                      )}
                    />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CopilotDashboard
              metrics={dataSource === "live" && liveMetrics ? liveMetrics : undefined}
            />
          </CardContent>
        </Card>
      </div>

      {/* Try these prompts */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Try these prompts
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Compare MRR vs churn rate",
            "Highlight metrics that are declining",
            "Generate an insight for revenue",
            "Refresh live data",
          ].map((prompt) => (
            <span
              key={prompt}
              className="rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-default"
            >
              {prompt}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default function CopilotDashboardPage() {
  const component = getComponentBySlug("copilot-dashboard")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <DashboardChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ComponentPageHeader component={component} />

          <DashboardDemo />

          {/* Usage */}
          <div className="relative rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>
                  Drop the dashboard into your project. Pass custom metrics or use
                  the built-in sample data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={codeSnippet} filename="usage.tsx" />
              </CardContent>
            </Card>
          </div>

          <ComponentNav currentSlug="copilot-dashboard" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help users explore the metrics dashboard. You can highlight specific KPI cards, compare metrics, filter by date range, generate AI-powered insights about the data, and refresh live metrics. When the user asks about performance or trends, use the available actions."
        labels={{
          title: "Dashboard Assistant",
          initial: "Ask me about metrics, trends, or comparisons.",
        }}
      />
    </CopilotKit>
  );
}
