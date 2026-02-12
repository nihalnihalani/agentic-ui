import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CopilotForm - Intent-Driven Form | AgenticUI",
  description: "An intent-driven form that fills itself when users describe what they want. Built with CopilotKit.",
  openGraph: {
    title: "CopilotForm - Intent-Driven Form",
    description: "An intent-driven form that fills itself when users describe what they want.",
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
