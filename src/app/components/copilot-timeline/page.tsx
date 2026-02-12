"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotTimeline } from "@/components/registry/copilot-timeline";
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

const codeSnippet = `import { CopilotTimeline } from "@/components/registry/copilot-timeline";

// Uses built-in sample milestones:
<CopilotTimeline />

// With custom milestones:
<CopilotTimeline
  initialMilestones={[
    { id: "1", title: "Kickoff", description: "Project start", date: "Jan 15", status: "completed" },
    { id: "2", title: "Launch", description: "Go live", date: "Mar 1", status: "pending" },
  ]}
/>`;

function TimelineChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this timeline, such as 'Add a beta launch milestone', 'Mark the design phase as complete', or 'Move QA testing earlier'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotTimelinePage() {
  const component = getComponentBySlug("copilot-timeline")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <TimelineChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
              <CardDescription>
                A project timeline with AI management. Open the chat to add
                milestones, update statuses, or reorder the timeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CopilotTimeline />
            </CardContent>
          </Card>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Try these prompts
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Add a beta launch milestone before GA",
                "Mark the design phase as complete",
                "Move QA testing earlier",
                "Remove the alpha release",
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
                Add the timeline to your project with custom milestones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeSnippet} filename="usage.tsx" />
            </CardContent>
          </Card>

          <ComponentNav currentSlug="copilot-timeline" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help manage the project timeline. You can add new milestones, remove existing ones, update milestone statuses (pending, in-progress, completed), and reorder the timeline. When the user asks about project planning, use the available actions."
        labels={{
          title: "Timeline Assistant",
          initial: "I can help manage your project timeline. What would you like to update?",
        }}
      />
    </CopilotKit>
  );
}
