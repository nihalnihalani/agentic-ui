"use client";

import { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotForm } from "@/components/registry/copilot-form";
import { CopilotTable } from "@/components/registry/copilot-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/layout/code-block";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ComponentType = "form" | "table" | "canvas" | "chart" | "chat" | "dashboard" | "calendar" | "editor" | "timeline" | "notifications" | "search";

interface PreviewState {
  type: ComponentType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  code: string;
}

export function GenerativePreview() {
  const [preview, setPreview] = useState<PreviewState | null>(null);

  useCopilotAction({
    name: "generateComponentPreview",
    description: "Generate a live preview of a component based on user requirements. Use this when the user asks to 'create a form' or 'show me a table'.",
    parameters: [
      {
        name: "type",
        type: "string",
        description: "The type of component to generate",
        enum: ["form", "table", "chart", "chat", "dashboard", "calendar", "editor", "timeline", "notifications", "search"],
        required: true,
      },
      {
        name: "config",
        type: "string",
        description: "The JSON configuration props for the component. For forms, include 'fields'. For tables, include 'columns' and 'sampleData'.",
        required: true,
      },
    ],
    handler: ({ type, config }) => {
      try {
        const props = JSON.parse(config);
        let code = "";
        
        if (type === "form") {
          code = `<CopilotForm
  fields={${JSON.stringify(props.fields, null, 2)}}
  onSubmit={(values) => console.log(values)}
/>`;
        } else if (type === "table") {
          code = `<CopilotTable
  data={${JSON.stringify(props.sampleData, null, 2)}}
  columns={${JSON.stringify(props.columns, null, 2)}}
/>`;
        }

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
                {preview.type === "form" && (
                  <CopilotForm
                    fields={preview.props.fields}
                    onSubmit={(vals) => console.log(vals)}
                  />
                )}
                {preview.type === "table" && (
                  <CopilotTable
                    data={preview.props.sampleData || []}
                    columns={preview.props.columns || []}
                  />
                )}
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
