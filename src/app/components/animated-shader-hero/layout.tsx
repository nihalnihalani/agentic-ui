import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animated Shader Hero - AgenticUI",
  description:
    "A stunning WebGL shader-powered hero section with animated cosmic background, gradient text, trust badges, and CTA buttons.",
  openGraph: {
    title: "Animated Shader Hero - AgenticUI",
    description:
      "A stunning WebGL shader-powered hero section with animated cosmic background, gradient text, trust badges, and CTA buttons.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
