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

// --------------------------------------------------------------------------
// Shared setup instructions (referenced by every component's docs)
// --------------------------------------------------------------------------
const SETUP_SECTION = `## Setup

### 1. Install CopilotKit dependencies

\`\`\`bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
\`\`\`

### 2. Create an API route

Create \`app/api/copilotkit/route.ts\`:

\`\`\`ts
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

export const maxDuration = 60;

const runtime = new CopilotRuntime();
const serviceAdapter = new OpenAIAdapter();

const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

export { handleRequest as POST };
\`\`\`

### 3. Environment variables

Add to \`.env.local\`:

\`\`\`
OPENAI_API_KEY=sk-...
\`\`\`

### 4. Wrap your app with CopilotKit

In your page or layout, wrap the component tree with the CopilotKit provider and add a chat UI:

\`\`\`tsx
"use client";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function Page() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {/* your components here */}
      <CopilotPopup />
    </CopilotKit>
  );
}
\`\`\``;

// --------------------------------------------------------------------------
// Component metadata with docs
// --------------------------------------------------------------------------
const components = [
  {
    slug: "copilot-table",
    name: "CopilotTable",
    description:
      "A smart data grid that lets users sort, filter, and analyze data through natural language.",
    file: "copilot-table.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotTable, ColumnDef } from "@/components/copilot-table";

interface Row {
  [key: string]: unknown;
  name: string;
  role: string;
  salary: number;
}

const data: Row[] = [
  { name: "Alice", role: "Engineer", salary: 120000 },
  { name: "Bob", role: "Designer", salary: 95000 },
];

const columns: ColumnDef<Row>[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "salary", label: "Salary" },
];

<CopilotTable data={data} columns={columns} />
\`\`\`

The AI can sort, filter, and highlight rows via the chat popup.`,
  },
  {
    slug: "copilot-form",
    name: "CopilotForm",
    description:
      "An intent-driven form — describe what you want and it fills itself.",
    file: "copilot-form.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["badge", "button", "input"],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotForm, FieldConfig } from "@/components/copilot-form";

const fields: FieldConfig[] = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: ["Engineer", "Designer", "PM"],
  },
  { name: "bio", label: "Bio", type: "textarea" },
];

<CopilotForm
  fields={fields}
  onSubmit={(values) => console.log(values)}
/>
\`\`\`

Tell the AI something like "fill this out for a senior engineer named Jane" and it will populate the fields.`,
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
    docs:
      SETUP_SECTION.replace(
        "npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime",
        "npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @copilotkit/react-textarea"
      ) +
      `

## Usage

\`\`\`tsx
import { CopilotTextEditor } from "@/components/copilot-textarea";

<CopilotTextEditor
  purpose="writing a blog post"
  placeholder="Start typing..."
/>
\`\`\`

The editor provides inline AI suggestions as you type.`,
  },
  {
    slug: "copilot-canvas",
    name: "CopilotCanvas",
    description:
      "A Kanban board with AI-powered task management and drag-and-drop.",
    file: "copilot-canvas.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["badge"],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotCanvas, Column } from "@/components/copilot-canvas";

const columns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    items: [
      { id: "1", title: "Design homepage", priority: "high" },
      { id: "2", title: "Write tests", priority: "medium" },
    ],
  },
  { id: "doing", title: "In Progress", items: [] },
  { id: "done", title: "Done", items: [] },
];

