import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotEditor - AI-Powered Markdown Editor | AgenticUI",
  description: "A markdown editor with AI writing assistance. Insert, replace, format, and improve text through natural language.",
  openGraph: {
    title: "CopilotEditor - AI-Powered Markdown Editor",
    description: "Markdown editing with AI writing assistance powered by CopilotKit.",
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
