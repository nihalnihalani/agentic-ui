"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotNotifications } from "@/components/registry/copilot-notifications";
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


const codeSnippet = `import { CopilotNotifications } from "@/components/registry/copilot-notifications";

// Uses built-in sample notifications:
<CopilotNotifications />

// With custom notifications:
<CopilotNotifications
  initialNotifications={[
    {
      id: "1",
      title: "Deploy Complete",
      message: "Production deploy succeeded",
      type: "alert",
      priority: "high",
      read: false,
      timestamp: "2 min ago",
    },
    // ...
  ]}
/>`;

function NotificationsChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with these notifications, such as 'Mark all low-priority as read', 'Summarize unread notifications', or 'Show only alerts'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotNotificationsPage() {
  const component = getComponentBySlug("copilot-notifications")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <NotificationsChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <div className="relative mb-8 rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Live Demo</CardTitle>
                <CardDescription>
                  A notification center with AI-powered triage. Open the chat to
                  mark as read, dismiss, categorize, prioritize, or summarize notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopilotNotifications />
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
                "Mark all low-priority as read",
                "Summarize unread notifications",
                "Dismiss all read notifications",
                "Prioritize the deployment alert as urgent",
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
                  Add the notification center to your project with custom notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={codeSnippet} filename="usage.tsx" />
              </CardContent>
            </Card>
          </div>

          <ComponentNav currentSlug="copilot-notifications" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help manage the notification center. You can mark notifications as read, dismiss them, categorize them, change their priority (low, medium, high, urgent), and summarize all unread notifications. When the user asks about notifications, use the available actions."
        labels={{
          title: "Notification Manager",
          initial: "I can help triage your notifications. What would you like to do?",
        }}
      />
    </CopilotKit>
  );
}
