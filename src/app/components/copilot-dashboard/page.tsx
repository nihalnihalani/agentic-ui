"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotDashboard } from "@/components/registry/copilot-dashboard";
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
      "Suggest 3 actions the user can take with this dashboard, such as 'Highlight declining metrics', 'Compare MRR vs churn', or 'Show last quarter only'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotDashboardPage() {
  const component = getComponentBySlug("copilot-dashboard")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <DashboardChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
              <CardDescription>
                A metrics dashboard with AI insights. Open the chat to highlight
                metrics, compare KPIs, filter by date range, or generate insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CopilotDashboard />
            </CardContent>
          </Card>

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
                "Show last quarter only",
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

          {/* Usage */}
          <Card className="border-border/50">
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

          <ComponentNav currentSlug="copilot-dashboard" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help users explore the metrics dashboard. You can highlight specific KPI cards, compare metrics, filter by date range, and generate AI-powered insights about the data. When the user asks about performance or trends, use the available actions."
        labels={{
          title: "Dashboard Assistant",
          initial: "Ask me about metrics, trends, or comparisons.",
        }}
      />
    </CopilotKit>
  );
}
