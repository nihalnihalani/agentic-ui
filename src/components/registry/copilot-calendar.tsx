"use client";

import React, { useState, useCallback, useRef } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle } from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  day: string; // "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
  startHour: number; // 8-17
  endHour: number; // 9-18
  color: string; // "violet" | "blue" | "emerald" | "amber" | "rose"
}

interface CopilotCalendarProps {
  initialEvents?: CalendarEvent[];
  className?: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  violet: {
    bg: "bg-violet-500/20",
    border: "border-violet-500/30",
    text: "text-violet-300",
  },
  blue: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-300",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-300",
  },
  amber: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    text: "text-amber-300",
  },
  rose: {
    bg: "bg-rose-500/20",
    border: "border-rose-500/30",
    text: "text-rose-300",
  },
};

function formatHour(hour: number): string {
  if (hour === 12) return "12 PM";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

const defaultEvents: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Team Standup",
    day: "Mon",
    startHour: 9,
    endHour: 10,
    color: "violet",
  },
  {
    id: "evt-2",
    title: "Design Review",
    day: "Tue",
    startHour: 14,
    endHour: 15,
    color: "blue",
  },
  {
    id: "evt-3",
    title: "Sprint Planning",
    day: "Wed",
    startHour: 10,
    endHour: 11,
    color: "emerald",
  },
  {
    id: "evt-4",
    title: "1:1 with Manager",
    day: "Thu",
    startHour: 11,
    endHour: 12,
    color: "amber",
  },
  {
    id: "evt-5",
    title: "Demo Day",
    day: "Fri",
    startHour: 15,
    endHour: 16,
    color: "rose",
  },
];

