import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotChart - AI-Powered Data Visualization | AgenticUI",
  description: "Interactive bar and line charts with natural language controls. Change chart types, filter data, and highlight points through conversation.",
  openGraph: {
    title: "CopilotChart - AI-Powered Data Visualization",
    description: "Interactive charts with natural language controls powered by CopilotKit.",
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
