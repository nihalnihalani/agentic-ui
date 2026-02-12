import Link from "next/link";
import { CopilotKitIcon } from "@/components/ui/copilotkit-icon";

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CopilotKitIcon className="size-4" />
            Built for CopilotKit developers
          </div>
          <span className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} AgenticUI &middot; Made with CopilotKit + Next.js
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="https://github.com/CopilotKit/copilotkit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
          <Link
            href="https://docs.copilotkit.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            CopilotKit Docs
          </Link>
          <Link
            href="https://21st.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            21st.dev
          </Link>
        </nav>
      </div>
    </footer>
  );
}
