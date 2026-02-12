"use client";

import { useState, useCallback, useRef } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";
import {
  Circle,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "pending" | "in-progress" | "completed";
}

const defaultMilestones: TimelineMilestone[] = [
  {
    id: "ms-1",
    title: "Project Kickoff",
    description: "Initial planning, team alignment, and project scope definition",
    date: "Jan 15, 2025",
    status: "completed",
  },
  {
    id: "ms-2",
    title: "User Research",
    description: "Conduct user interviews, surveys, and competitive analysis",
    date: "Feb 1, 2025",
    status: "completed",
  },
  {
    id: "ms-3",
    title: "Design Phase",
    description: "Create wireframes, prototypes, and finalize the design system",
    date: "Feb 20, 2025",
    status: "completed",
  },
  {
    id: "ms-4",
    title: "Development Sprint 1",
    description: "Core feature implementation and infrastructure setup",
    date: "Mar 15, 2025",
    status: "completed",
  },
  {
    id: "ms-5",
    title: "Alpha Release",
    description: "Internal release for early testing and feedback collection",
    date: "Apr 10, 2025",
    status: "in-progress",
  },
  {
    id: "ms-6",
    title: "Beta Launch",
    description: "Public beta release with limited feature set for early adopters",
    date: "May 1, 2025",
    status: "pending",
  },
  {
    id: "ms-7",
    title: "QA & Testing",
    description: "Comprehensive quality assurance, performance, and security testing",
    date: "May 20, 2025",
    status: "pending",
  },
  {
    id: "ms-8",
    title: "GA Launch",
    description: "General availability release with full feature set and documentation",
    date: "Jun 15, 2025",
    status: "pending",
  },
];

interface CopilotTimelineProps {
  initialMilestones?: TimelineMilestone[];
  className?: string;
}

const statusConfig = {
  completed: {
    color: "bg-emerald-500",
    border: "border-emerald-500",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
    label: "Completed",
  },
  "in-progress": {
    color: "bg-blue-500",
    border: "border-blue-500",
    text: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: Clock,
    label: "In Progress",
  },
  pending: {
    color: "bg-muted",
    border: "border-muted",
    text: "text-muted-foreground",
    badge: "bg-muted/50 text-muted-foreground border-border/50",
    icon: Circle,
    label: "Pending",
  },
};

