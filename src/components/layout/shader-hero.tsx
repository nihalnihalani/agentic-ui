"use client";

import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import { components } from "@/lib/components-data";

export function ShaderHero() {
  const scrollToComponents = () => {
    document.getElementById("components")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatedShaderHero
      trustBadge={{
        text: `${components.length} AI-Powered Components · Built for CopilotKit`,
        icons: ["⚡"],
      }}
      headline={{
        line1: "AI-Native Components",
        line2: "for CopilotKit",
      }}
      subtitle=""
      buttons={{
        primary: {
          text: "Browse Components",
          onClick: scrollToComponents,
        },
        secondary: {
          text: "View on GitHub",
          onClick: () => window.open("https://github.com/CopilotKit/copilotkit", "_blank"),
        },
      }}
    />
  );
}
