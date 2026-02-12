import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotDashboard - AI-Powered Metrics Dashboard | AgenticUI",
  description: "A metrics dashboard with KPI cards, sparklines, and AI-driven insights. Ask questions about your data through natural language.",
  openGraph: {
    title: "CopilotDashboard - AI-Powered Metrics Dashboard",
    description: "KPI cards with sparklines and AI-driven insights powered by CopilotKit.",
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
