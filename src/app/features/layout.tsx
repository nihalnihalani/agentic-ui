import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - CopilotKit Integration Showcase",
  description:
    "Explore every CopilotKit feature used in AgenticUI: from useCopilotReadable to Generative UI, multi-adapter runtime, and AI-powered text editing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
