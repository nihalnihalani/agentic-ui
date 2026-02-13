# AgenticUI.dev - Project Plan

**Goal:** Build a "21st.dev for CopilotKit" — a registry of high-quality, copy-pasteable React components that come pre-wired with AI capabilities. This project serves as a comprehensive demo for the Applied AI Engineer role, showcasing "Growth" (ease of adoption) and "Innovation" (defining Agentic UI).

---

## 🏗️ Architecture & Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS, Framer Motion, Lucide React
- **AI/Agent Framework:** CopilotKit (React Core, Runtime, UI)
- **Backend (Optional for Demo):** Simple In-Memory / Local Storage mock for the registry data.
- **Language:** TypeScript

---

## 🚀 Phases of Execution

### Phase 1: Foundation & Setup
**Objective:** Initialize a clean, production-ready environment.
1.  **Scaffold Project:** `create-next-app` with TypeScript & Tailwind.
2.  **Install Dependencies:** `@copilotkit/react-core`, `@copilotkit/react-ui`, `@copilotkit/runtime`.
3.  **Configure Runtime:** Set up `/api/copilotkit` route (using standard OpenAI Adapter for simplicity).
4.  **Layout Wrapper:** Wrap the application in `<CopilotKit>` and `<CopilotSidebar>`.

### Phase 2: The Registry Engine
**Objective:** Create the "Storefront" where users browse agentic components.
1.  **Mock Registry Data:** Create a `registry.ts` file containing metadata for components (ID, Name, Description, Code Snippet, "Agentic Features").
2.  **Registry UI:** A beautiful grid layout displaying available components.
3.  **Copilot Context (`useCopilotReadable`):** Feed the registry data to the Copilot so users can ask: *"Do you have a table component that handles sorting?"*
4.  **Copilot Actions (`useCopilotAction`):** Implement a `selectComponent` action that opens the details/preview of a requested component.

### Phase 3: The "Smart" Components (The Core Value)
**Objective:** Build 3 "Gold Standard" components that demonstrate *Agentic UI*.

#### A. The `SmartDataGrid`
*   **Description:** A table that displays data and allows natural language manipulation.
*   **Agentic Features:**
    *   `useCopilotReadable`: Feeds the visible row data to the AI.
    *   `useCopilotAction`: `filterData`, `sortData`, `highlightRow`.
*   **Scenario:** *"Show me only the users who signed up last week and highlight the ones with 'Premium' status."*

#### B. The `IntentForm`
*   **Description:** A complex settings form (e.g., User Profile or Notification Preferences).
*   **Agentic Features:**
    *   `useCopilotAction`: `fillForm` (takes a rough user intent and maps it to specific form fields).
*   **Scenario:** *"I want to turn off all marketing emails but keep security alerts on."* -> AI toggles 4 separate switches correctly.

#### C. The `CanvasWidget` (Advanced)
*   **Description:** A visual list/card view that represents a "Plan" or "Workflow."
*   **Agentic Features:**
    *   `useCopilotAction`: `addItem`, `removeItem`, `reorderItems`.
*   **Scenario:** *"Add 'Review PRs' to my morning routine before 'Standup'."*

### Phase 4: Advanced Integration (The "Wow" Factor)
**Objective:** Push the boundaries with Generative UI and Co-Agents.

1.  **Generative UI (Search):** Instead of just listing results, when a user asks for a component, the Copilot *renders* a custom "Component Preview Card" directly in the chat using `useRenderToolCall`.
2.  **Co-Agent Workflow (Optional Extension):** If time permits, integrate a LangGraph agent that can "plan" a full UI layout by selecting multiple components from the registry in sequence.

---

## 📝 Deliverables
1.  **Source Code:** GitHub repository with clean history.
2.  **Live Demo:** Vercel deployment.
3.  **Documentation:** A `README.md` that explains not just *how* to run it, but *why* these patterns matter for the future of AI engineering.

---

## 🧠 Why This Wins
- **Demonstrates "Growth":** It creates a reusable asset that helps *others* adopt CopilotKit.
- **Showcases "Taste":** Focus on polished UI (shadcn-like) + polished DX (copy-pasteable).
- **Technical Depth:** Uses multiple parts of the CopilotKit SDK (Readable, Actions, Generative UI).
