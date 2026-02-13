"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotResearchAgent } from "@/components/registry/copilot-research-agent";
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

const codeSnippet = `import { CopilotResearchAgent } from "@/components/registry/copilot-research-agent";

// Uses built-in sample research data:
<CopilotResearchAgent />

// With custom initial state:
<CopilotResearchAgent
  initialState={{
    topic: "Quantum Computing",
    status: "idle",
    depth: "deep",
    findings: [],
    synthesis: null,
  }}
/>`;

function ResearchChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 research topics the user might want to investigate, such as 'Research the latest trends in AI agents', 'Investigate best practices for React performance', or 'Research CopilotKit integration patterns'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function ResearchAgentPage() {
  const component = getComponentBySlug("research-agent")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <ResearchChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <div className="relative mb-8 rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Live Demo</CardTitle>
                <CardDescription>
                  An AI research agent that conducts multi-step research with
                  progress tracking. Open the chat to ask it to research any
                  topic.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopilotResearchAgent />
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
                "Research AI-powered UI patterns",
                "Investigate React Server Components",
                "Deep research on CopilotKit hooks",
                "Clear the current research",
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
                  Drop the research agent into your project. It renders with
                  sample data by default, or start with an empty state.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={codeSnippet} filename="usage.tsx" />
              </CardContent>
            </Card>
          </div>

          <ComponentNav currentSlug="research-agent" />
        </div>
      </div>

      <CopilotPopup
        instructions="You are a research assistant. When the user asks you to research a topic, use the conductResearch action. Generate relevant findings with titles, summaries, sources, and relevance levels. Provide a synthesis that ties all findings together. You can also highlight specific findings or clear the research."
        labels={{
          title: "Research Agent",
          initial:
            "Ask me to research any topic. I will search, analyze, and synthesize findings.",
        }}
      />
    </CopilotKit>
  );
}
