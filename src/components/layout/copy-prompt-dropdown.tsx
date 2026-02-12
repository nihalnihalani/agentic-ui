"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Check, ChevronDown, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyPromptDropdownProps {
  prompt: string;
  className?: string;
  size?: "sm" | "default";
}

const tools = [
  {
    id: "cursor" as const,
    label: "Cursor",
    prefix: "",
    icon: "▲",
  },
  {
    id: "claude" as const,
    label: "Claude Code",
    prefix: "Create this component in my project:\n\n",
    icon: "◆",
  },
  {
    id: "v0" as const,
    label: "v0",
    prefix: "Build a React component with the following specification:\n\n",
    icon: "●",
  },
];

export function CopyPromptDropdown({ prompt, className, size = "default" }: CopyPromptDropdownProps) {
  const [open, setOpen] = useState(false);
  const [copiedTool, setCopiedTool] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  function handleCopy(toolId: string, prefix: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(prefix + prompt);
      setCopiedTool(toolId);
      setTimeout(() => {
        setCopiedTool(null);
        setOpen(false);
      }, 1200);
    } catch {
      // Clipboard API not available
    }
  }

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  }

  const isSmall = size === "sm";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Button
        variant="ghost"
        size={isSmall ? "xs" : "sm"}
        onClick={handleToggle}
        className={cn(
          "gap-1 text-muted-foreground hover:text-foreground",
          isSmall ? "h-6 px-1.5 text-[10px]" : "h-7 px-2 text-xs"
        )}
      >
        <Terminal className={isSmall ? "size-3" : "size-3.5"} />
        {!isSmall && "AI Prompt"}
        <ChevronDown className={cn("size-2.5 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-border/60 bg-card shadow-xl shadow-black/20 backdrop-blur-xl"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <div className="px-3 py-2 border-b border-border/30">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Copy prompt for
            </p>
          </div>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={(e) => handleCopy(tool.id, tool.prefix, e)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
            >
              <span className="text-xs text-muted-foreground">{tool.icon}</span>
              <span className="flex-1 text-left text-sm">{tool.label}</span>
              {copiedTool === tool.id ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
