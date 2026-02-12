import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotChat - AI-Powered Chat Interface | AgenticUI",
  description: "A custom chat interface with message bubbles, typing indicators, and AI-powered message management. Built with CopilotKit.",
  openGraph: {
    title: "CopilotChat - AI-Powered Chat Interface",
    description: "Build branded chat experiences with AI-powered message management using CopilotKit.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
