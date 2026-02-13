import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Agent - AI-Powered Multi-Step Research | AgenticUI",
  description: "An AI research agent that conducts multi-step investigations with visual pipeline progress, findings, and synthesis. Built with CopilotKit.",
  openGraph: {
    title: "Research Agent - AI-Powered Multi-Step Research",
    description: "Conduct multi-step research with AI-powered searching, analysis, and synthesis using CopilotKit.",
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
