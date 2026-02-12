"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotChart } from "@/components/registry/copilot-chart";
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
import { PromptCopyBlock } from "@/components/layout/prompt-copy-block";

const codeSnippet = `import { CopilotChart } from "@/components/registry/copilot-chart";

// Uses built-in sample data, or pass your own:
<CopilotChart />

// With custom data:
<CopilotChart
  data={[
    { month: "Jan", revenue: 28000, users: 820, growth: 5.2 },
    { month: "Feb", revenue: 32000, users: 910, growth: 8.1 },
    // ...
  ]}
/>`;

function ChartChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this chart, like changing chart type, filtering data range, or highlighting data points. Make suggestions specific to the SaaS revenue data shown.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotChartPage() {
  const component = getComponentBySlug("copilot-chart")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <ChartChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
              <CardDescription>
                Interactive chart with AI controls. Open the chat to change chart
                type, filter date ranges, or highlight specific data points.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CopilotChart />
            </CardContent>
          </Card>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Try these prompts
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Show revenue as a line chart",
                "Highlight months above $50k",
                "Filter to Q3 and Q4 only",
                "Add annotation to the peak month",
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

          {/* Copy Prompt for AI Tools */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Copy Prompt for AI Tools
            </h3>
            <PromptCopyBlock prompt={component.copyPrompt} />
          </div>

          {/* Usage */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>
                Drop the component into your project. It comes with sample data
                or you can pass your own.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeSnippet} filename="usage.tsx" />
            </CardContent>
          </Card>

          <ComponentNav currentSlug="copilot-chart" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help users explore and visualize data in the chart. You can change the chart type between bar and line, filter date ranges, highlight specific data points, and add annotations. When the user asks about trends or data, use the available actions to update the chart."
        labels={{
          title: "Chart Assistant",
          initial: "Ask me to change chart type, filter data, or highlight points.",
        }}
      />
    </CopilotKit>
  );
}
