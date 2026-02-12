"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Table, FormInput, Layout, MessageSquare, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ComponentMeta } from "@/types";
import { CopyPromptDropdown } from "@/components/layout/copy-prompt-dropdown";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const categoryConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  data: {
    label: "Data Display",
    color:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: <Table className="size-3" />,
  },
  forms: {
    label: "Forms & Input",
    color:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: <FormInput className="size-3" />,
  },
  canvas: {
    label: "Canvas & Board",
    color:
      "bg-violet-500/10 text-violet-400 border-violet-500/20",
    icon: <Layout className="size-3" />,
  },
  layout: {
    label: "Layout",
    color:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: <Layout className="size-3" />,
  },
  chat: {
    label: "Chat & Messaging",
    color:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    icon: <MessageSquare className="size-3" />,
  },
  productivity: {
    label: "Productivity",
    color:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
    icon: <CalendarDays className="size-3" />,
  },
};

function DataPreview() {
  return (
    <div className="flex items-end justify-center gap-2 px-6 pt-8 pb-4">
      <div className="h-10 w-5 rounded-sm bg-blue-400/30" />
      <div className="h-16 w-5 rounded-sm bg-blue-400/50" />
      <div className="h-12 w-5 rounded-sm bg-blue-400/40" />
      <div className="h-20 w-5 rounded-sm bg-blue-400/60" />
      <div className="h-8 w-5 rounded-sm bg-blue-400/25" />
      <div className="h-14 w-5 rounded-sm bg-blue-400/45" />
      <div className="h-18 w-5 rounded-sm bg-blue-400/55" />
    </div>
  );
}

function FormsPreview() {
  return (
    <div className="flex flex-col gap-2.5 px-6 pt-6 pb-4">
      <div className="h-2 w-12 rounded bg-emerald-400/30" />
      <div className="h-6 w-full rounded-md border border-emerald-400/20 bg-emerald-400/5" />
      <div className="h-2 w-16 rounded bg-emerald-400/30" />
      <div className="h-6 w-full rounded-md border border-emerald-400/20 bg-emerald-400/5" />
      <div className="h-2 w-10 rounded bg-emerald-400/30" />
      <div className="h-6 w-3/4 rounded-md border border-emerald-400/20 bg-emerald-400/5" />
    </div>
  );
}

function CanvasPreview() {
  return (
    <div className="flex items-start justify-center gap-3 px-6 pt-6 pb-4">
      <div className="flex w-16 flex-col gap-1.5 rounded-md border border-violet-400/20 bg-violet-400/5 p-2">
        <div className="h-1.5 w-8 rounded bg-violet-400/30" />
        <div className="h-4 w-full rounded-sm bg-violet-400/15" />
        <div className="h-4 w-full rounded-sm bg-violet-400/15" />
      </div>
      <div className="flex w-16 flex-col gap-1.5 rounded-md border border-violet-400/20 bg-violet-400/5 p-2">
        <div className="h-1.5 w-10 rounded bg-violet-400/30" />
        <div className="h-4 w-full rounded-sm bg-violet-400/15" />
      </div>
      <div className="flex w-16 flex-col gap-1.5 rounded-md border border-violet-400/20 bg-violet-400/5 p-2">
        <div className="h-1.5 w-6 rounded bg-violet-400/30" />
        <div className="h-4 w-full rounded-sm bg-violet-400/15" />
        <div className="h-4 w-full rounded-sm bg-violet-400/15" />
        <div className="h-4 w-full rounded-sm bg-violet-400/15" />
      </div>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="flex flex-col gap-2 px-6 pt-6 pb-4">
      <div className="flex justify-start">
        <div className="h-5 w-24 rounded-xl rounded-bl-sm bg-cyan-400/15 border border-cyan-400/20" />
      </div>
      <div className="flex justify-end">
        <div className="h-5 w-20 rounded-xl rounded-br-sm bg-cyan-400/30" />
      </div>
      <div className="flex justify-start">
        <div className="h-5 w-28 rounded-xl rounded-bl-sm bg-cyan-400/15 border border-cyan-400/20" />
      </div>
      <div className="flex justify-end">
        <div className="h-5 w-16 rounded-xl rounded-br-sm bg-cyan-400/30" />
      </div>
      <div className="flex justify-start">
        <div className="flex gap-1 px-3 py-1.5">
          <div className="size-1.5 rounded-full bg-cyan-400/40 animate-pulse" />
          <div className="size-1.5 rounded-full bg-cyan-400/40 animate-pulse [animation-delay:0.2s]" />
          <div className="size-1.5 rounded-full bg-cyan-400/40 animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}

function ProductivityPreview() {
  return (
    <div className="flex flex-col gap-2 px-6 pt-6 pb-4">
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full border-2 border-orange-400/50 bg-orange-400/20" />
        <div className="h-2 w-24 rounded bg-orange-400/30" />
        <div className="ml-auto h-2 w-8 rounded bg-orange-400/15" />
      </div>
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full border-2 border-orange-400/50 bg-orange-400/40" />
        <div className="h-2 w-20 rounded bg-orange-400/25" />
        <div className="ml-auto h-2 w-10 rounded bg-orange-400/15" />
      </div>
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full border-2 border-orange-400/30" />
        <div className="h-2 w-28 rounded bg-orange-400/20" />
        <div className="ml-auto h-2 w-6 rounded bg-orange-400/15" />
      </div>
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full border-2 border-orange-400/30" />
        <div className="h-2 w-16 rounded bg-orange-400/15" />
        <div className="ml-auto h-2 w-12 rounded bg-orange-400/15" />
      </div>
    </div>
  );
}

const previewMap: Record<string, React.FC> = {
  data: DataPreview,
  forms: FormsPreview,
  canvas: CanvasPreview,
  chat: ChatPreview,
  productivity: ProductivityPreview,
};

interface ComponentCardProps {
  component: ComponentMeta;
  index: number;
}

export function ComponentCard({ component, index }: ComponentCardProps) {
  const [copied, setCopied] = useState(false);
  const category = categoryConfig[component.category];
  const Preview = previewMap[component.category];

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(component.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/components/${component.slug}`} className="group block">
        <div className="relative rounded-xl p-px">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={3}
          />
          <motion.div
            className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-colors hover:border-border hover:bg-card/80"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Visual preview area */}
            {Preview && (
              <div className="h-[160px] overflow-hidden rounded-t-xl bg-muted/20">
                <Preview />
              </div>
            )}

            <div className="relative flex flex-1 flex-col p-6">
              {/* Category badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${category.color}`}
                >
                  {category.icon}
                  {category.label}
                </span>
              </div>

              {/* Name & description */}
              <h3 className="text-lg font-semibold tracking-tight">
                {component.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {component.description}
              </p>

              {/* Hooks */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {component.hooks.map((hook) => (
                  <Badge
                    key={hook}
                    variant="secondary"
                    className="rounded-md px-1.5 py-0 font-mono text-[10px]"
                  >
                    {hook}
                  </Badge>
                ))}
              </div>

              {/* Install command + AI prompt */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                  <code className="flex-1 truncate font-mono text-xs text-muted-foreground">
                    {component.installCommand}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopy}
                    className="shrink-0"
                    title="Copy install command"
                  >
                    {copied ? (
                      <Check className="size-3 text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-end">
                  <CopyPromptDropdown prompt={component.copyPrompt} size="sm" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
