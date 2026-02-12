"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotChat } from "@/components/registry/copilot-chat";
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

const codeSnippet = `import { CopilotChat } from "@/components/registry/copilot-chat";

// Uses built-in sample messages, or pass your own:
<CopilotChat />

// With custom messages:
<CopilotChat
  initialMessages={[
    { id: "1", sender: "You", content: "Hello!", timestamp: "10:00 AM" },
    { id: "2", sender: "Alex", content: "Hi there!", timestamp: "10:01 AM" },
  ]}
/>`;

function ChatPageSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this chat interface, such as 'Summarize the conversation', 'Search for messages about deadlines', or 'Add a new message'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotChatPage() {
  const component = getComponentBySlug("copilot-chat")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <ChatPageSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
              <CardDescription>
                A custom chat interface with AI-powered message management. Use
                the CopilotPopup to search, summarize, or manage messages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CopilotChat />
            </CardContent>
          </Card>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Try these prompts
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Summarize this conversation",
                "Search for messages about deadlines",
                "Send a message about the launch date",
                "Clear chat history",
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
                Add CopilotChat to your project for a branded chat experience
                with AI message management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeSnippet} filename="usage.tsx" />
            </CardContent>
          </Card>

          <ComponentNav currentSlug="copilot-chat" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help manage the chat interface. You can send messages, search through message history, summarize conversations, and clear chat history. When the user asks about the conversation, use the available actions."
        labels={{
          title: "Chat Manager",
          initial: "I can help manage messages — search, summarize, or send new ones.",
        }}
      />
    </CopilotKit>
  );
}
