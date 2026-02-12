import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotSearch - AI-Powered Search Interface | AgenticUI",
  description: "An AI-powered search with faceted filters, result highlighting, and natural language queries. Built with CopilotKit.",
  openGraph: {
    title: "CopilotSearch - AI-Powered Search Interface",
    description: "Search with natural language queries and AI-powered filtering using CopilotKit.",
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
