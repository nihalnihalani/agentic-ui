import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotCanvas - AI Kanban Board | AgenticUI",
  description: "A kanban board that responds to voice and text commands. Built with CopilotKit.",
  openGraph: {
    title: "CopilotCanvas - AI Kanban Board",
    description: "A kanban board that responds to voice and text commands with CopilotKit.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
