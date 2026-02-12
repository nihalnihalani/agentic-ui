"use client";

import React, { useState, useCallback, useRef } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, LayoutGrid, ArrowRight, Loader2 } from "lucide-react";

export interface CanvasItem {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
}

export interface Column {
  id: string;
  title: string;
  items: CanvasItem[];
}

interface CopilotCanvasProps {
  initialColumns: Column[];
  onUpdate?: (columns: Column[]) => void;
  className?: string;
}

const priorityColors: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function CopilotCanvas({
  initialColumns,
  onUpdate,
  className,
}: CopilotCanvasProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [highlightedItems, setHighlightedItems] = useState<Set<string>>(
    new Set()
  );
  const [draggedItem, setDraggedItem] = useState<{
    item: CanvasItem;
    sourceColumnId: string;
  } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const highlightTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const updateColumns = useCallback(
    (updater: (prev: Column[]) => Column[]) => {
      setColumns((prev) => {
        const next = updater(prev);
        onUpdate?.(next);
        return next;
      });
    },
    [onUpdate]
  );

  const highlightItem = useCallback((itemId: string) => {
    const existing = highlightTimeouts.current.get(itemId);
    if (existing) clearTimeout(existing);

    setHighlightedItems((prev) => new Set(prev).add(itemId));
    const timeout = setTimeout(() => {
      setHighlightedItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      highlightTimeouts.current.delete(itemId);
    }, 1500);
    highlightTimeouts.current.set(itemId, timeout);
  }, []);

  // Expose board state to Copilot
  useCopilotReadable({
    description:
      "The current state of the kanban board with all columns and their items",
    value: columns,
  });

  // Action: Add item to a column
  useCopilotAction({
    name: "addItem",
    description: "Add a new item/task to a specific column on the board",
    parameters: [
      {
        name: "columnId",
        type: "string",
        description: "The ID of the column to add the item to",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "The title of the new item",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Optional description for the item",
      },
      {
        name: "priority",
        type: "string",
        description: 'Priority level: "low", "medium", or "high"',
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Adding item...</span>
          </div>
        );
      }
      return (
        <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>
              Added <strong>{args.title}</strong>
            </span>
            {args.priority && (
              <span className="rounded-full border border-violet-500/30 px-1.5 py-0.5 text-[10px] capitalize">
                {args.priority}
              </span>
            )}
          </div>
          {args.description && (
            <p className="mt-1 text-xs text-violet-400/70 truncate">{args.description}</p>
          )}
        </div>
      );
    },
    handler: ({ columnId, title, description, priority }) => {
      const newId = `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      updateColumns((prev) => {
        const targetCol = prev.find(col => col.id === columnId);
        if (!targetCol) return prev;
        return prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                items: [
                  ...col.items,
                  {
                    id: newId,
                    title,
                    description,
                    priority: priority as CanvasItem["priority"],
                  },
                ],
              }
            : col
        );
      });
      highlightItem(newId);
    },
  });

  // Action: Remove item
  useCopilotAction({
    name: "removeItem",
    description: "Remove an item from the board",
    parameters: [
      {
        name: "itemId",
        type: "string",
        description: "The ID of the item to remove",
        required: true,
      },
    ],
    handler: ({ itemId }) => {
      updateColumns((prev) =>
        prev.map((col) => ({
          ...col,
          items: col.items.filter((item) => item.id !== itemId),
        }))
      );
    },
  });

  // Action: Move item between columns
  useCopilotAction({
    name: "moveItem",
    description: "Move an item from its current column to a different column",
    parameters: [
      {
        name: "itemId",
        type: "string",
        description: "The ID of the item to move",
        required: true,
      },
      {
        name: "targetColumnId",
        type: "string",
        description: "The ID of the column to move the item to",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>Moving item...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <ArrowRight className="h-4 w-4" />
          <span>
            Moved <strong>{args.itemId}</strong> &rarr; <strong>{args.targetColumnId}</strong>
          </span>
        </div>
      );
    },
    handler: ({ itemId, targetColumnId }) => {
      updateColumns((prev) => {
        const targetCol = prev.find(col => col.id === targetColumnId);
        if (!targetCol) return prev;
        let movedItem: CanvasItem | undefined;
        const withoutItem = prev.map((col) => {
          const found = col.items.find((item) => item.id === itemId);
          if (found) movedItem = found;
          return {
            ...col,
            items: col.items.filter((item) => item.id !== itemId),
          };
        });
        if (!movedItem) return prev;
        return withoutItem.map((col) =>
          col.id === targetColumnId
            ? { ...col, items: [...col.items, movedItem!] }
            : col
        );
      });
      highlightItem(itemId);
    },
  });

  // Action: Reorder items within a column
  useCopilotAction({
    name: "reorderItems",
    description: "Reorder items within a column by providing the new order of item IDs",
    parameters: [
      {
        name: "columnId",
        type: "string",
        description: "The ID of the column to reorder",
        required: true,
      },
      {
        name: "itemIds",
        type: "string[]",
        description: "Array of item IDs in the desired order",
        required: true,
      },
    ],
    handler: ({ columnId, itemIds }) => {
      updateColumns((prev) =>
        prev.map((col) => {
          if (col.id !== columnId) return col;
          const itemMap = new Map(col.items.map((item) => [item.id, item]));
          const reordered = (itemIds as string[])
            .map((id) => itemMap.get(id))
            .filter(Boolean) as CanvasItem[];
          return { ...col, items: reordered };
        })
      );
      (itemIds as string[]).forEach((id) => highlightItem(id));
    },
  });

  // Action: Add a new column
  useCopilotAction({
    name: "addColumn",
    description: "Add a new column to the board",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the new column",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Adding column...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <LayoutGrid className="h-4 w-4" />
          <span>
            Added column <strong>{args.title}</strong>
          </span>
        </div>
      );
    },
    handler: ({ title }) => {
      const newId = `col-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      updateColumns((prev) => [
        ...prev,
        { id: newId, title, items: [] },
      ]);
    },
  });

  // Drag handlers
  const handleDragStart = (item: CanvasItem, sourceColumnId: string) => {
    setDraggedItem({ item, sourceColumnId });
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedItem) return;
    if (draggedItem.sourceColumnId === targetColumnId) {
      setDraggedItem(null);
      return;
    }

    updateColumns((prev) => {
      const withoutItem = prev.map((col) =>
        col.id === draggedItem.sourceColumnId
          ? {
              ...col,
              items: col.items.filter((i) => i.id !== draggedItem.item.id),
            }
          : col
      );
      return withoutItem.map((col) =>
        col.id === targetColumnId
          ? { ...col, items: [...col.items, draggedItem.item] }
          : col
      );
    });

    highlightItem(draggedItem.item.id);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  return (
    <div className={cn("flex gap-4 overflow-x-auto p-4", className)}>
      {columns.map((column) => (
        <div
          key={column.id}
          role="group"
          aria-label={column.title}
          className={cn(
            "flex w-72 shrink-0 flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm",
            dragOverColumn === column.id && "border-violet-500/50 bg-violet-500/5"
          )}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column header */}
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              {column.title}
            </h3>
            <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {column.items.length}
            </span>
          </div>

          {/* Items list */}
          <div className="flex flex-1 flex-col gap-2 p-3">
            {column.items.length === 0 && (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border/40 py-8 text-xs text-muted-foreground">
                Drop items here
              </div>
            )}
            {column.items.map((item) => (

              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item, column.id)}
                onDragEnd={handleDragEnd}
                aria-label={`${item.title}${item.priority ? `, ${item.priority} priority` : ""}`}
                className={cn(
                  "group cursor-grab rounded-lg border border-border/40 bg-background/80 p-3 transition-all hover:border-border/80 hover:shadow-sm active:cursor-grabbing",
                  highlightedItems.has(item.id) &&
                    "animate-pulse border-violet-500/60 shadow-[0_0_12px_rgba(139,92,246,0.3)]",
                  draggedItem?.item.id === item.id && "opacity-40"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {item.title}
                  </p>
                  {item.priority && (
                    <Badge
                      className={cn(
                        "shrink-0 text-[10px] font-medium capitalize",
                        priorityColors[item.priority]
                      )}
                    >
                      {item.priority}
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    {item.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const title = prompt("New item title:");
                if (title?.trim()) {
                  updateColumns(prev => prev.map(col =>
                    col.id === column.id
                      ? { ...col, items: [...col.items, { id: `item-${Date.now()}`, title: title.trim(), priority: "medium" as const }] }
                      : col
                  ));
                }
              }}
              className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border/40 py-2 text-xs text-muted-foreground/60 transition-colors hover:border-border hover:text-muted-foreground"
            >
              <Plus className="size-3" /> Add item
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
