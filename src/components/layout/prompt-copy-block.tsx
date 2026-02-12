"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface PromptCopyBlockProps {
  prompt: string;
  className?: string;
}

function formatPrompt(prompt: string, tool: "cursor" | "claude" | "v0"): string {
  switch (tool) {
    case "cursor":
      return prompt;
    case "claude":
      return `Create this component in my project:\n\n${prompt}`;
    case "v0":
      return `Build a React component with the following specification:\n\n${prompt}`;
  }
}

function PromptContent({ prompt, tool }: { prompt: string; tool: "cursor" | "claude" | "v0" }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const formatted = formatPrompt(prompt, tool);
  const lines = formatted.split("\n");
  const shouldCollapse = lines.length > 6;
  const displayText = shouldCollapse && !expanded ? lines.slice(0, 6).join("\n") + "\n..." : formatted;

  function handleCopy() {
    try {
      navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div>
      <div className="overflow-x-auto bg-background/50 p-4">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap">
          <code className="font-mono text-muted-foreground">{displayText}</code>
        </pre>
      </div>
      <div className="flex items-center justify-between border-t border-border/30 px-4 py-2">
        <div className="flex items-center gap-2">
          {shouldCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {expanded ? (
                <>
                  <ChevronUp className="size-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="size-3" />
                  Show full prompt
                </>
              )}
            </Button>
          )}
        </div>
        <Button
          onClick={handleCopy}
          size="sm"
          className={cn(
            "h-7 gap-1.5 text-xs transition-all",
            copied
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              : ""
          )}
        >
          {copied ? (
            <>
              <Check className="size-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy Prompt
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function PromptCopyBlock({ prompt, className }: PromptCopyBlockProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/50", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/30 bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-500/50" />
            <div className="size-2.5 rounded-full bg-yellow-500/50" />
            <div className="size-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="ml-2 text-xs font-mono text-muted-foreground">
            ai-prompt
          </span>
        </div>
      </div>

      <Tabs defaultValue="cursor">
        <div className="border-b border-border/30 bg-muted/20 px-4">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger
              value="cursor"
              className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-violet-400 data-[state=active]:bg-transparent data-[state=active]:text-violet-400 data-[state=active]:shadow-none"
            >
              Cursor
            </TabsTrigger>
            <TabsTrigger
              value="claude"
              className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-violet-400 data-[state=active]:bg-transparent data-[state=active]:text-violet-400 data-[state=active]:shadow-none"
            >
              Claude Code
            </TabsTrigger>
            <TabsTrigger
              value="v0"
              className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-violet-400 data-[state=active]:bg-transparent data-[state=active]:text-violet-400 data-[state=active]:shadow-none"
            >
              v0
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="cursor" className="mt-0">
          <PromptContent prompt={prompt} tool="cursor" />
        </TabsContent>
        <TabsContent value="claude" className="mt-0">
          <PromptContent prompt={prompt} tool="claude" />
        </TabsContent>
        <TabsContent value="v0" className="mt-0">
          <PromptContent prompt={prompt} tool="v0" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
