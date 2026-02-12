import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotCalendar - AI-Powered Weekly Calendar | AgenticUI",
  description: "A weekly calendar with AI scheduling. Add, move, and manage events through natural language conversations.",
  openGraph: {
    title: "CopilotCalendar - AI-Powered Weekly Calendar",
    description: "Schedule and manage events through natural language with CopilotKit.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
