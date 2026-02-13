#!/usr/bin/env node
/**
 * Generates shadcn-compatible registry JSON files in public/r/
 * Run: node scripts/build-registry.mjs
 * Each file at public/r/<slug>.json is served as a static asset.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REGISTRY_DIR = join(ROOT, "src", "components", "registry");
const OUT_DIR = join(ROOT, "public", "r");

mkdirSync(OUT_DIR, { recursive: true });

// Component metadata: slug -> { name, description, file, dependencies, registryDependencies }
const components = [
  {
    slug: "copilot-table",
    name: "CopilotTable",
    description:
      "A smart data grid that lets users sort, filter, and analyze data through natural language.",
    file: "copilot-table.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
  },
  {
    slug: "copilot-form",
    name: "CopilotForm",
    description:
      "An intent-driven form — describe what you want and it fills itself.",
    file: "copilot-form.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["badge", "button", "input"],
  },
  {
    slug: "copilot-textarea",
    name: "CopilotTextarea",
    description:
      "AI-powered text input with inline suggestions and autocompletion.",
    file: "copilot-textarea.tsx",
    dependencies: [
      "@copilotkit/react-core",
      "@copilotkit/react-textarea",
      "lucide-react",
    ],
    registryDependencies: [],
  },
  {
    slug: "copilot-canvas",
    name: "CopilotCanvas",
    description:
      "A Kanban board with AI-powered task management and drag-and-drop.",
    file: "copilot-canvas.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["badge"],
  },
  {
    slug: "copilot-chat",
    name: "CopilotChat",
    description:
      "Chat interface with AI message management and conversation history.",
    file: "copilot-chat.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["button", "input"],
  },
  {
    slug: "copilot-editor",
    name: "CopilotEditor",
    description:
      "Rich text editor with AI writing assistance and formatting.",
    file: "copilot-editor.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["button"],
  },
  {
    slug: "copilot-timeline",
    name: "CopilotTimeline",
    description:
      "Timeline and roadmap view with AI milestone management.",
    file: "copilot-timeline.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
  },
  {
    slug: "copilot-chart",
    name: "CopilotChart",
    description:
      "Bar and line charts with AI annotations and trend analysis.",
    file: "copilot-chart.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
  },
  {
    slug: "copilot-calendar",
    name: "CopilotCalendar",
    description:
      "Weekly calendar with AI scheduling and event management.",
    file: "copilot-calendar.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
  },
  {
    slug: "copilot-notifications",
    name: "CopilotNotifications",
    description:
      "Notification center with AI triage, priority sorting, and actions.",
    file: "copilot-notifications.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["badge"],
  },
  {
    slug: "copilot-search",
    name: "CopilotSearch",
    description:
      "Product search with AI-powered filtering and recommendations.",
    file: "copilot-search.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["badge", "input"],
  },
  {
    slug: "copilot-research-agent",
    name: "ResearchAgent",
    description:
      "Multi-step AI research agent with pipeline progress, findings, and synthesis.",
    file: "copilot-research-agent.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
  },
  {
    slug: "copilot-dashboard",
    name: "CopilotDashboard",
    description:
      "Metrics dashboard with AI-generated insights and anomaly detection.",
    file: "copilot-dashboard.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
  },
];

let count = 0;

for (const comp of components) {
  const filePath = join(REGISTRY_DIR, comp.file);
  const content = readFileSync(filePath, "utf-8");

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: comp.slug,
    type: "registry:component",
    title: comp.name,
    description: comp.description,
    dependencies: comp.dependencies,
    registryDependencies: comp.registryDependencies,
    files: [
      {
        path: `registry/${comp.file}`,
        content,
        type: "registry:component",
      },
    ],
  };

  const outPath = join(OUT_DIR, `${comp.slug}.json`);
  writeFileSync(outPath, JSON.stringify(registryItem, null, 2));
  count++;
}

console.log(`✓ Built ${count} registry items in public/r/`);
