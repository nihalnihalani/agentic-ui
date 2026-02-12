import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { components } from "@/lib/components-data";

interface ComponentNavProps {
  currentSlug: string;
}

export function ComponentNav({ currentSlug }: ComponentNavProps) {
  const currentIndex = components.findIndex((c) => c.slug === currentSlug);
  const prev = currentIndex > 0 ? components[currentIndex - 1] : null;
  const next = currentIndex < components.length - 1 ? components[currentIndex + 1] : null;

  return (
    <div className="mt-12 flex items-center justify-between border-t border-border/40 pt-6">
      {prev ? (
        <Link
          href={`/components/${prev.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          <div>
            <div className="text-xs text-muted-foreground/60">Previous</div>
            <div className="font-medium">{prev.name}</div>
          </div>
        </Link>
      ) : <div />}
      {next ? (
        <Link
          href={`/components/${next.slug}`}
          className="group flex items-center gap-2 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <div>
            <div className="text-xs text-muted-foreground/60">Next</div>
            <div className="font-medium">{next.name}</div>
          </div>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : <div />}
    </div>
  );
}
