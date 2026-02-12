import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotTextarea - AI Writing Assistant | AgenticUI",
  description:
    "An AI-powered textarea with real-time autocompletions, smart insertions, and contextual editing powered by CopilotKit.",
  openGraph: {
    title: "CopilotTextarea - AI Writing Assistant",
    description:
      "An AI-powered textarea with real-time autocompletions, smart insertions, and contextual editing.",
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
