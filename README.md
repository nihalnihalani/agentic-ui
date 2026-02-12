# AgenticUI

**AI-Native Components for CopilotKit** -- Copy-paste React components with built-in AI superpowers.

AgenticUI is a component registry for [CopilotKit](https://copilotkit.ai). Every component ships with `useCopilotReadable` and `useCopilotAction` hooks pre-wired, so your AI copilot can read, manipulate, and interact with your UI out of the box.

## Components

| Component | Category | Description |
|-----------|----------|-------------|
| **CopilotTable** | Data | Smart data grid with AI sort, filter, highlight, and analysis |
| **CopilotForm** | Forms | Intent-driven form -- describe what you want and it fills itself |
| **CopilotCanvas** | Canvas | Kanban board with AI-powered task management and drag-and-drop |

Each component includes:
- `useCopilotReadable` to expose state to the AI
- `useCopilotAction` for AI-triggered mutations
- Visual feedback (highlights, glow effects) when the AI acts
- Full manual interaction support alongside AI capabilities

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **AI Copilot:** CopilotKit (`@copilotkit/react-core`, `@copilotkit/react-ui`, `@copilotkit/runtime`)
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
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

## Project Structure

```
src/
  app/
    page.tsx                          # Homepage with registry grid
    api/copilotkit/route.ts           # CopilotKit runtime endpoint
    components/
      copilot-table/page.tsx          # Table demo page
      copilot-form/page.tsx           # Form demo page
      copilot-canvas/page.tsx         # Canvas demo page
  components/
    registry/
      copilot-table.tsx               # CopilotTable component
      copilot-form.tsx                # CopilotForm component
      copilot-canvas.tsx              # CopilotCanvas component
    layout/
      header.tsx                      # Site header
      hero.tsx                        # Hero section
      component-grid.tsx              # Component browsing grid
      component-card.tsx              # Individual component card
      component-page-header.tsx       # Shared header for demo pages
      copilot-provider.tsx            # CopilotKit + sidebar wrapper
      copilot-discovery.tsx           # AI-powered component search
      footer.tsx                      # Site footer
    ui/                               # shadcn/ui primitives
  lib/
    components-data.ts                # Component registry data
    utils.ts                          # Utility functions
  types/
    index.ts                          # TypeScript types
```

## Using a Component in Your Project

1. Copy the component file from `src/components/registry/` into your project
2. Make sure you have CopilotKit installed: `npm install @copilotkit/react-core @copilotkit/react-ui`
3. Wrap your app with `<CopilotKit>` and add a chat UI (CopilotSidebar, CopilotPopup, etc.)
4. The component's AI hooks activate automatically

Example:

```tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotTable } from "@/components/registry/copilot-table";

export default function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotTable data={myData} columns={myColumns} />
      <CopilotPopup />
    </CopilotKit>
  );
}
```

## AI-Powered Registry Search

The registry homepage itself uses CopilotKit. Open the sidebar and ask:
- "I need a component for data analysis"
- "Show me form components"
- "Compare the table and canvas components"

## Deploy

```bash
npm run build
```

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Built With

- [CopilotKit](https://copilotkit.ai) -- The Agentic Application Framework
- [shadcn/ui](https://ui.shadcn.com) -- Re-usable UI components
- [21st.dev](https://21st.dev) -- Inspiration for the registry model