export function CopilotCalendar({
  initialEvents,
  className,
}: CopilotCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(
    initialEvents ?? defaultEvents
  );
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set());
  const pulseTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const triggerPulse = useCallback((eventId: string) => {
    const existing = pulseTimeouts.current.get(eventId);
    if (existing) clearTimeout(existing);

    setNewEventIds((prev) => new Set(prev).add(eventId));
    const timeout = setTimeout(() => {
      setNewEventIds((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
      pulseTimeouts.current.delete(eventId);
    }, 1500);
    pulseTimeouts.current.set(eventId, timeout);
  }, []);

  // Expose calendar state to AI
  useCopilotReadable({
    description:
      "Current weekly calendar state including all events and the visible time range",
    value: {
      totalEvents: events.length,
      days: DAYS,
      visibleHours: { start: 8, end: 18 },
      events: events.map((evt) => ({
        id: evt.id,
        title: evt.title,
        day: evt.day,
        startHour: evt.startHour,
        endHour: evt.endHour,
        color: evt.color,
      })),
    },
  });

  // Action: Add event
  useCopilotAction({
    name: "addEvent",
    description:
      "Add a new event to the weekly calendar at a specific day and time slot",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the event",
        required: true,
      },
      {
        name: "day",
        type: "string",
        description:
          "The day of the week: Mon, Tue, Wed, Thu, Fri, Sat, or Sun",
        required: true,
      },
      {
        name: "startHour",
        type: "number",
        description: "The starting hour (8-17, where 8 = 8 AM, 17 = 5 PM)",
        required: true,
      },
      {
        name: "endHour",
        type: "number",
        description:
          "The ending hour (9-18, where 9 = 9 AM, 18 = 6 PM). Must be greater than startHour",
        required: true,
      },
      {
        name: "color",
        type: "string",
        description:
          'The event color: "violet", "blue", "emerald", "amber", or "rose"',
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Adding event...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Added <strong>{args.title}</strong> on {args.day}{" "}
            {args.startHour !== undefined && formatHour(args.startHour)}&ndash;
            {args.endHour !== undefined && formatHour(args.endHour)}
          </span>
        </div>
      );
    },
    handler: ({ title, day, startHour, endHour, color }) => {
      if (!DAYS.includes(day as (typeof DAYS)[number])) {
        return `Invalid day: ${day}. Must be one of ${DAYS.join(", ")}`;
      }
      if (startHour < 8 || startHour > 17) {
        return `Invalid startHour: ${startHour}. Must be between 8 and 17`;
      }
      if (endHour < 9 || endHour > 18 || endHour <= startHour) {
        return `Invalid endHour: ${endHour}. Must be between 9 and 18 and greater than startHour`;
      }
      const newId = `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newEvent: CalendarEvent = {
        id: newId,
        title,
        day,
        startHour,
        endHour,
        color: color && colorMap[color] ? color : "blue",
      };
      setEvents((prev) => [...prev, newEvent]);
      triggerPulse(newId);
      return `Added "${title}" on ${day} from ${formatHour(startHour)} to ${formatHour(endHour)}`;
    },
  });

  // Action: Move event
  useCopilotAction({
    name: "moveEvent",
    description:
      "Move an existing event to a different day and/or time slot on the calendar",
    parameters: [
      {
        name: "eventId",
        type: "string",
        description: "The ID of the event to move",
        required: true,
      },
      {
        name: "newDay",
        type: "string",
        description:
          "The new day of the week: Mon, Tue, Wed, Thu, Fri, Sat, or Sun",
      },
      {
        name: "newStartHour",
        type: "number",
        description: "The new starting hour (8-17)",
      },
      {
        name: "newEndHour",
        type: "number",
        description: "The new ending hour (9-18)",
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>Moving event...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Moved <strong>{args.eventId}</strong>
            {args.newDay && (
              <>
                {" "}
                &rarr; {args.newDay}
              </>
            )}
            {args.newStartHour !== undefined && (
              <>
                {" "}
                at {formatHour(args.newStartHour)}
              </>
            )}
          </span>
        </div>
      );
    },
    handler: ({ eventId, newDay, newStartHour, newEndHour }) => {
      let found = false;
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id !== eventId) return evt;
          found = true;
          return {
            ...evt,
            day: newDay ?? evt.day,
            startHour: newStartHour ?? evt.startHour,
            endHour: newEndHour ?? evt.endHour,
          };
        })
      );
      if (!found) return `Event ${eventId} not found`;
      triggerPulse(eventId);
      return `Moved event ${eventId}`;
    },
  });

  // Action: Remove event
  useCopilotAction({
    name: "removeEvent",
    description: "Remove an event from the calendar by its ID",
    parameters: [
      {
        name: "eventId",
        type: "string",
        description: "The ID of the event to remove",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
            <span>Removing event...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Removed event <strong>{args.eventId}</strong>
          </span>
        </div>
      );
    },
    handler: ({ eventId }) => {
      let found = false;
      setEvents((prev) =>
        prev.filter((evt) => {
          if (evt.id === eventId) {
            found = true;
            return false;
          }
          return true;
        })
      );
      if (!found) return `Event ${eventId} not found`;
      return `Removed event ${eventId}`;
    },
  });

  // Action: Find free slot
  useCopilotAction({
    name: "findFreeSlot",
    description:
      "Find the next available free time slot on a given day (or any day) that fits a requested duration",
    parameters: [
      {
        name: "day",
        type: "string",
        description:
          "The preferred day to search. If omitted, searches all days starting from Mon",
      },
      {
        name: "durationHours",
        type: "number",
        description: "The required duration in hours (default 1)",
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Searching for free slot...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Found free slot
            {args.day && (
              <>
                {" "}
                on <strong>{args.day}</strong>
              </>
            )}
          </span>
        </div>
      );
    },
    handler: ({ day, durationHours }) => {
      const duration = durationHours ?? 1;
      const daysToSearch = day
        ? [day]
        : [...DAYS];

      for (const searchDay of daysToSearch) {
        const dayEvents = events
          .filter((evt) => evt.day === searchDay)
          .sort((a, b) => a.startHour - b.startHour);

        for (let hour = 8; hour <= 18 - duration; hour++) {
          const slotEnd = hour + duration;
          const hasConflict = dayEvents.some(
            (evt) => evt.startHour < slotEnd && evt.endHour > hour
          );
          if (!hasConflict) {
            return `Free slot found: ${searchDay} ${formatHour(hour)}-${formatHour(slotEnd)}`;
          }
        }
      }

      return "No free slot found matching the criteria";
    },
  });

  // Action: Clear day
  useCopilotAction({
    name: "clearDay",
    description: "Remove all events from a specific day of the week",
    parameters: [
      {
        name: "day",
        type: "string",
        description:
          "The day to clear: Mon, Tue, Wed, Thu, Fri, Sat, or Sun",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Clearing day...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Cleared all events on <strong>{args.day}</strong>
          </span>
        </div>
      );
    },
    handler: ({ day }) => {
      if (!DAYS.includes(day as (typeof DAYS)[number])) {
        return `Invalid day: ${day}. Must be one of ${DAYS.join(", ")}`;
      }
      const count = events.filter((evt) => evt.day === day).length;
      setEvents((prev) => prev.filter((evt) => evt.day !== day));
      return `Cleared ${count} event(s) from ${day}`;
    },
  });

  // Helper: get events for a specific day
  const getEventsForDay = (day: string) =>
    events.filter((evt) => evt.day === day);

  // Grid dimensions
  const ROW_HEIGHT = 48; // px per hour row

  return (
    <div className={cn("w-full", className)}>
      {/* Calendar grid */}
      <div className="overflow-hidden rounded-lg border border-border/50">
        <div className="overflow-x-auto">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "64px repeat(7, minmax(120px, 1fr))",
            }}
          >
            {/* Top-left corner cell */}
            <div className="border-b border-r border-border/30 bg-muted/30 px-2 py-2" />

            {/* Day headers */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="border-b border-r border-border/30 bg-muted/30 px-3 py-2 text-center text-sm font-semibold text-foreground last:border-r-0"
              >
                {day}
              </div>
            ))}

            {/* Hour rows */}
            {HOURS.map((hour) => (
              <React.Fragment key={`row-${hour}`}>
                {/* Hour label */}
                <div
                  className="border-b border-r border-border/20 bg-muted/10 px-2 py-1 text-right text-xs text-muted-foreground"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  <span className="leading-none">{formatHour(hour)}</span>
                </div>

                {/* Day cells for this hour */}
                {DAYS.map((day) => (
                  <div
                    key={`${day}-${hour}`}
                    className="relative border-b border-r border-border/10 last:border-r-0"
                    style={{ height: `${ROW_HEIGHT}px` }}
                  >
                    {/* Render events that start at this hour */}
                    {getEventsForDay(day)
                      .filter((evt) => evt.startHour === hour)
                      .map((evt) => {
                        const durationHours = evt.endHour - evt.startHour;
                        const heightPx = durationHours * ROW_HEIGHT - 4;
                        const colors = colorMap[evt.color] ?? colorMap.blue;
                        const isPulsing = newEventIds.has(evt.id);

                        return (
                          <div
                            key={evt.id}
                            className={cn(
                              "absolute inset-x-1 top-0.5 z-10 overflow-hidden rounded-md border px-2 py-1 text-xs font-medium transition-all",
                              colors.bg,
                              colors.border,
                              colors.text,
                              isPulsing && "animate-pulse"
                            )}
                            style={{ height: `${heightPx}px` }}
                            title={`${evt.title} (${formatHour(evt.startHour)}-${formatHour(evt.endHour)})`}
                          >
                            <div className="truncate leading-tight">
                              {evt.title}
                            </div>
                            {durationHours > 1 && (
                              <div className="mt-0.5 truncate text-[10px] opacity-70">
                                {formatHour(evt.startHour)}&ndash;
                                {formatHour(evt.endHour)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>{events.length} event(s) on calendar</span>
        <div className="flex items-center gap-3">
          {Object.entries(colorMap).map(([name, colors]) => (
            <span
              key={name}
              className={cn(
                "inline-flex items-center gap-1 capitalize",
                colors.text
              )}
            >
              <span
                className={cn("inline-block h-2 w-2 rounded-full", colors.bg, colors.border, "border")}
              />
              {name}
            </span>
          ))}
        </div>
      </div>
      <div aria-live="polite" className="sr-only">
        {events.length} events on weekly calendar
      </div>
    </div>
  );
}
