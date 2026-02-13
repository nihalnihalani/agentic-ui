"use client";

import React from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      showDevConsole={false}
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
  );
}
