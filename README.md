# AgenticUI

**shadcn for CopilotKit** -- Copy-paste AI-native React components with built-in copilot superpowers.

[![CopilotKit](https://img.shields.io/badge/CopilotKit-v1.51.3-blue)](https://copilotkit.ai)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**[Live Demo](https://agentic-ui-registry.vercel.app)** | **[GitHub](https://github.com/nihalnihalani/agentic-ui)**

---

## What is AgenticUI?

AgenticUI is the **component registry for CopilotKit**. Every component ships with `useCopilotReadable` and `useCopilotAction` hooks pre-wired, so your AI copilot can read, manipulate, and interact with your UI out of the box. Think of it as [shadcn/ui](https://ui.shadcn.com) -- but every component is AI-native from day one.

Browse, preview, and install components with a single command. No npm packages to manage -- just copy-paste components that work.

## Components

AgenticUI ships with **13 production-ready components** across five categories:

| Component | Category | Description |
|-----------|----------|-------------|
| **CopilotTable** | Data | Smart data grid with AI sort, filter, highlight, and analysis |
| **CopilotDashboard** | Data | Metrics dashboard with AI-generated insights and anomaly detection |
| **CopilotChart** | Data | Bar and line charts with AI annotations and trend analysis |
| **CopilotSearch** | Data | Product search with AI-powered filtering and recommendations |
| **CopilotForm** | Forms | Intent-driven form -- describe what you want and it fills itself |
| **CopilotTextarea** | Forms | AI-powered text input with inline suggestions and autocompletion |
| **CopilotCanvas** | Canvas | Kanban board with AI-powered task management and drag-and-drop |
| **CopilotChat** | Chat | Chat interface with AI message management and conversation history |
| **CopilotCalendar** | Productivity | Weekly calendar with AI scheduling and event management |
| **CopilotEditor** | Productivity | Rich text editor with AI writing assistance and formatting |
| **CopilotTimeline** | Productivity | Timeline and roadmap view with AI milestone management |
| **CopilotNotifications** | Productivity | Notification center with AI triage, priority sorting, and actions |
| **ResearchAgent** | Agentic | Multi-step AI research agent with pipeline progress, findings, and synthesis |

Each component includes:
- `useCopilotReadable` to expose state to the AI
- `useCopilotAction` for AI-triggered mutations
- Visual feedback (highlights, glow effects) when the AI acts
- Full manual interaction support alongside AI capabilities

## CopilotKit Features

AgenticUI leverages the full power of the CopilotKit framework:

- **`useCopilotReadable`** -- Expose component state so the AI understands your UI context
- **`useCopilotAction`** -- Define actions the AI can take to manipulate component state
- **`useCopilotChatSuggestions`** -- Surface contextual prompt suggestions to guide users
- **Generative UI** -- AI responses render as live, interactive React components
- **CopilotSidebar** -- Built-in chat sidebar for conversational AI interaction

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16.1.6](https://nextjs.org) (App Router, Turbopack) |
| UI Library | [React 19.2.3](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| AI Copilot | [CopilotKit v1.51.3](https://copilotkit.ai) (`@copilotkit/react-core`, `@copilotkit/react-ui`, `@copilotkit/runtime`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Components | [Radix UI](https://www.radix-ui.com) primitives |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev) |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/nihalnihalani/agentic-ui.git
cd agentic-ui-registry
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=sk-your-key-here
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the registry.

## Using a Component

### Install via CLI

Each component can be installed with a single command:

```bash
npx shadcn@latest add "https://agentic-ui-registry.vercel.app/r/copilot-table"
```

### Manual usage

Copy the component file from `src/components/registry/` into your project, then wrap your app with CopilotKit:

```tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { CopilotTable } from "@/components/registry/copilot-table";

export default function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar>
        <CopilotTable data={myData} columns={myColumns} />
      </CopilotSidebar>
    </CopilotKit>
  );
}
```

The component's AI hooks activate automatically -- no additional configuration needed.

## AI-Powered Registry

The registry itself is built with CopilotKit. Open the sidebar and ask:

- "I need a component for data analysis"
- "Show me all productivity components"
- "Compare the table and canvas components"
- "Which component should I use for scheduling?"

The AI understands every component's capabilities and can help you pick the right one, preview it with Generative UI, and get the install command.

## Project Structure

```
src/
  app/
    page.tsx                              # Homepage with registry grid
    layout.tsx                            # Root layout with providers
    api/copilotkit/route.ts               # CopilotKit runtime endpoint
    api/metrics/route.ts                  # Dashboard metrics API endpoint
    features/page.tsx                     # Features showcase page
    components/
      copilot-table/page.tsx              # Table demo page
      copilot-form/page.tsx               # Form demo page
      copilot-canvas/page.tsx             # Canvas demo page
      copilot-dashboard/page.tsx          # Dashboard demo page
      copilot-chart/page.tsx              # Chart demo page
      copilot-chat/page.tsx               # Chat demo page
      copilot-search/page.tsx             # Search demo page
      copilot-calendar/page.tsx           # Calendar demo page
      copilot-editor/page.tsx             # Editor demo page
      copilot-timeline/page.tsx           # Timeline demo page
      copilot-notifications/page.tsx      # Notifications demo page
      copilot-textarea/page.tsx           # Textarea demo page
      research-agent/page.tsx             # Research agent demo page
  components/
    registry/
      copilot-table.tsx                   # CopilotTable component
      copilot-form.tsx                    # CopilotForm component
      copilot-canvas.tsx                  # CopilotCanvas component
      copilot-dashboard.tsx               # CopilotDashboard component
      copilot-chart.tsx                   # CopilotChart component
      copilot-chat.tsx                    # CopilotChat component
      copilot-search.tsx                  # CopilotSearch component
      copilot-calendar.tsx                # CopilotCalendar component
      copilot-editor.tsx                  # CopilotEditor component
      copilot-timeline.tsx                # CopilotTimeline component
      copilot-notifications.tsx           # CopilotNotifications component
      copilot-textarea.tsx                # CopilotTextarea component
      copilot-research-agent.tsx          # ResearchAgent component
    agentic/
      generative-preview.tsx              # Generative UI preview renderer
      smart-registry.tsx                  # AI-powered registry search
    layout/
      header.tsx                          # Site header
      shader-hero.tsx                     # Animated hero section
      component-grid.tsx                  # Component browsing grid
      component-card.tsx                  # Individual component card
      component-page-header.tsx           # Shared header for demo pages
      copilot-provider.tsx                # CopilotKit + sidebar wrapper
      copilot-discovery.tsx               # AI-powered component search
      footer.tsx                          # Site footer
    ui/                                   # shadcn/ui primitives
  lib/
    components-data.ts                    # Component registry metadata
    utils.ts                              # Utility functions
  types/
    index.ts                              # TypeScript type definitions
```

## Deploy

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnihalnihalani%2Fagentic-ui&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key&project-name=agentic-ui-registry&repository-name=agentic-ui-registry)

## Built With

- [CopilotKit](https://copilotkit.ai) -- The Agentic Application Framework
- [shadcn/ui](https://ui.shadcn.com) -- Re-usable UI components built on Radix UI
- [21st.dev](https://21st.dev) -- Inspiration for the registry model

## License

MIT
