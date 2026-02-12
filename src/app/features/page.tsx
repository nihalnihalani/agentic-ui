"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
    name: "Error Boundary",
    description:
      "A React error boundary wrapping CopilotKit so the app degrades gracefully when no API key is configured or the runtime is unreachable. Components remain fully functional without AI.",
    usedIn: ["CopilotProvider"],
    snippet: `<CopilotErrorBoundary fallback={<>{children}</>}>
  <CopilotKit runtimeUrl="/api/copilotkit">
    {children}
  </CopilotKit>
</CopilotErrorBoundary>`,
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
  { label: "AI Components", value: "4" },
  { label: "CopilotKit Actions", value: "15+" },
  { label: "TypeScript", value: "100%" },
  { label: "Design System", value: "shadcn/ui" },
];

const architectureDiagram = `Browser                              Server
┌────────────────────────────┐  ┌────────────────────────┐
│  CopilotKit Provider       │  │  CopilotRuntime         │
│  ├─ CopilotSidebar         │──▶ ├─ OpenAIAdapter        │
│  ├─ CopilotPopup           │  │  ├─ AnthropicAdapter    │
│  └─ CopilotTextarea        │  │  ├─ GroqAdapter         │
│                            │  │  └─ GoogleGenAIAdapter  │
│  Hooks:                    │  │                        │
│  ├─ useCopilotReadable     │  │  /api/copilotkit        │
│  │   (component state → AI)│  └────────────────────────┘
│  ├─ useCopilotAction       │
│  │   (AI → component state)│
│  └─ useCopilotChatSuggestions
│                            │
│  Generative UI:            │
│  └─ render() on actions    │
│     (rich React in chat)   │
└────────────────────────────┘`;

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-border/40">
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
        <section className="border-y border-border/40 bg-muted/10">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <motion.div
              className="mb-8 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Architecture
              </h2>
              <p className="mt-2 text-muted-foreground">
                How CopilotKit connects the browser to the server.
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              custom={1}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-red-500/70" />
                <div className="size-2.5 rounded-full bg-yellow-500/70" />
                <div className="size-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  architecture.txt
                </span>
              </div>
              <pre className="overflow-x-auto whitespace-pre font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {architectureDiagram}
              </pre>
            </motion.div>
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
