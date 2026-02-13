"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Sparkles,
  Eye,
  Zap,
  MessageSquare,
  PanelRight,
  MessageCircle,
  PenTool,
  Layers,
  Server,
  ShieldCheck,
  Search,
  ArrowRight,
  Github,
  ExternalLink,
  Monitor,
  ServerIcon,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { components } from "@/lib/components-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07 },
  }),
};

const features = [
  {
    icon: Eye,
    name: "useCopilotReadable",
    description:
      "Expose component state to the AI so it understands what the user sees. Every registry component and the discovery layer use this hook to feed live data into the LLM context.",
    usedIn: ["CopilotTable", "CopilotForm", "CopilotCanvas", "CopilotDiscovery"],
    snippet: `useCopilotReadable({
  description: "Current table data and filters",
  value: { rows: data, sort, filters },
});`,
  },
  {
    icon: Zap,
    name: "useCopilotAction",
    description:
      "Register typed actions that the AI can invoke on behalf of the user. 15+ actions across the registry handle sorting, filtering, form-filling, task management, and navigation.",
    usedIn: ["CopilotTable", "CopilotForm", "CopilotCanvas", "CopilotDiscovery"],
    snippet: `useCopilotAction({
  name: "sortTable",
  description: "Sort a column",
  parameters: [
    { name: "column", type: "string" },
    { name: "direction", type: "string" },
  ],
  handler: ({ column, direction }) => {
    setSortConfig({ key: column, dir: direction });
  },
});`,
  },
  {
    icon: MessageSquare,
    name: "useCopilotChatSuggestions",
    description:
      "Generate contextual suggestion chips that guide users toward useful actions. Each component page shows 3 tailored suggestions based on the current data.",
    usedIn: ["CopilotTable page", "CopilotForm page", "CopilotCanvas page"],
    snippet: `useCopilotChatSuggestions({
  instructions:
    "Suggest 3 actions for this data table...",
  maxSuggestions: 3,
});`,
  },
  {
    icon: PanelRight,
    name: "CopilotSidebar",
    description:
      "A slide-out sidebar chat used on the main registry page. Provides a persistent assistant that helps users discover and compare components.",
    usedIn: ["Homepage (CopilotProvider)"],
    snippet: `<CopilotSidebar
  labels={{
    title: "AgenticUI Assistant",
    initial: "Describe what you're building...",
  }}
  defaultOpen={false}
  clickOutsideToClose
>
  {children}
</CopilotSidebar>`,
  },
  {
    icon: MessageCircle,
    name: "CopilotPopup",
    description:
      "A floating popup chat attached to individual component demo pages. Each popup carries component-specific system instructions so the AI knows the available actions.",
    usedIn: ["CopilotTable page", "CopilotForm page", "CopilotCanvas page"],
    snippet: `<CopilotPopup
  instructions="You help users explore the data table..."
  labels={{
    title: "Table Assistant",
    initial: "Ask me to sort, filter, or highlight data.",
  }}
/>`,
  },
  {
    icon: PenTool,
    name: "CopilotTextarea",
    description:
      "An AI-enhanced textarea with inline autocompletions and text transformations. Integrates with CopilotKit's context to offer suggestions based on surrounding state.",
    usedIn: ["CopilotTextarea component"],
    snippet: `<CopilotTextarea
  placeholder="Start typing..."
  autosuggestionsConfig={{
    textareaPurpose: "A professional email",
    chatApiConfigs: {},
  }}
/>`,
  },
  {
    icon: Layers,
    name: "Generative UI",
    description:
      "Actions return rich React components inside the chat via render functions. Sort confirmations, form previews, and task cards appear directly in the conversation.",
    usedIn: ["CopilotTable actions", "CopilotForm actions", "CopilotCanvas actions"],
    snippet: `useCopilotAction({
  name: "sortTable",
  // ...parameters
  render: ({ status, result }) => (
    <div className="rounded-lg border p-3">
      {status === "complete"
        ? "Sorted by " + result
        : "Sorting..."}
    </div>
  ),
  handler: ({ column }) => { /* ... */ },
});`,
  },
  {
    icon: Server,
    name: "CopilotRuntime",
    description:
      "Server-side runtime with automatic adapter selection. Supports OpenAI, Anthropic, Groq, and Google Generative AI -- switch providers with a single env variable.",
    usedIn: ["/api/copilotkit route"],
    snippet: `const runtime = new CopilotRuntime();
const serviceAdapter = openaiKey
  ? new OpenAIAdapter()
  : new AnthropicAdapter();

const { handleRequest } =
  copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });`,
  },
  {
    icon: ShieldCheck,
    name: "Graceful Degradation",
    description:
      "CopilotKit is configured so the app degrades gracefully when no API key is present or the runtime is unreachable. All components remain fully functional without AI -- the copilot features simply become unavailable.",
    usedIn: ["CopilotProvider"],
    snippet: `<CopilotKit
  runtimeUrl="/api/copilotkit"
  showDevConsole={false}
>
  <CopilotSidebar defaultOpen={false}>
    {children}
  </CopilotSidebar>
</CopilotKit>`,
  },
  {
    icon: Search,
    name: "Component Discovery",
    description:
      "AI-powered search, navigation, and comparison of registry components. Uses useCopilotReadable to expose the catalog and useCopilotAction for search, view, and compare operations.",
    usedIn: ["CopilotDiscovery (homepage)"],
    snippet: `useCopilotAction({
  name: "searchComponents",
  description: "Search the component catalog",
  parameters: [
    { name: "query", type: "string" },
  ],
  handler: ({ query }) => {
    return components
      .filter((c) => c.name.includes(query))
      .map((c) => c.name + ": " + c.description);
  },
});`,
  },
];

