import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotNotifications - AI-Powered Notification Center | AgenticUI",
  description: "A notification center with AI-powered triage. Categorize, prioritize, and manage notifications through natural language.",
  openGraph: {
    title: "CopilotNotifications - AI-Powered Notification Center",
    description: "AI-powered notification triage and management with CopilotKit.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