export function CopilotTimeline({
  initialMilestones,
  className,
}: CopilotTimelineProps) {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>(
    initialMilestones ?? defaultMilestones
  );
  const [pulsingIds, setPulsingIds] = useState<Set<string>>(new Set());
  const pulseTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const triggerPulse = useCallback((milestoneId: string) => {
    const existing = pulseTimeouts.current.get(milestoneId);
    if (existing) clearTimeout(existing);

    setPulsingIds((prev) => new Set(prev).add(milestoneId));
    const timeout = setTimeout(() => {
      setPulsingIds((prev) => {
        const next = new Set(prev);
        next.delete(milestoneId);
        return next;
      });
      pulseTimeouts.current.delete(milestoneId);
    }, 1500);
    pulseTimeouts.current.set(milestoneId, timeout);
  }, []);

  // Expose timeline state to AI
  useCopilotReadable({
    description:
      "Current project timeline milestones with their titles, descriptions, dates, and statuses (pending, in-progress, completed)",
    value: {
      totalMilestones: milestones.length,
      completed: milestones.filter((m) => m.status === "completed").length,
      inProgress: milestones.filter((m) => m.status === "in-progress").length,
      pending: milestones.filter((m) => m.status === "pending").length,
      milestones,
    },
  });

  // AI action: add a milestone
  useCopilotAction({
    name: "addMilestone",
    description:
      "Add a new milestone to the project timeline. It will be appended at the end by default.",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the milestone",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "A brief description of the milestone",
        required: true,
      },
      {
        name: "date",
        type: "string",
        description: "The target date for the milestone (e.g. 'Jul 1, 2025')",
        required: true,
      },
      {
        name: "status",
        type: "string",
        description:
          'The status of the milestone: "pending", "in-progress", or "completed"',
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Adding milestone...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Added milestone <strong>{args.title}</strong> ({args.date})
          </span>
        </div>
      );
    },
    handler: ({ title, description, date, status }) => {
      const newId = `ms-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newMilestone: TimelineMilestone = {
        id: newId,
        title,
        description,
        date,
        status: (status as TimelineMilestone["status"]) || "pending",
      };
      setMilestones((prev) => [...prev, newMilestone]);
      triggerPulse(newId);
      return `Added milestone "${title}" on ${date}`;
    },
  });

  // AI action: remove a milestone
  useCopilotAction({
    name: "removeMilestone",
    description: "Remove a milestone from the timeline by its ID",
    parameters: [
      {
        name: "milestoneId",
        type: "string",
        description: `The ID of the milestone to remove. Current milestones: ${milestones.map((m) => `${m.id} (${m.title})`).join(", ")}`,
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-red-400" />
            <span>Removing milestone...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Removed milestone <strong>{args.milestoneId}</strong>
          </span>
        </div>
      );
    },
    handler: ({ milestoneId }) => {
      const target = milestones.find((m) => m.id === milestoneId);
      if (!target) return `Milestone ${milestoneId} not found`;
      setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      return `Removed milestone "${target.title}"`;
    },
  });

  // AI action: update milestone status
  useCopilotAction({
    name: "updateStatus",
    description:
      'Update the status of a milestone to "pending", "in-progress", or "completed"',
    parameters: [
      {
        name: "milestoneId",
        type: "string",
        description: `The ID of the milestone to update. Current milestones: ${milestones.map((m) => `${m.id} (${m.title})`).join(", ")}`,
        required: true,
      },
      {
        name: "status",
        type: "string",
        description:
          'The new status: "pending", "in-progress", or "completed"',
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>Updating status...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Updated <strong>{args.milestoneId}</strong> to{" "}
            <strong>{args.status}</strong>
          </span>
        </div>
      );
    },
    handler: ({ milestoneId, status }) => {
      const validStatuses: TimelineMilestone["status"][] = [
        "pending",
        "in-progress",
        "completed",
      ];
      if (!validStatuses.includes(status as TimelineMilestone["status"])) {
        return `Invalid status "${status}". Must be one of: ${validStatuses.join(", ")}`;
      }
      const target = milestones.find((m) => m.id === milestoneId);
      if (!target) return `Milestone ${milestoneId} not found`;
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId
            ? { ...m, status: status as TimelineMilestone["status"] }
            : m
        )
      );
      triggerPulse(milestoneId);
      return `Updated "${target.title}" status to ${status}`;
    },
  });

  // AI action: reorder timeline
  useCopilotAction({
    name: "reorderTimeline",
    description:
      "Reorder the timeline milestones by providing the milestone IDs in the desired order",
    parameters: [
      {
        name: "milestoneIds",
        type: "string[]",
        description: `Array of milestone IDs in the desired order. Current IDs: ${milestones.map((m) => m.id).join(", ")}`,
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Reordering timeline...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Reordered <strong>{args.milestoneIds?.length ?? 0}</strong>{" "}
            milestone(s)
          </span>
        </div>
      );
    },
    handler: ({ milestoneIds }) => {
      setMilestones((prev) => {
        const milestoneMap = new Map(prev.map((m) => [m.id, m]));
        const reordered = (milestoneIds as string[])
          .map((id) => milestoneMap.get(id))
          .filter(Boolean) as TimelineMilestone[];
        return reordered;
      });
      (milestoneIds as string[]).forEach((id) => triggerPulse(id));
      return `Reordered ${milestoneIds.length} milestone(s)`;
    },
  });

  return (
    <div className={cn("relative w-full py-8", className)}>
      {/* Header */}
      <div className="mb-8 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-foreground">
          Project Timeline
        </h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {milestones.filter((m) => m.status === "completed").length}/
          {milestones.length} completed
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Center vertical line - desktop */}
        <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-border/50 md:left-1/2 md:block md:-translate-x-px" />

        {/* Left vertical line - mobile */}
        <div className="absolute left-4 top-0 block h-full w-0.5 bg-border/50 md:hidden" />

        {/* Milestones */}
        <div className="space-y-8 md:space-y-12">
          {milestones.map((milestone, index) => {
            const config = statusConfig[milestone.status];
            const StatusIcon = config.icon;
            const isEven = index % 2 === 0;
            const isPulsing = pulsingIds.has(milestone.id);

            return (
              <div
                key={milestone.id}
                className={cn(
                  "relative flex items-start",
                  /* Mobile: always left-aligned */
                  "pl-12",
                  /* Desktop: alternate sides */
                  "md:pl-0",
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Status indicator on the line - mobile */}
                <div
                  className={cn(
                    "absolute left-2.5 top-1 z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 bg-background md:hidden",
                    config.border,
                    isPulsing && "animate-pulse"
                  )}
                >
                  <div
                    className={cn("h-1.5 w-1.5 rounded-full", config.color)}
                  />
                </div>

                {/* Status indicator on the line - desktop */}
                <div
                  className={cn(
                    "absolute left-1/2 top-3 z-10 hidden h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-background md:flex",
                    config.border,
                    isPulsing && "animate-pulse"
                  )}
                >
                  <div
                    className={cn("h-2 w-2 rounded-full", config.color)}
                  />
                </div>

                {/* Card */}
                <div
                  className={cn(
                    "w-full md:w-[calc(50%-2rem)]",
                    isEven ? "md:pr-0" : "md:pl-0"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:shadow-sm",
                      isPulsing &&
                        "border-violet-500/60 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                    )}
                  >
                    {/* Date and status row */}
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        {milestone.date}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          config.badge
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-foreground">
                      {milestone.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {milestone.description}
                    </p>

                    {/* Milestone ID */}
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {milestone.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {milestones.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-12 text-center">
          <Circle className="mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No milestones yet. Ask the AI to add one!
          </p>
        </div>
      )}
    </div>
  );
}
