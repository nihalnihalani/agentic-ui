"use client";

import { ArrowRight, Sparkles, Package, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopilotKitIcon } from "@/components/ui/copilotkit-icon";
import { motion } from "framer-motion";
import Link from "next/link";
import { components } from "@/lib/components-data";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute -top-20 left-1/4 size-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-0 right-1/4 size-[300px] rounded-full bg-cyan-500/8 blur-[80px]" />
      </div>

      {/* Animated grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="motion-reduce:transition-none"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <CopilotKitIcon className="size-3.5" />
              Built for CopilotKit
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl motion-reduce:transition-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              AI-Native Components
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              for CopilotKit
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg motion-reduce:transition-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Copy-paste React components with built-in AI superpowers. Tables
            that sort by voice, forms that fill by intent, canvases that respond
            to commands.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3 motion-reduce:transition-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild size="lg">
              <Link href="#components">
                Browse Components
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                href="https://github.com/CopilotKit/copilotkit"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground motion-reduce:transition-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="flex items-center gap-1.5">
              <Package className="size-3.5" /> {components.length} Components
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1.5">
              <CopilotKitIcon className="size-3.5" /> CopilotKit Powered
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1.5">
              <Globe className="size-3.5" /> 100% Open Source
            </span>
          </motion.div>

          {/* Code comparison */}
          <motion.div
            className="mt-12 mx-auto max-w-xl motion-reduce:transition-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <div className="rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-2.5 rounded-full bg-red-500/70" />
                <div className="size-2.5 rounded-full bg-yellow-500/70" />
                <div className="size-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  comparison.tsx
                </span>
              </div>
              <div className="space-y-2 text-left font-mono text-sm">
                <div className="rounded-lg bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground/60">{"// "}</span>
                  <span className="text-muted-foreground">Before</span>
                  <br />
                  <span className="text-blue-400">{"<"}</span>
                  <span className="text-emerald-400">Table</span>
                  <span className="text-violet-400">{" data"}</span>
                  <span className="text-muted-foreground">{"="}</span>
                  <span className="text-amber-400">{"{users}"}</span>
                  <span className="text-blue-400">{" />"}</span>
                </div>
                <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2">
                  <span className="text-muted-foreground/60">{"// "}</span>
                  <span className="text-violet-400">After -- with AI superpowers</span>
                  <br />
                  <span className="text-blue-400">{"<"}</span>
                  <span className="text-emerald-400">CopilotTable</span>
                  <span className="text-violet-400">{" data"}</span>
                  <span className="text-muted-foreground">{"="}</span>
                  <span className="text-amber-400">{"{users}"}</span>
                  <span className="text-blue-400">{" />"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
