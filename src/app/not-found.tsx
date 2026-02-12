import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-4 text-6xl font-bold text-muted-foreground/20">404</div>
        <h1 className="text-2xl font-bold tracking-tight">Component not found</h1>
        <p className="mt-2 text-muted-foreground">
          The component you&apos;re looking for doesn&apos;t exist yet.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/"><ArrowLeft className="size-4" /> Back to registry</Link>
          </Button>
          <Button asChild>
            <Link href="/#components"><Search className="size-4" /> Browse components</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