const stats = [
  { label: "AI Components", value: `${components.length}` },
  { label: "CopilotKit Actions", value: "60+" },
  { label: "TypeScript", value: "100%" },
  { label: "Design System", value: "shadcn/ui" },
];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const columnReveal = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const columnRevealRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 },
  },
};

function DataFlowParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 size-1.5 rounded-full bg-violet-400/80"
          style={{ top: `${25 + i * 25}%` }}
          animate={{
            x: [-20, 20],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 2,
            delay: i * 0.6,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />
      ))}
      {[0, 1].map((i) => (
        <motion.div
          key={`return-${i}`}
          className="absolute left-1/2 size-1 rounded-full bg-cyan-400/60"
          style={{ top: `${35 + i * 25}%` }}
          animate={{
            x: [20, -20],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            delay: 1 + i * 0.8,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="relative">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(139,92,246,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="grid gap-4 md:grid-cols-[1fr_80px_1fr] md:gap-0">
        {/* Browser Column */}
        <motion.div
          className="relative rounded-2xl border border-border/40 bg-gradient-to-b from-violet-500/[0.03] to-transparent p-1"
          variants={columnReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <div className="relative rounded-xl bg-background/80 backdrop-blur-sm p-5">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
              <motion.div
                className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Monitor className="size-4 text-violet-400" />
              </motion.div>
              <div>
                <h3 className="font-mono text-sm font-semibold text-foreground">
                  Browser
                </h3>
                <p className="font-mono text-[10px] text-muted-foreground/50">
                  Client-side
                </p>
              </div>
              <motion.div
                className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 ring-1 ring-emerald-500/20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="size-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[9px] text-emerald-400">
                  CONNECTED
                </span>
              </motion.div>
            </div>

            {/* Provider Section */}
            <motion.div
              className="mb-3 rounded-lg border border-violet-500/15 bg-violet-500/[0.03] p-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <div className="size-1 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                <p className="font-mono text-[11px] font-semibold text-violet-400">
                  CopilotKit Provider
                </p>
              </div>
              <div className="space-y-1.5">
                {[
                  { name: "CopilotSidebar", icon: PanelRight },
                  { name: "CopilotPopup", icon: MessageCircle },
                  { name: "CopilotTextarea", icon: PenTool },
                ].map((item) => (
                  <motion.div
                    key={item.name}
                    className="group/item flex items-center gap-2.5 rounded-md border border-border/20 bg-background/60 px-2.5 py-2 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.04]"
                    variants={staggerItem}
                    whileHover={{ x: 4 }}
                  >
                    <item.icon className="size-3 text-violet-400/50 transition-colors group-hover/item:text-violet-400" />
                    <span className="font-mono text-xs text-muted-foreground transition-colors group-hover/item:text-foreground">
                      {item.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hooks Section */}
            <motion.div
              className="mb-3 rounded-lg border border-blue-500/15 bg-blue-500/[0.03] p-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <div className="size-1 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]" />
                <p className="font-mono text-[11px] font-semibold text-blue-400">
                  Hooks
                </p>
              </div>
              <div className="space-y-1.5">
                {[
                  {
                    name: "useCopilotReadable",
                    desc: "component state → AI",
                    icon: Eye,
                  },
                  {
                    name: "useCopilotAction",
                    desc: "AI → component state",
                    icon: Zap,
                  },
                  {
                    name: "useCopilotChatSuggestions",
                    desc: null,
                    icon: MessageSquare,
                  },
                ].map((hook) => (
                  <motion.div
                    key={hook.name}
                    className="group/item rounded-md border border-border/20 bg-background/60 px-2.5 py-2 transition-all hover:border-blue-500/30 hover:bg-blue-500/[0.04]"
                    variants={staggerItem}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <hook.icon className="size-3 text-blue-400/50 transition-colors group-hover/item:text-blue-400" />
                      <span className="font-mono text-xs text-muted-foreground transition-colors group-hover/item:text-foreground">
                        {hook.name}
                      </span>
                    </div>
                    {hook.desc && (
                      <div className="mt-1 ml-5.5 flex items-center gap-1.5">
                        <div className="h-px w-3 bg-blue-400/20" />
                        <p className="font-mono text-[10px] text-muted-foreground/40">
                          {hook.desc}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Generative UI Section */}
            <motion.div
              className="rounded-lg border border-cyan-500/15 bg-cyan-500/[0.03] p-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <div className="size-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                <p className="font-mono text-[11px] font-semibold text-cyan-400">
                  Generative UI
                </p>
              </div>
              <motion.div
                className="group/item rounded-md border border-border/20 bg-background/60 px-2.5 py-2 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/[0.04]"
                variants={staggerItem}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="size-3 text-cyan-400/50 transition-colors group-hover/item:text-cyan-400" />
                  <span className="font-mono text-xs text-muted-foreground transition-colors group-hover/item:text-foreground">
                    render() on actions
                  </span>
                </div>
                <div className="mt-1 ml-5.5 flex items-center gap-1.5">
                  <div className="h-px w-3 bg-cyan-400/20" />
                  <p className="font-mono text-[10px] text-muted-foreground/40">
                    rich React components in chat
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Connection Bridge */}
        <div className="hidden md:flex flex-col items-center justify-center relative">
          <DataFlowParticles />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="h-20 w-px bg-gradient-to-b from-transparent via-violet-400/30 to-violet-400/10" />

            <motion.div
              className="flex flex-col items-center gap-1"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-0.5">
                <motion.div
                  className="h-px w-3 bg-violet-400/60"
                  animate={{ width: [12, 16, 12] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="flex size-8 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  whileHover={{ scale: 1.2 }}
                >
                  <Wifi className="size-3.5 text-violet-400" />
                </motion.div>
                <motion.div
                  className="h-px w-3 bg-violet-400/60"
                  animate={{ width: [12, 16, 12] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <span className="font-mono text-[9px] font-medium tracking-wider text-violet-400/70">
                HTTP
              </span>
            </motion.div>

            <div className="h-20 w-px bg-gradient-to-b from-violet-400/10 via-violet-400/30 to-transparent" />
          </div>
        </div>

        {/* Mobile Connection */}
        <div className="flex md:hidden items-center justify-center py-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-violet-400/40" />
            <motion.div
              className="flex size-8 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wifi className="size-3.5 text-violet-400 rotate-90" />
            </motion.div>
            <span className="font-mono text-[9px] font-medium tracking-wider text-violet-400/70">
              HTTP
            </span>
            <div className="h-px w-10 bg-gradient-to-r from-violet-400/40 to-transparent" />
          </div>
        </div>

        {/* Server Column */}
        <motion.div
          className="relative rounded-2xl border border-border/40 bg-gradient-to-b from-emerald-500/[0.03] to-transparent p-1"
          variants={columnRevealRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <div className="relative rounded-xl bg-background/80 backdrop-blur-sm p-5">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
              <motion.div
                className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <ServerIcon className="size-4 text-emerald-400" />
              </motion.div>
              <div>
                <h3 className="font-mono text-sm font-semibold text-foreground">
                  Server
                </h3>
                <p className="font-mono text-[10px] text-muted-foreground/50">
                  Next.js API Route
                </p>
              </div>
              <motion.div
                className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 ring-1 ring-emerald-500/20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <div className="size-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[9px] text-emerald-400">
                  RUNNING
                </span>
              </motion.div>
            </div>

            {/* Runtime Section */}
            <motion.div
              className="mb-3 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.03] p-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <div className="size-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                <p className="font-mono text-[11px] font-semibold text-emerald-400">
                  CopilotRuntime
                </p>
              </div>
              <div className="space-y-1.5">
                {[
                  { name: "OpenAIAdapter", color: "text-emerald-400" },
                  { name: "AnthropicAdapter", color: "text-amber-400" },
                  { name: "GroqAdapter", color: "text-orange-400" },
                  { name: "GoogleGenAIAdapter", color: "text-blue-400" },
                ].map((adapter, i) => (
                  <motion.div
                    key={adapter.name}
                    className="group/item flex items-center gap-2.5 rounded-md border border-border/20 bg-background/60 px-2.5 py-2 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.04]"
                    variants={staggerItem}
                    whileHover={{ x: 4 }}
                  >
                    <motion.div
                      className={`size-1.5 rounded-full ${
                        i === 0
                          ? "bg-emerald-400"
                          : i === 1
                          ? "bg-amber-400"
                          : i === 2
                          ? "bg-orange-400"
                          : "bg-blue-400"
                      }`}
                      animate={{
                        boxShadow:
                          i === 0
                            ? [
                                "0 0 0px rgba(52,211,153,0)",
                                "0 0 8px rgba(52,211,153,0.6)",
                                "0 0 0px rgba(52,211,153,0)",
                              ]
                            : undefined,
                      }}
                      transition={
                        i === 0
                          ? { duration: 2, repeat: Infinity }
                          : undefined
                      }
                    />
                    <span className="font-mono text-xs text-muted-foreground transition-colors group-hover/item:text-foreground">
                      {adapter.name}
                    </span>
                    {i === 0 && (
                      <span className="ml-auto rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400 ring-1 ring-emerald-500/20">
                        ACTIVE
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Endpoint Section */}
            <motion.div
              className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] p-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <div className="size-1 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                <p className="font-mono text-[11px] font-semibold text-amber-400">
                  API Endpoint
                </p>
              </div>
              <motion.div
                className="group/item flex items-center gap-2.5 rounded-md border border-border/20 bg-background/60 px-2.5 py-2 transition-all hover:border-amber-500/30 hover:bg-amber-500/[0.04]"
                variants={staggerItem}
                whileHover={{ x: 4 }}
              >
                <div className="size-1.5 rounded-full bg-amber-400/60" />
                <span className="font-mono text-xs text-muted-foreground transition-colors group-hover/item:text-foreground">
                  /api/copilotkit
                </span>
                <span className="ml-auto font-mono text-[9px] text-muted-foreground/40">
                  POST
                </span>
              </motion.div>
            </motion.div>

            {/* Bottom spacer to match browser column height */}
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border/20 bg-muted/[0.03] px-3 py-2.5">
              <ShieldCheck className="size-3 text-muted-foreground/30" />
              <span className="font-mono text-[10px] text-muted-foreground/30">
                Error boundary fallback enabled
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header transparent />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative -mt-16 overflow-hidden border-b border-border/40">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
            <div className="absolute -top-20 left-1/4 size-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="absolute top-0 right-1/4 size-[300px] rounded-full bg-cyan-500/8 blur-[80px]" />
          </div>

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <Sparkles className="size-3 text-violet-400" />
                Built with CopilotKit
              </span>
            </motion.div>

            <motion.h1
              className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                Every CopilotKit Feature,
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                One Registry
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A comprehensive showcase of CopilotKit&apos;s capabilities -- from
              reactive state hooks and AI-driven actions to generative UI, multi-model
              runtime adapters, and graceful error handling. All in one project.
            </motion.p>
          </div>
        </section>

        {/* ── Feature Matrix ── */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Feature Matrix
            </h2>
            <p className="mt-2 text-muted-foreground">
              Every CopilotKit hook, component, and pattern used in this project.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.name}
                className="group rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-colors hover:border-violet-500/30 hover:bg-card/50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500/20">
                    <feature.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {feature.usedIn.map((comp) => (
                        <span
                          key={comp}
                          className="rounded-full border border-border/40 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-border/30 bg-background/50 p-3">
                  <pre className="overflow-x-auto text-xs leading-relaxed text-muted-foreground">
                    <code>{feature.snippet}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Architecture Diagram ── */}
        <section className="relative border-y border-border/40 bg-muted/10 overflow-hidden">
          {/* Background glow effects */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/4 size-[400px] -translate-y-1/2 rounded-full bg-violet-500/[0.04] blur-[100px]" />
            <div className="absolute top-1/2 right-1/4 size-[400px] -translate-y-1/2 rounded-full bg-emerald-500/[0.04] blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-5xl px-6 py-20">
            <motion.div
              className="mb-10 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0}
            >
              <motion.div
                className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Layers className="size-3 text-violet-400" />
                System Overview
              </motion.div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Architecture
              </h2>
              <p className="mt-2 text-muted-foreground">
                How CopilotKit connects the browser to the server.
              </p>
            </motion.div>

            <ArchitectureDiagram />
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="mx-auto max-w-4xl px-6 py-20">
          <motion.div
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl border border-border/50 bg-card/30 p-6 text-center backdrop-blur-sm"
                variants={fadeUp}
                custom={i}
              >
                <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <motion.h2
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0}
            >
              Ready to explore?
            </motion.h2>
            <motion.p
              className="mt-2 text-muted-foreground"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={1}
            >
              Browse the live components or check out the source code.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={2}
            >
              <Button asChild size="lg">
                <Link href="/#components">
                  View Components
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/">
                  Homepage
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="https://github.com/CopilotKit/copilotkit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="size-4" />
                  GitHub
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
