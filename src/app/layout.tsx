import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";
import { Toaster } from "@/components/ui/sonner";
import { SuppressDevOverlayWarnings } from "@/components/layout/suppress-dev-warnings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AgenticUI - AI-Native Components for CopilotKit",
    template: "%s | AgenticUI",
  },
  description:
    "Copy-paste React components with CopilotKit superpowers. Data grids, forms, and canvases that respond to natural language.",
  keywords: ["CopilotKit", "React", "AI components", "generative UI", "agentic UI", "shadcn", "Next.js"],
  openGraph: {
    title: "AgenticUI - AI-Native Components for CopilotKit",
    description: "Copy-paste React components with CopilotKit superpowers.",
    siteName: "AgenticUI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgenticUI - AI-Native Components for CopilotKit",
    description: "Copy-paste React components with CopilotKit superpowers.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SuppressDevOverlayWarnings />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
