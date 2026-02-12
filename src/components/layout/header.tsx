"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Star, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopilotKitIcon } from "@/components/ui/copilotkit-icon";
import { Liquid } from "@/components/ui/button-1";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const COLORS = {
  color1: "#FFFFFF",
  color2: "#1E10C5",
  color3: "#9089E2",
  color4: "#FCFCFE",
  color5: "#F9F9FD",
  color6: "#B2B8E7",
  color7: "#0E2DCB",
  color8: "#0017E9",
  color9: "#4743EF",
  color10: "#7D7BF4",
  color11: "#0B06FC",
  color12: "#C5C1EA",
  color13: "#1403DE",
  color14: "#B6BAF6",
  color15: "#C1BEEB",
  color16: "#290ECB",
  color17: "#3F4CC0",
};

function LiquidGitHubButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="https://github.com/CopilotKit/copilotkit"
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-block w-32 h-[2.2em] group dark:bg-black bg-white dark:border-white border-black border rounded-lg"
    >
      <div className="absolute w-[112.81%] h-[128.57%] top-[8.57%] left-1/2 -translate-x-1/2 filter blur-[19px] opacity-70">
        <span className="absolute inset-0 rounded-lg bg-[#d9d9d9] filter blur-[6.5px]" />
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <Liquid isHovered={isHovered} colors={COLORS} />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[92.23%] h-[112.85%] rounded-lg bg-[#010128] filter blur-[7.3px]" />
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <span className="absolute inset-0 rounded-lg bg-[#d9d9d9]" />
        <span className="absolute inset-0 rounded-lg bg-black" />
        <Liquid isHovered={isHovered} colors={COLORS} />
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`absolute inset-0 rounded-lg border-solid border-[3px] border-gradient-to-b from-transparent to-white mix-blend-overlay filter ${
              i <= 2 ? "blur-[3px]" : i === 3 ? "blur-[5px]" : "blur-[4px]"
            }`}
          />
        ))}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70.8%] h-[42.85%] rounded-lg filter blur-[15px] bg-[#006]" />
      </div>
      <button
        className="absolute inset-0 rounded-lg bg-transparent cursor-pointer"
        aria-label="View on GitHub"
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="flex items-center justify-center gap-2 rounded-lg group-hover:text-yellow-400 text-white text-sm font-semibold tracking-wide whitespace-nowrap">
          <Star className="group-hover:fill-yellow-400 fill-white w-4 h-4 flex-shrink-0" />
          <span>GitHub</span>
        </span>
      </button>
    </a>
  );
}

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        transparent
          ? ""
          : "border-b border-white/5 bg-black/80 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center">
            <CopilotKitIcon className="size-6 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">AgenticUI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#components"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Components
          </Link>
          <Link
            href="/features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Features
          </Link>
          <LiquidGitHubButton />
        </nav>

        <Button asChild size="sm" className="hidden md:inline-flex">
          <Link href="#components">Get Started</Link>
        </Button>

        {/* Mobile hamburger menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 px-4">
              <Link
                href="#components"
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Components
              </Link>
              <Link
                href="/features"
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Features
              </Link>
              <Link
                href="https://github.com/CopilotKit/copilotkit"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="size-4" />
                GitHub
              </Link>
              <Button asChild size="sm" className="mt-2 w-full">
                <Link href="#components" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
