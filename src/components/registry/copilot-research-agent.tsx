"use client";

import { useState, useCallback, useRef } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";
import {
  Search,
  FileText,
  Brain,
  CheckCircle,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export interface ResearchFinding {
  id: string;
  title: string;
  summary: string;
  source: string;
  relevance: "high" | "medium" | "low";
}

export interface ResearchState {
  topic: string;
  status: "idle" | "searching" | "analyzing" | "synthesizing" | "complete";
  depth: "quick" | "standard" | "deep";
  findings: ResearchFinding[];
  synthesis: string | null;
}

interface CopilotResearchAgentProps {
  initialState?: Partial<ResearchState>;
  className?: string;
}

const PIPELINE_STEPS = [
  { key: "searching", label: "Searching Sources", icon: Search },
  { key: "analyzing", label: "Analyzing Data", icon: FileText },
  { key: "synthesizing", label: "Synthesizing Results", icon: Brain },
  { key: "complete", label: "Research Complete", icon: CheckCircle },
] as const;

const relevanceColors: Record<string, string> = {
  high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const defaultFindings: ResearchFinding[] = [
  {
    id: "f1",
    title: "LLM-Powered UI Components",
    summary:
      "Recent advances in large language models have enabled a new class of UI components that can understand user intent and manipulate interface state through natural language, reducing the gap between user goals and interface actions.",
    source: "AI Research Review, 2025",
    relevance: "high",
  },
  {
    id: "f2",
    title: "Agentic Design Patterns",
    summary:
      "The agentic UI pattern involves exposing component state via readable hooks and defining actions the AI can invoke. This bidirectional communication allows AI to both understand and modify the interface.",
    source: "Frontend Architecture Journal",
    relevance: "high",
  },
  {
    id: "f3",
    title: "User Trust in AI-Driven Interfaces",
    summary:
      "Studies show that inline progress feedback (spinners, confirmation badges) during AI actions significantly increases user trust and perceived reliability of AI-powered interfaces.",
    source: "HCI Conference Proceedings",
    relevance: "medium",
  },
  {
    id: "f4",
    title: "Render Callbacks for Chat Integration",
    summary:
      "Using render callbacks in copilot actions enables rich, contextual feedback within chat interfaces, creating a more integrated experience than simple text responses.",
    source: "CopilotKit Documentation",
    relevance: "medium",
  },
  {
    id: "f5",
    title: "Component Registry Architecture",
    summary:
      "A registry-based approach to distributing AI-enhanced components allows developers to install individual components via CLI, similar to the shadcn/ui pattern, promoting modularity.",
    source: "Open Source Weekly",
    relevance: "low",
  },
];

const defaultSynthesis =
  "AI-powered UI components represent a significant shift in frontend development. By combining readable state hooks with action-based AI integration, developers can create interfaces that understand and respond to natural language. Key success factors include inline progress feedback for user trust, render callbacks for rich chat integration, and a modular registry architecture for distribution.";

const defaultState: ResearchState = {
  topic: "AI-Powered UI Components",
  status: "complete",
  depth: "standard",
  findings: defaultFindings,
  synthesis: defaultSynthesis,
};

function getStepIndex(status: ResearchState["status"]): number {
  const map: Record<string, number> = {
    idle: -1,
    searching: 0,
    analyzing: 1,
    synthesizing: 2,
    complete: 3,
  };
  return map[status] ?? -1;
}

export function CopilotResearchAgent({
  initialState,
  className,
}: CopilotResearchAgentProps) {
  const [research, setResearch] = useState<ResearchState>({
    ...defaultState,
    ...initialState,
  });
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const highlightTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const triggerHighlight = useCallback((id: string) => {
    const existing = highlightTimeouts.current.get(id);
    if (existing) clearTimeout(existing);

    setHighlightedIds((prev) => new Set(prev).add(id));
    const timeout = setTimeout(() => {
      setHighlightedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      highlightTimeouts.current.delete(id);
    }, 1500);
    highlightTimeouts.current.set(id, timeout);
  }, []);

  // Expose research state to AI
  useCopilotReadable({
    description:
      "Current research agent state including topic, status, depth, findings, and synthesis",
    value: {
      topic: research.topic,
      status: research.status,
      depth: research.depth,
      findingsCount: research.findings.length,
      findings: research.findings.map((f) => ({
        id: f.id,
        title: f.title,
        relevance: f.relevance,
        source: f.source,
      })),
      synthesis: research.synthesis,
    },
  });

  // Action: Conduct research (simulated multi-step process)
  useCopilotAction({
    name: "conductResearch",
    description:
      "Conduct a multi-step research process on a given topic. Simulates searching, analyzing, and synthesizing findings. Provide the topic and depth (quick, standard, or deep).",
    parameters: [
      {
        name: "topic",
        type: "string",
        description: "The research topic to investigate",
        required: true,
      },
      {
        name: "depth",
        type: "string",
        description:
          'Research depth: "quick" (3 findings), "standard" (5 findings), or "deep" (8 findings)',
      },
      {
        name: "findings",
        type: "string",
        description:
          "JSON array of findings. Each finding: {title, summary, source, relevance}. Generate findings relevant to the topic.",
        required: true,
      },
      {
        name: "synthesis",
        type: "string",
        description:
          "A synthesized summary paragraph combining all findings into a cohesive conclusion.",
        required: true,
      },
    ],
    render: ({ status }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Conducting research...</span>
          </div>
        );
      }
      return (
        <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Research complete</span>
          </div>
        </div>
      );
    },
    handler: async ({ topic, depth, findings: findingsJson, synthesis }) => {
      const researchDepth = (depth as ResearchState["depth"]) || "standard";

      // Step 1: Searching
      setResearch((prev) => ({
        ...prev,
        topic,
        depth: researchDepth,
        status: "searching",
        findings: [],
        synthesis: null,
      }));
      await new Promise((r) => setTimeout(r, 800));

      // Step 2: Analyzing
      setResearch((prev) => ({ ...prev, status: "analyzing" }));
      await new Promise((r) => setTimeout(r, 800));

      // Step 3: Synthesizing
      let parsedFindings: ResearchFinding[];
      try {
        const raw = JSON.parse(findingsJson);
        parsedFindings = raw.map(
          (
            f: { title: string; summary: string; source: string; relevance: string },
            i: number
          ) => ({
            id: `f-${Date.now()}-${i}`,
            title: f.title,
            summary: f.summary,
            source: f.source,
            relevance: f.relevance || "medium",
          })
        );
      } catch {
        parsedFindings = defaultFindings;
      }

      setResearch((prev) => ({
        ...prev,
        status: "synthesizing",
        findings: parsedFindings,
      }));
      await new Promise((r) => setTimeout(r, 600));

      // Step 4: Complete
      setResearch((prev) => ({
        ...prev,
        status: "complete",
        synthesis: synthesis || defaultSynthesis,
      }));

      parsedFindings.forEach((f) => triggerHighlight(f.id));

      return `Research on "${topic}" complete with ${parsedFindings.length} findings.`;
    },
  });

  // Action: Highlight a finding
  useCopilotAction({
    name: "highlightFinding",
    description: "Highlight a specific research finding to draw attention to it",
    parameters: [
      {
        name: "findingId",
        type: "string",
        description: `The ID of the finding to highlight. Available: ${research.findings.map((f) => f.id).join(", ")}`,
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Highlighting finding...</span>
          </div>
        );
      }
      const finding = research.findings.find((f) => f.id === args.findingId);
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <Sparkles className="h-4 w-4" />
          <span>
            Highlighted <strong>{finding?.title ?? args.findingId}</strong>
          </span>
        </div>
      );
    },
    handler: ({ findingId }) => {
      const finding = research.findings.find((f) => f.id === findingId);
      if (!finding) return `Finding "${findingId}" not found`;
      triggerHighlight(findingId);
      return `Highlighted finding: ${finding.title}`;
    },
  });

  // Action: Clear research
  useCopilotAction({
    name: "clearResearch",
    description: "Reset the research agent to idle state, clearing all findings",
    parameters: [],
    handler: () => {
      setResearch({
        topic: "",
        status: "idle",
        depth: "standard",
        findings: [],
        synthesis: null,
      });
      return "Research cleared";
    },
  });

  const currentStepIndex = getStepIndex(research.status);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Research Agent
          </h2>
          {research.topic && (
            <p className="text-sm text-muted-foreground">
              Topic: <span className="text-foreground">{research.topic}</span>
              {research.depth !== "standard" && (
                <span className="ml-2 rounded-full border border-border/50 px-2 py-0.5 text-xs">
                  {research.depth}
                </span>
              )}
            </p>
          )}
        </div>
        {research.status !== "idle" && research.status !== "complete" && (
          <div className="flex items-center gap-2 text-sm text-violet-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="capitalize">{research.status}...</span>
          </div>
        )}
      </div>

      {/* Research Pipeline */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Research Pipeline
        </h3>
        <div className="flex items-center gap-2">
          {PIPELINE_STEPS.map((step, i) => {
            const isActive = currentStepIndex === i;
            const isComplete = currentStepIndex > i;
            const isPending = currentStepIndex < i;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all flex-1",
                    isActive &&
                      "border-violet-500/50 bg-violet-500/10 text-violet-400",
                    isComplete &&
                      "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                    isPending &&
                      "border-border/30 bg-muted/20 text-muted-foreground/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isActive && "animate-pulse"
                    )}
                  />
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-4 shrink-0",
                      isComplete ? "bg-emerald-500/50" : "bg-border/30"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Findings */}
      {research.findings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Findings ({research.findings.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {research.findings.map((finding) => {
              const isHighlighted = highlightedIds.has(finding.id);
              return (
                <div
                  key={finding.id}
                  className={cn(
                    "rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-300",
                    isHighlighted &&
                      "border-violet-500/60 shadow-[0_0_16px_rgba(139,92,246,0.25)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">
                      {finding.title}
                    </h4>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize",
                        relevanceColors[finding.relevance]
                      )}
                    >
                      {finding.relevance}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {finding.summary}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/60">
                    <ExternalLink className="h-3 w-3" />
                    {finding.source}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Synthesis */}
      {research.synthesis && (
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                AI Synthesis
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {research.synthesis}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {research.status === "idle" && research.findings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/40 py-12 text-muted-foreground">
          <Search className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium">No research conducted yet</p>
          <p className="text-xs text-muted-foreground/60">
            Ask the AI to research a topic to get started.
          </p>
        </div>
      )}

      {/* Screen reader live region */}
      <div aria-live="polite" className="sr-only">
        Research agent: {research.status} on topic &quot;{research.topic}&quot;
        with {research.findings.length} findings
      </div>
    </div>
  );
}
