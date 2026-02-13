"use client";

import { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotForm } from "@/components/registry/copilot-form";
import { CopilotTable } from "@/components/registry/copilot-table";
import { CopilotDashboard } from "@/components/registry/copilot-dashboard";
import { CopilotCanvas } from "@/components/registry/copilot-canvas";
import { CopilotChart } from "@/components/registry/copilot-chart";
import { CopilotCalendar } from "@/components/registry/copilot-calendar";
import { CopilotSearch } from "@/components/registry/copilot-search";
import { CopilotChat } from "@/components/registry/copilot-chat";
import { CopilotEditor } from "@/components/registry/copilot-editor";
import { CopilotTimeline } from "@/components/registry/copilot-timeline";
import { CopilotNotifications } from "@/components/registry/copilot-notifications";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/layout/code-block";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ComponentType = "form" | "table" | "canvas" | "chart" | "chat" | "dashboard" | "calendar" | "editor" | "timeline" | "notifications" | "search";

interface PreviewState {
  type: ComponentType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  code: string;
}

function generateCode(type: string, props: Record<string, unknown>): string {
  switch (type) {
    case "form":
      return `<CopilotForm
  fields={${JSON.stringify(props.fields, null, 2)}}
  onSubmit={(values) => console.log(values)}
/>`;
    case "table":
      return `<CopilotTable
  data={${JSON.stringify(props.sampleData, null, 2)}}
  columns={${JSON.stringify(props.columns, null, 2)}}
/>`;
    case "dashboard":
      return props.metrics
        ? `<CopilotDashboard
  metrics={${JSON.stringify(props.metrics, null, 2)}}
/>`
        : `<CopilotDashboard />`;
    case "canvas":
      return `<CopilotCanvas
  initialColumns={${JSON.stringify(props.initialColumns, null, 2)}}
/>`;
    case "chart":
      return props.data
        ? `<CopilotChart
  data={${JSON.stringify(props.data, null, 2)}}
/>`
        : `<CopilotChart />`;
    case "calendar":
      return props.initialEvents
        ? `<CopilotCalendar
  initialEvents={${JSON.stringify(props.initialEvents, null, 2)}}
/>`
        : `<CopilotCalendar />`;
    case "search":
      return props.products
        ? `<CopilotSearch
  products={${JSON.stringify(props.products, null, 2)}}
/>`
        : `<CopilotSearch />`;
    case "chat":
      return `<CopilotChat />`;
    case "editor":
      return `<CopilotEditor />`;
    case "timeline":
      return props.initialMilestones
        ? `<CopilotTimeline
  initialMilestones={${JSON.stringify(props.initialMilestones, null, 2)}}
/>`
        : `<CopilotTimeline />`;
    case "notifications":
      return `<CopilotNotifications />`;
    default:
      return `{/* ${type} preview uses default props */}`;
  }
}

export function GenerativePreview() {
  const [preview, setPreview] = useState<PreviewState | null>(null);

  useCopilotAction({
    name: "generateComponentPreview",
    description:
      "Generate a live preview of a component based on user requirements. Use this when the user asks to create or show a component. Supported types: form, table, dashboard, canvas, chart, calendar, search, chat, editor, timeline, notifications. For dashboard/chart/calendar/search/chat/editor/timeline/notifications, config can be '{}' to use defaults.",
    parameters: [
      {
        name: "type",
        type: "string",
        description: "The type of component to generate",
        enum: ["form", "table", "chart", "dashboard", "canvas", "calendar", "search", "chat", "editor", "timeline", "notifications"],
        required: true,
      },
      {
        name: "config",
        type: "string",
        description:
          "JSON configuration props for the component. For forms: {fields: [...]}. For tables: {columns: [...], sampleData: [...]}. For canvas: {initialColumns: [...]}. For dashboard/chart/calendar/search: use '{}' to render with built-in sample data, or provide custom props.",
        required: true,
      },
    ],
    handler: ({ type, config }) => {
      try {
        const props = JSON.parse(config);
        const code = generateCode(type, props);

        setPreview({
          type: type as ComponentType,
          props,
          code,
        });
        return "Preview generated successfully.";
      } catch {
        return "Failed to parse component configuration.";
      }
    },
  });

  if (!preview) return null;

  const renderPreview = () => {
    switch (preview.type) {
      case "form":
        return (
          <CopilotForm
            fields={preview.props.fields}
            onSubmit={(vals) => console.log(vals)}
          />
        );
      case "table":
        return (
          <CopilotTable
            data={preview.props.sampleData || []}
            columns={preview.props.columns || []}
          />
        );
      case "dashboard":
        return (
          <CopilotDashboard
            metrics={preview.props.metrics}
          />
        );
      case "canvas":
        return (
          <CopilotCanvas
            initialColumns={preview.props.initialColumns || [
              { id: "todo", title: "To Do", items: [] },
              { id: "in-progress", title: "In Progress", items: [] },
              { id: "done", title: "Done", items: [] },
            ]}
          />
        );
      case "chart":
        return (
          <CopilotChart
            data={preview.props.data}
          />
        );
      case "calendar":
        return (
          <CopilotCalendar
            initialEvents={preview.props.initialEvents}
          />
        );
      case "search":
        return (
          <CopilotSearch
            products={preview.props.products}
          />
        );
      case "chat":
        return <CopilotChat />;
      case "editor":
        return <CopilotEditor />;
      case "timeline":
        return (
          <CopilotTimeline
            initialMilestones={preview.props.initialMilestones}
          />
        );
      case "notifications":
        return <CopilotNotifications />;
      default:
        return (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <AlertCircle className="size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">
              Preview not available for &quot;{preview.type}&quot;
            </p>
            <p className="text-xs text-muted-foreground/60">
              Check the React Code tab for usage instructions.
            </p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        className="mb-12"
      >
        <Card className="border-2 border-emerald-500/20 bg-muted/10 shadow-lg">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl text-emerald-500">
                <Sparkles className="size-5" />
                AI Generated Preview
              </CardTitle>
              <CardDescription>
                Live preview based on your conversation.
              </CardDescription>
            </div>
            <button
              onClick={() => setPreview(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Live Preview</TabsTrigger>
                <TabsTrigger value="code">React Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="rounded-lg border bg-background p-6 shadow-sm">
                {renderPreview()}
              </TabsContent>
              <TabsContent value="code">
                <CodeBlock code={preview.code} filename={`generated-${preview.type}.tsx`} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
