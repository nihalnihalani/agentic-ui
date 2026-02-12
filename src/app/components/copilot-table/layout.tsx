import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotTable - AI-Powered Data Grid | AgenticUI",
  description: "A smart data grid that lets users sort, filter, and analyze data through natural language. Built with CopilotKit.",
  openGraph: {
    title: "CopilotTable - AI-Powered Data Grid",
    description: "Sort, filter, and analyze data through natural language with CopilotKit.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
