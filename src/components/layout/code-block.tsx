"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

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
          {filename && (
            <span className="ml-2 text-xs font-mono text-muted-foreground">{filename}</span>
          )}
        </div>
        <Button variant="ghost" size="icon-xs" onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
          {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
        </Button>
      </div>
      {/* Code */}
      <div className="overflow-x-auto bg-background/50 p-4">
        <pre className="text-sm leading-relaxed">
          <code className="font-mono text-muted-foreground">{code}</code>
        </pre>
      </div>
    </div>
  );
}
