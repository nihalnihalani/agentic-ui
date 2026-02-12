"use client";

import React from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";

class CopilotErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn("[AgenticUI] CopilotKit unavailable:", error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <CopilotErrorBoundary fallback={<>{children}</>}>
      <CopilotKit
        runtimeUrl="/api/copilotkit"
        showDevConsole={isDev}
        properties={{
          app: "agentic-ui-registry",
        }}
      >
        <CopilotSidebar
          labels={{
            title: "AgenticUI Assistant",
            initial:
              "Describe what you're building and I'll help you find the right components...",
            placeholder: "Ask about components, actions, or UI patterns...",
          }}
          defaultOpen={false}
          clickOutsideToClose
          hitEscapeToClose
          shortcut="/"
          instructions="You are the AgenticUI assistant. Help users discover and use CopilotKit-powered components from the registry. You can help with component configuration, action setup, and building agentic interfaces."
        >
          {children}
        </CopilotSidebar>
      </CopilotKit>
    </CopilotErrorBoundary>
  );
}
