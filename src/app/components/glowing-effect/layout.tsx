import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glowing Effect - Interactive Border Glow | AgenticUI",
  description:
    "A mouse-tracking glowing border effect for cards and containers. Hover to reveal a colorful conic gradient glow that follows your cursor.",
  openGraph: {
    title: "Glowing Effect - Interactive Border Glow",
    description:
      "Mouse-tracking glowing border effect powered by motion animations.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
