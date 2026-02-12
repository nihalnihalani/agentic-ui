import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotTimeline - AI-Powered Project Timeline | AgenticUI",
  description: "A vertical timeline for project milestones. Add milestones, update statuses, and reorder through natural language.",
  openGraph: {
    title: "CopilotTimeline - AI-Powered Project Timeline",
    description: "Manage project milestones through natural language with CopilotKit.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
