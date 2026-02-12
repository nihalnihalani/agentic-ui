"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ComponentMeta } from "@/types";

interface ComponentPageHeaderProps {
  component: ComponentMeta;
}

export function ComponentPageHeader({ component }: ComponentPageHeaderProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(component.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mb-8">
      <Link
        href="/#components"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to registry
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-3xl font-bold tracking-tight">{component.name}</h1>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="size-3" />
          AI-Powered
        </Badge>
      </div>

      <p className="text-lg text-muted-foreground max-w-2xl mb-4">
        {component.description}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
          <code className="font-mono text-xs text-muted-foreground">
            {component.installCommand}
          </code>
          <Button variant="ghost" size="icon-xs" onClick={handleCopy}>
            {copied ? (
              <Check className="size-3 text-emerald-400" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
        </div>

        {component.hooks.map((hook) => (
          <Badge
            key={hook}
            variant="secondary"
            className="rounded-md font-mono text-xs"
          >
            {hook}
          </Badge>
        ))}
      </div>
    </div>
  );
}
