"use client";

import { useState } from "react";
import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotTextEditor } from "@/components/registry/copilot-textarea";
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

import { cn } from "@/lib/utils";

const writingModes = [
  {
    id: "blog",
    label: "Blog Post",
    purpose: "writing a blog post about technology and AI",
    placeholder: "Start writing your blog post... AI will suggest completions as you type.",
  },
  {
    id: "email",
    label: "Email",
    purpose: "drafting a professional business email",
    placeholder: "Dear team, I wanted to reach out about...",
  },
  {
    id: "docs",
    label: "Code Docs",
    purpose: "writing technical documentation for a software project",
    placeholder: "## Overview\n\nThis module provides...",
  },
  {
    id: "marketing",
    label: "Marketing Copy",
    purpose: "writing persuasive marketing copy for a product landing page",
    placeholder: "Introducing the future of...",
  },
] as const;

const codeSnippet = `import { CopilotTextEditor } from "@/components/registry/copilot-textarea";

<CopilotTextEditor
  purpose="writing a blog post about AI technology"
  placeholder="Start writing..."
  onContentChange={(content) => console.log(content)}
/>`;

function TextareaChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this AI text editor, such as 'Write an intro paragraph about AI', 'Help me draft a professional email', or 'Clear the editor and start fresh'.",
    maxSuggestions: 3,
  });
  return null;
}

function TextareaDemo() {
  const [activeMode, setActiveMode] = useState<string>("blog");
  const mode = writingModes.find((m) => m.id === activeMode) ?? writingModes[0];

  return (
    <>
      {/* Writing Mode Selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {writingModes.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMode(m.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeMode === m.id
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <CopilotTextEditor
        purpose={mode.purpose}
        placeholder={mode.placeholder}
      />
    </>
  );
}

export default function CopilotTextareaPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <TextareaChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <ComponentPageHeader
            component={getComponentBySlug("copilot-textarea")!}
          />

          {/* Live Demo */}
          <div className="relative mb-8 rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
            <CardHeader>
              <CardTitle>Live Demo - AI Writing Assistant</CardTitle>
              <CardDescription>
                Choose a writing mode and start typing. AI will suggest
                completions as you write. Press{" "}
                <kbd className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">
                  Tab
                </kbd>{" "}
                to accept a suggestion, or use{" "}
                <kbd className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">
                  Cmd+K
                </kbd>{" "}
                to open the AI editing menu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextareaDemo />
            </CardContent>
          </Card>
          </div>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Try these prompts
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Write an intro paragraph about AI",
                "Draft a welcome email for new users",
                "Generate API documentation for a login endpoint",
                "Clear the editor",
              ].map((prompt) => (
                <span
                  key={prompt}
                  className="cursor-default rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  {prompt}
                </span>
              ))}
            </div>
          </div>

          {/* Code Snippet */}
          <div className="relative rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>
                  Add CopilotTextEditor to your project with a custom purpose for
                  AI-powered writing assistance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={codeSnippet} filename="usage.tsx" />
              </CardContent>
            </Card>
          </div>

          <ComponentNav currentSlug="copilot-textarea" />
        </div>

        <CopilotPopup
          instructions="You help users write content in this AI-powered text editor. You can set the text content, append text, or clear the editor. When a user asks you to write something, use the setTextContent action to put it in the editor. Be creative and helpful."
          labels={{
            title: "Writing Assistant",
            initial:
              "I can help you write! Tell me what you need and I'll draft it for you.",
          }}
        />
      </div>
    </CopilotKit>
  );
}
