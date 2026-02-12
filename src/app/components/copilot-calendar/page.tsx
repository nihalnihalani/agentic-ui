"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotCalendar } from "@/components/registry/copilot-calendar";
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


const codeSnippet = `import { CopilotCalendar } from "@/components/registry/copilot-calendar";

// Uses built-in sample events:
<CopilotCalendar />

// With custom events:
<CopilotCalendar
  initialEvents={[
    { id: "1", title: "Team Standup", day: "Mon", startHour: 9, endHour: 10, color: "violet" },
    { id: "2", title: "Lunch", day: "Tue", startHour: 12, endHour: 13, color: "emerald" },
  ]}
/>`;

function CalendarChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this calendar, such as 'Schedule a team meeting Monday at 2pm', 'Move the design review to Wednesday', or 'Find a free 1-hour slot'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotCalendarPage() {
  const component = getComponentBySlug("copilot-calendar")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CalendarChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <div className="relative mb-8 rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Live Demo</CardTitle>
                <CardDescription>
                  A weekly calendar with AI scheduling. Open the chat to add,
                  move, or remove events using natural language.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopilotCalendar />
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
                "Schedule a team standup at 9am Monday",
                "Move the design review to Thursday",
                "Find a free 1-hour slot this week",
                "Clear all Friday events",
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
          <div className="relative rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>
                  Drop the calendar into your project. Pass initial events or
                  start with a blank week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={codeSnippet} filename="usage.tsx" />
              </CardContent>
            </Card>
          </div>

          <ComponentNav currentSlug="copilot-calendar" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help users manage their weekly calendar. You can add new events, move events to different days/times, remove events, find free time slots, and clear entire days. When the user asks about scheduling, use the available actions."
        labels={{
          title: "Calendar Assistant",
          initial: "Tell me what to schedule and I'll add it to your calendar.",
        }}
      />
    </CopilotKit>
  );
}
