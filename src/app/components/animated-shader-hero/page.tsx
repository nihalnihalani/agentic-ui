"use client";

import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/layout/code-block";
import { PromptCopyBlock } from "@/components/layout/prompt-copy-block";
import { getComponentBySlug } from "@/lib/components-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const component = getComponentBySlug("animated-shader-hero")!;

const codeSnippet = `import AnimatedShaderHero from "@/components/ui/animated-shader-hero";

<AnimatedShaderHero
  trustBadge={{
    text: "Trusted by forward-thinking teams.",
    icons: ["\u2728"]
  }}
  headline={{
    line1: "Launch Your",
    line2: "Workflow Into Orbit"
  }}
  subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams."
  buttons={{
    primary: {
      text: "Get Started for Free",
      onClick: () => console.log("Get started!")
    },
    secondary: {
      text: "Explore Features",
      onClick: () => console.log("Explore!")
    }
  }}
/>`;

const propsReference = `interface HeroProps {
  trustBadge?: {
    text: string;       // Badge text shown next to icons
    icons?: string[];   // Emoji or text icons (e.g., ["\u2728", "\ud83d\ude80"])
  };
  headline: {
    line1: string;      // First line of the hero heading
    line2: string;      // Second line with different gradient
  };
  subtitle: string;     // Description text below heading
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;   // Additional CSS classes
}`;

export default function AnimatedShaderHeroPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Components
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {component.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            {component.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {component.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/50 bg-muted/30 px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Copy Prompt for AI Tools */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Copy Prompt for AI Tools
          </h3>
          <PromptCopyBlock prompt={component.copyPrompt} />
        </div>
      </div>

      {/* Live Demo — full-width */}
      <Card className="mx-4 mb-8 border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle>Live Demo</CardTitle>
          <CardDescription>
            Move your cursor over the background to interact with the shader.
            The cosmic animation responds to pointer position and movement.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-[600px] w-full overflow-hidden rounded-b-lg">
            <AnimatedShaderHero
              trustBadge={{
                text: "Trusted by forward-thinking teams.",
                icons: ["\u2728"],
              }}
              headline={{
                line1: "Launch Your",
                line2: "Workflow Into Orbit",
              }}
              subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams — fast, seamless, and limitless."
              buttons={{
                primary: {
                  text: "Get Started for Free",
                  onClick: () => console.log("Get Started clicked!"),
                },
                secondary: {
                  text: "Explore Features",
                  onClick: () => console.log("Explore Features clicked!"),
                },
              }}
              className="!h-full"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mx-auto max-w-4xl px-6 pb-12">
        {/* Props Reference */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle>Props Reference</CardTitle>
            <CardDescription>
              All available props for the AnimatedShaderHero component.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={propsReference} filename="types.ts" />
          </CardContent>
        </Card>

        {/* Usage */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>
              Drop the component into your page and customize the headline,
              subtitle, trust badge, and CTA buttons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={codeSnippet} filename="usage.tsx" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
