import { ComponentMeta } from "@/types";

export const components: ComponentMeta[] = [
  {
    slug: "copilot-table",
    name: "CopilotTable",
    description:
      "A smart data grid that lets users sort, filter, and analyze data through natural language. AI highlights relevant rows and provides data insights on demand.",
    category: "data",
    tags: ["table", "data-grid", "sort", "filter", "analytics"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-table.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-table"',
    copyPrompt: `Add an AI-powered data table to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-table"

Then use it:
import { CopilotTable, ColumnDef } from "@/components/copilot-table";

const data = [
  { name: "Alice", role: "Engineer", salary: 120000 },
  { name: "Bob", role: "Designer", salary: 95000 },
];

const columns: ColumnDef[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "salary", label: "Salary" },
];

<CopilotTable data={data} columns={columns} />

Features: AI can sort, filter, and highlight rows via natural language. Uses useCopilotReadable and useCopilotAction from @copilotkit/react-core.`,
  },
  {
    slug: "copilot-form",
    name: "CopilotForm",
    description:
      "An intent-driven form that fills itself when users describe what they want. Say 'Set up a B2B SaaS profile' and watch every field populate intelligently.",
    category: "forms",
    tags: ["form", "input", "auto-fill", "intent", "settings"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-form.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-form"',
    copyPrompt: `Add an AI-powered auto-filling form to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-form"

Then use it:
import { CopilotForm, FieldConfig } from "@/components/copilot-form";

const fields: FieldConfig[] = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "role", label: "Role", type: "select", options: ["Engineer", "Designer", "PM"] },
  { name: "bio", label: "Bio", type: "textarea" },
];

<CopilotForm fields={fields} onSubmit={(values) => console.log(values)} />

Features: Tell the AI "fill this out for a senior engineer named Jane" and it populates all fields intelligently.`,
  },
  {
    slug: "copilot-canvas",
    name: "CopilotCanvas",
    description:
      "A kanban board that responds to voice and text commands. Add, move, reorder, and manage tasks through natural language while keeping full drag-and-drop support.",
    category: "canvas",
    tags: ["kanban", "board", "drag-drop", "tasks", "project"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-canvas.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-canvas"',
    copyPrompt: `Add an AI-powered kanban board to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-canvas"

Then use it:
import { CopilotCanvas, Column } from "@/components/copilot-canvas";

const columns: Column[] = [
  { id: "todo", title: "To Do", items: [{ id: "1", title: "Design homepage", priority: "high" }] },
  { id: "doing", title: "In Progress", items: [] },
  { id: "done", title: "Done", items: [] },
];

<CopilotCanvas initialColumns={columns} />

Features: AI can add tasks, move items between columns, reorder, and reprioritize via natural language.`,
  },
  {
    slug: "copilot-textarea",
    name: "CopilotTextarea",
    description:
      "An AI-powered text editor with real-time autocompletions, smart insertions, and contextual editing. Switch between writing modes like blog posts, emails, and documentation.",
    category: "forms",
    tags: ["textarea", "editor", "autocomplete", "writing", "AI-assist"],
    hooks: ["useCopilotReadable", "useCopilotAction", "CopilotTextarea"],
    preview: "/previews/copilot-textarea.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-textarea"',
    copyPrompt: `Add an AI-powered text editor with inline suggestions to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-textarea"

Then use it:
import { CopilotTextEditor } from "@/components/copilot-textarea";

<CopilotTextEditor purpose="writing a blog post" placeholder="Start typing..." />

Note: Also install @copilotkit/react-textarea. The editor provides real-time inline AI autocompletions as you type.`,
  },
  {
    slug: "copilot-chart",
    name: "CopilotChart",
    description:
      "AI-powered data visualization with bar and line charts. Ask natural language queries like 'show revenue as a line chart' and the AI updates chart type, data range, and highlights.",
    category: "data",
    tags: ["chart", "visualization", "bar-chart", "line-chart", "analytics"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-chart.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-chart"',
    copyPrompt: `Add AI-powered bar and line charts to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-chart"

Then use it:
import { CopilotChart, ChartDataPoint } from "@/components/copilot-chart";

const data: ChartDataPoint[] = [
  { month: "Jan", revenue: 28400, users: 820, growth: 4 },
  { month: "Feb", revenue: 31200, users: 910, growth: 7 },
];

<CopilotChart data={data} />

Features: AI can switch chart types, highlight data points, add annotations, and analyze trends.`,
  },
  {
    slug: "copilot-chat",
    name: "CopilotChat",
    description:
      "A custom chat interface with message bubbles, typing indicators, and AI-powered message management. Build a branded chat experience on top of CopilotKit.",
    category: "chat",
    tags: ["chat", "messaging", "conversation", "messages", "communication"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-chat.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-chat"',
    copyPrompt: `Add an AI-powered chat interface to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-chat"

Then use it:
import { CopilotChat } from "@/components/copilot-chat";

<CopilotChat />

Or with custom messages:
<CopilotChat initialMessages={[{ id: "1", sender: "You", content: "Hello!", timestamp: "9:00 AM" }]} />

Features: Message search, conversation summarization, and AI-managed chat history.`,
  },
  {
    slug: "copilot-dashboard",
    name: "CopilotDashboard",
    description:
      "A metrics dashboard with KPI cards, sparklines, and AI-driven insights. Ask questions about your data and the AI updates the view with highlights and comparisons.",
    category: "data",
    tags: ["dashboard", "metrics", "KPI", "sparkline", "insights"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-dashboard.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-dashboard"',
    copyPrompt: `Add an AI-powered metrics dashboard to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-dashboard"

Then use it:
import { CopilotDashboard, DashboardMetric } from "@/components/copilot-dashboard";

const metrics: DashboardMetric[] = [
  { id: "revenue", title: "Revenue", value: "$48.5k", change: "+12%", changeType: "positive", sparklineData: [30, 35, 40, 45] },
];

<CopilotDashboard metrics={metrics} />

Features: AI generates insights, detects anomalies, highlights metrics, and compares KPIs.`,
  },
  {
    slug: "copilot-calendar",
    name: "CopilotCalendar",
    description:
      "A weekly calendar view with AI scheduling. Add, move, and manage events through natural language like 'Schedule a team standup at 9am Monday'.",
    category: "productivity",
    tags: ["calendar", "schedule", "events", "planner", "time"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-calendar.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-calendar"',
    copyPrompt: `Add an AI-powered weekly calendar to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-calendar"

Then use it:
import { CopilotCalendar, CalendarEvent } from "@/components/copilot-calendar";

const events: CalendarEvent[] = [
  { id: "1", title: "Standup", day: "Mon", startHour: 9, endHour: 10, color: "blue" },
  { id: "2", title: "Design Review", day: "Wed", startHour: 14, endHour: 15, color: "violet" },
];

<CopilotCalendar initialEvents={events} />

Features: AI can schedule meetings, reschedule events, find free slots, and clear days.`,
  },
  {
    slug: "copilot-editor",
    name: "CopilotEditor",
    description:
      "A markdown editor with AI writing assistance. The AI can insert, replace, format, and improve text — ask it to 'add a conclusion' or 'convert bullets to a table'.",
    category: "forms",
    tags: ["editor", "markdown", "writing", "rich-text", "document"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-editor.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-editor"',
    copyPrompt: `Add an AI-powered markdown editor to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-editor"

Then use it:
import { CopilotEditor } from "@/components/copilot-editor";

<CopilotEditor />

Or with initial content:
<CopilotEditor initialContent="# My Document\nStart writing here..." />

Features: Split-pane editor with live preview, formatting toolbar. AI can rewrite, expand, summarize, and format text.`,
  },
  {
    slug: "copilot-timeline",
    name: "CopilotTimeline",
    description:
      "A vertical timeline for project milestones and events. AI manages the timeline — add milestones, update statuses, and reorder through natural language.",
    category: "productivity",
    tags: ["timeline", "milestones", "project", "roadmap", "events"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-timeline.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-timeline"',
    copyPrompt: `Add an AI-powered project timeline to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-timeline"

Then use it:
import { CopilotTimeline, TimelineMilestone } from "@/components/copilot-timeline";

const milestones: TimelineMilestone[] = [
  { id: "1", title: "Kickoff", description: "Project start", date: "Jan 1", status: "completed" },
  { id: "2", title: "MVP", description: "First release", date: "Mar 1", status: "in-progress" },
];

<CopilotTimeline initialMilestones={milestones} />

Features: AI can add milestones, update statuses, reorder the timeline, and remove items.`,
  },
  {
    slug: "copilot-notifications",
    name: "CopilotNotifications",
    description:
      "A notification center with AI-powered triage. AI categorizes, prioritizes, and manages notifications — ask it to 'mark all low-priority as read' or 'summarize unread'.",
    category: "productivity",
    tags: ["notifications", "alerts", "inbox", "triage", "messages"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-notifications.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-notifications"',
    copyPrompt: `Add an AI-powered notification center to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-notifications"

Then use it:
import { CopilotNotifications } from "@/components/copilot-notifications";

<CopilotNotifications />

Features: Filterable tabs, priority color-coding, dismissal animations. AI can triage, mark as read, dismiss, categorize, and sort by priority.`,
  },
  {
    slug: "copilot-search",
    name: "CopilotSearch",
    description:
      "An AI-powered search interface with faceted filters, result highlighting, and natural language queries. Search a product catalog by asking 'show items under $50 with 4+ stars'.",
    category: "data",
    tags: ["search", "filter", "facets", "results", "catalog"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/copilot-search.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-search"',
    copyPrompt: `Add an AI-powered product search to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-search"

Then use it:
import { CopilotSearch, Product } from "@/components/copilot-search";

const products: Product[] = [
  { id: "1", name: "Headphones", category: "Electronics", price: 79, rating: 4.5, description: "Wireless", inStock: true },
];

<CopilotSearch products={products} />

Features: AI can filter by category, find items under a price, sort results, and give recommendations.`,
  },
  {
    slug: "research-agent",
    name: "ResearchAgent",
    description:
      "An AI research agent that conducts multi-step investigations with a visual pipeline. It searches, analyzes, and synthesizes findings into structured reports with relevance scoring.",
    category: "agentic",
    tags: ["agent", "research", "pipeline", "multi-step", "synthesis"],
    hooks: ["useCopilotReadable", "useCopilotAction"],
    preview: "/previews/research-agent.png",
    installCommand: 'npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/research-agent"',
    copyPrompt: `Add an AI-powered research agent to my project using CopilotKit.

Install it:
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-research-agent"

Then use it:
import { CopilotResearchAgent } from "@/components/copilot-research-agent";

<CopilotResearchAgent />

Or with a pre-set topic:
<CopilotResearchAgent initialState={{ topic: "AI in healthcare" }} />

Features: Multi-step research pipeline with searching, analyzing, and synthesizing stages. AI conducts research, adds findings with relevance scores, and generates a synthesis.`,
  },
];

export const categories = [
  { id: "all", label: "All Components", icon: "Grid3X3", count: components.length },
  { id: "data", label: "Data Display", icon: "Table", count: components.filter((c) => c.category === "data").length },
  { id: "forms", label: "Forms & Input", icon: "FormInput", count: components.filter((c) => c.category === "forms").length },
  { id: "canvas", label: "Canvas & Board", icon: "Layout", count: components.filter((c) => c.category === "canvas").length },
  { id: "chat", label: "Chat & Messaging", icon: "MessageSquare", count: components.filter((c) => c.category === "chat").length },
  { id: "productivity", label: "Productivity", icon: "CalendarDays", count: components.filter((c) => c.category === "productivity").length },
  { id: "agentic", label: "Agentic", icon: "Brain", count: components.filter((c) => c.category === "agentic").length },
];

export function getComponentBySlug(slug: string): ComponentMeta | undefined {
  return components.find((c) => c.slug === slug);
}

export function getComponentsByCategory(category: string): ComponentMeta[] {
  if (category === "all") return components;
  return components.filter((c) => c.category === category);
}