<CopilotCanvas initialColumns={columns} />
\`\`\`

Ask the AI to add tasks, move items between columns, or reprioritize.`,
  },
  {
    slug: "copilot-chat",
    name: "CopilotChat",
    description:
      "Chat interface with AI message management and conversation history.",
    file: "copilot-chat.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["button", "input"],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotChat } from "@/components/copilot-chat";

<CopilotChat />
\`\`\`

The component ships with sample messages. You can also pass your own:

\`\`\`tsx
<CopilotChat
  initialMessages={[
    { id: "1", sender: "You", content: "Hello!", timestamp: "9:00 AM" },
  ]}
/>
\`\`\`

Use the AI to search, summarize, or manage the conversation.`,
  },
  {
    slug: "copilot-editor",
    name: "CopilotEditor",
    description:
      "Rich text editor with AI writing assistance and formatting.",
    file: "copilot-editor.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["button"],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotEditor } from "@/components/copilot-editor";

<CopilotEditor />
\`\`\`

Or with custom initial content:

\`\`\`tsx
<CopilotEditor initialContent="# My Document\\n\\nStart writing here..." />
\`\`\`

Ask the AI to rewrite, expand, summarize, or format your text.`,
  },
  {
    slug: "copilot-timeline",
    name: "CopilotTimeline",
    description:
      "Timeline and roadmap view with AI milestone management.",
    file: "copilot-timeline.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotTimeline } from "@/components/copilot-timeline";

<CopilotTimeline />
\`\`\`

The component includes sample milestones. Pass your own:

\`\`\`tsx
import { CopilotTimeline, TimelineMilestone } from "@/components/copilot-timeline";

const milestones: TimelineMilestone[] = [
  { id: "1", title: "Kickoff", description: "Project start", date: "Jan 1", status: "completed" },
  { id: "2", title: "MVP", description: "First release", date: "Mar 1", status: "in-progress" },
];

<CopilotTimeline initialMilestones={milestones} />
\`\`\`

Ask the AI to add milestones, update statuses, or reorder the timeline.`,
  },
  {
    slug: "copilot-chart",
    name: "CopilotChart",
    description:
      "Bar and line charts with AI annotations and trend analysis.",
    file: "copilot-chart.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotChart } from "@/components/copilot-chart";

<CopilotChart />
\`\`\`

Or with custom data:

\`\`\`tsx
import { CopilotChart, ChartDataPoint } from "@/components/copilot-chart";

const data: ChartDataPoint[] = [
  { month: "Jan", revenue: 28400, users: 820, growth: 4 },
  { month: "Feb", revenue: 31200, users: 910, growth: 7 },
];

<CopilotChart data={data} />
\`\`\`

Ask the AI to annotate data points, switch chart types, or analyze trends.`,
  },
  {
    slug: "copilot-calendar",
    name: "CopilotCalendar",
    description:
      "Weekly calendar with AI scheduling and event management.",
    file: "copilot-calendar.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotCalendar } from "@/components/copilot-calendar";

<CopilotCalendar />
\`\`\`

Or with custom events:

\`\`\`tsx
import { CopilotCalendar, CalendarEvent } from "@/components/copilot-calendar";

const events: CalendarEvent[] = [
  { id: "1", title: "Standup", day: "Mon", startHour: 9, endHour: 10, color: "blue" },
  { id: "2", title: "Design Review", day: "Wed", startHour: 14, endHour: 15, color: "violet" },
];

<CopilotCalendar initialEvents={events} />
\`\`\`

Ask the AI to schedule meetings, reschedule events, or clear a day.`,
  },
  {
    slug: "copilot-notifications",
    name: "CopilotNotifications",
    description:
      "Notification center with AI triage, priority sorting, and actions.",
    file: "copilot-notifications.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["badge"],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotNotifications } from "@/components/copilot-notifications";

<CopilotNotifications />
\`\`\`

The component ships with sample notifications. Ask the AI to triage, mark as read, dismiss, or sort by priority.`,
  },
  {
    slug: "copilot-search",
    name: "CopilotSearch",
    description:
      "Product search with AI-powered filtering and recommendations.",
    file: "copilot-search.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: ["badge", "input"],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotSearch } from "@/components/copilot-search";

<CopilotSearch />
\`\`\`

Or with custom products:

\`\`\`tsx
import { CopilotSearch, Product } from "@/components/copilot-search";

const products: Product[] = [
  { id: "1", name: "Headphones", category: "Electronics", price: 79, rating: 4.5, description: "Wireless", inStock: true },
];

<CopilotSearch products={products} />
\`\`\`

Ask the AI to filter by category, find items under a price, or get recommendations.`,
  },
  {
    slug: "copilot-research-agent",
    name: "ResearchAgent",
    description:
      "Multi-step AI research agent with pipeline progress, findings, and synthesis.",
    file: "copilot-research-agent.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotResearchAgent } from "@/components/copilot-research-agent";

<CopilotResearchAgent />
\`\`\`

Or with a pre-set topic:

\`\`\`tsx
<CopilotResearchAgent initialState={{ topic: "AI in healthcare" }} />
\`\`\`

Ask the AI to start research, add findings, or synthesize results.`,
  },
  {
    slug: "copilot-dashboard",
    name: "CopilotDashboard",
    description:
      "Metrics dashboard with AI-generated insights and anomaly detection.",
    file: "copilot-dashboard.tsx",
    dependencies: ["@copilotkit/react-core", "lucide-react"],
    registryDependencies: [],
    docs:
      SETUP_SECTION +
      `

## Usage

\`\`\`tsx
import { CopilotDashboard } from "@/components/copilot-dashboard";

<CopilotDashboard />
\`\`\`

Or with custom metrics:

\`\`\`tsx
import { CopilotDashboard, DashboardMetric } from "@/components/copilot-dashboard";

const metrics: DashboardMetric[] = [
  { id: "revenue", title: "Revenue", value: "$48.5k", change: "+12%", changeType: "positive", sparklineData: [30, 35, 40, 45] },
];

<CopilotDashboard metrics={metrics} />
\`\`\`

Ask the AI to generate insights, detect anomalies, or update metric values.`,
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
    docs: comp.docs,
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
