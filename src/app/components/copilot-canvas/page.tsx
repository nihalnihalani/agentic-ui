"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import {
  CopilotCanvas,
  type Column,
} from "@/components/registry/copilot-canvas";
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


const demoColumns: Column[] = [
  {
    id: "todo",
    title: "Todo",
    items: [
      {
        id: "item-1",
        title: "Design landing page",
        description: "Create wireframes and high-fidelity mockups for the main landing page",
        priority: "high",
      },
      {
        id: "item-2",
        title: "Write API docs",
        description: "Document all REST endpoints with request/response examples",
        priority: "medium",
      },
      {
        id: "item-3",
        title: "Set up CI/CD",
        description: "Configure GitHub Actions for automated testing and deployment",
        priority: "low",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [
      {
        id: "item-4",
        title: "Build auth system",
        description: "Implement JWT-based authentication with OAuth2 providers",
        priority: "high",
      },
      {
        id: "item-5",
        title: "Create dashboard",
        description: "Build the main analytics dashboard with charts and metrics",
        priority: "medium",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [
      {
        id: "item-6",
        title: "Project setup",
        description: "Initialize repository, configure tooling and dependencies",
        priority: "low",
      },
      {
        id: "item-7",
        title: "Database schema",
        description: "Design and implement the core database schema with migrations",
        priority: "medium",
      },
    ],
  },
];

const codeSnippet = `import { CopilotCanvas, Column } from "@/components/registry/copilot-canvas";

const columns: Column[] = [
  {
    id: "todo",
    title: "Todo",
    items: [
      { id: "1", title: "Design landing page", priority: "high" },
      { id: "2", title: "Write API docs", priority: "medium" },
    ],
  },
  { id: "in-progress", title: "In Progress", items: [] },
  { id: "done", title: "Done", items: [] },
];

<CopilotCanvas
  initialColumns={columns}
  onUpdate={(cols) => console.log("Board updated:", cols)}
/>`;

function CanvasChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this project board, such as 'Add a high priority task', 'Move auth to Done', or 'Create a Backlog column'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotCanvasPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CanvasChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <ComponentPageHeader component={getComponentBySlug("copilot-canvas")!} />

          {/* Live demo */}
          <Card className="mb-8 border-border/50 bg-card/30">
            <CardHeader>
              <CardTitle className="text-lg">Live Demo</CardTitle>
              <CardDescription>
                Drag cards between columns or use the AI chat to manage the
                board. Try saying &quot;Move the auth task to Done&quot; or
                &quot;Add a new high priority task to Todo&quot;.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/30 bg-background/50 overflow-hidden">
                <CopilotCanvas
                  initialColumns={demoColumns}
                  onUpdate={(cols) =>
                    console.log("Board updated:", cols)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Try these prompts</h3>
            <div className="flex flex-wrap gap-2">
              {["Add a high priority task to Todo", "Move auth system to Done", "Create a Backlog column", "Remove completed tasks"].map((prompt) => (
                <span key={prompt} className="rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-default">
                  {prompt}
                </span>
              ))}
            </div>
          </div>

          {/* Code snippet */}
          <Card className="border-border/50 bg-card/30">
            <CardHeader>
              <CardTitle className="text-lg">Usage</CardTitle>
              <CardDescription>
                Drop the component into your project and provide initial column
                data. CopilotKit actions are registered automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeSnippet} filename="usage.tsx" />
            </CardContent>
          </Card>

          <ComponentNav currentSlug="copilot-canvas" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help manage this project board. You can add tasks, move them between columns (Todo, In Progress, Done), set priorities, and remove completed items. Be helpful and proactive in organizing the board."
        labels={{
          title: "Board Assistant",
          initial: "How can I help with your project board?",
        }}
      />
    </CopilotKit>
  );
}
