"use client";

import dynamic from "next/dynamic";

const CopilotProvider = dynamic(
  () =>
    import("@/components/layout/copilot-provider").then(
      (mod) => mod.CopilotProvider
    ),
  { ssr: false }
);

const CopilotDiscovery = dynamic(
  () =>
    import("@/components/layout/copilot-discovery").then(
      (mod) => mod.CopilotDiscovery
    ),
  { ssr: false }
);

export function CopilotWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CopilotProvider>
      <CopilotDiscovery />
      {children}
    </CopilotProvider>
  );
}
