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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-table"',
    copyPrompt: `Create a CopilotTable — an AI-powered, sortable, filterable data grid built with CopilotKit and React.

## Core Concept
CopilotTable is a fully interactive data table that exposes its entire state (rows, columns, sort, filters, highlights) to an AI copilot via useCopilotReadable, and lets the AI sort, filter, and highlight rows through useCopilotAction. Users can also interact manually by clicking column headers to sort or typing in per-column filter inputs. The AI and the user share the same reactive state, so AI-driven changes are immediately visible and user changes are immediately readable by the AI.

## Dependencies
- react (useState, useMemo, useCallback)
- @copilotkit/react-core (useCopilotReadable, useCopilotAction)
- lucide-react (ArrowUpDown, ArrowUp, ArrowDown, X, Search, Filter, Sparkles)
- A cn classname merge utility (e.g. clsx + tailwind-merge)
- Tailwind CSS

## Complete TypeScript Interfaces

type AnyRow = Record<string, unknown>;

interface ColumnDef<T = AnyRow> {
  key: keyof T & string;       // The property name on each row object used to read cell values
  label: string;               // Human-readable column header text
  sortable?: boolean;          // Whether the column can be sorted (defaults to true if omitted)
  filterable?: boolean;        // Whether the column shows an inline filter input (defaults to true if omitted)
  render?: (value: T[keyof T], row: T) => React.ReactNode; // Optional custom cell renderer
}

interface SortState {
  columnKey: string;           // Which column is currently sorted
  direction: "asc" | "desc";  // Sort direction
}

interface FilterState {
  columnKey: string;           // The column being filtered
  value: string;               // The filter value to match against
  operator: "contains" | "equals" | "gt" | "lt" | "gte" | "lte"; // How to compare
}

## Component Props

interface CopilotTableProps<T = AnyRow> {
  data: T[];                   // Array of row objects — the full dataset
  columns: ColumnDef<T>[];     // Column definitions controlling which fields to show and how
  className?: string;          // Optional additional CSS class for the outermost wrapper
}

The component is generic: CopilotTable<T extends AnyRow>, so it accepts any row shape.

## State Management

1. sort — useState<SortState | null>(null) — Tracks which column is sorted and in which direction. Null means no sort is applied.
2. filters — useState<Record<string, string>>({}) — A map of columnKey to text value for the inline per-column text filter inputs that the user types into manually.
3. activeFilters — useState<FilterState[]>([]) — An array of AI-applied filters with operator semantics (contains, equals, gt, lt, gte, lte). These are separate from the inline text filters and stack cumulatively.
4. highlightedRows — useState<number[]>([]) — An array of 0-based row indices (relative to the currently filtered/sorted data) that should be visually highlighted with an amber glow.

A useMemo hook named filteredAndSortedData derives the visible rows by: (a) applying inline text filters (case-insensitive includes), (b) applying AI-driven activeFilters using the applyFilter callback, and (c) sorting numerically or lexicographically depending on the data. The applyFilter function is wrapped in useCallback and handles all six operators: "contains" uses String.includes, "equals" uses strict equality, "gt"/"lt"/"gte"/"lte" parse to float and compare numerically.

## useCopilotReadable Configuration

useCopilotReadable({
  description: "Current data table state including all rows, active sort, and active filters",
  value: {
    totalRows: data.length,
    visibleRows: filteredAndSortedData.length,
    columns: columns.map((c) => c.key),
    currentSort: sort,
    activeFilters,
    highlightedRows,
    data: filteredAndSortedData,
  },
});

## useCopilotAction Definitions

### Action 1: sortTable
- Name: "sortTable"
- Description: "Sort the table by a specific column in ascending or descending order"
- Parameters:
  - columnKey (string, required) — description dynamically includes available columns: "The column to sort by. Available columns: " + columns.map(c => c.key).join(", ")
  - direction (string, required) — "Sort direction: 'asc' for ascending or 'desc' for descending"
- Handler logic: Validates that columnKey matches an existing column via columns.find(c => c.key === columnKey). If not found, returns an error string. Otherwise calls setSort({ columnKey, direction }) and returns a confirmation message.
- Render (inProgress): A rounded-lg bordered div with an ArrowUpDown icon (h-4 w-4, animate-spin, text-blue-400) and text "Sorting table...". Border uses border-border/50, background bg-card/50.
- Render (complete): A div with border-blue-500/30, bg-blue-500/10, text-blue-400. Shows an ArrowUp icon and text "Sorted by {columnKey} {direction}ending".

### Action 2: filterTable
- Name: "filterTable"
- Description: "Filter the table rows by a specific column and value. Use operator to control matching: contains, equals, gt (greater than), lt (less than), gte (>=), lte (<=)"
- Parameters:
  - columnKey (string, required) — same dynamic description listing available columns
  - value (string, required) — "The value to filter for"
  - operator (string, required) — "The filter operator: contains, equals, gt, lt, gte, lte"
- Handler logic: Validates the column exists. Creates a new FilterState object and appends it to activeFilters via setActiveFilters(prev => [...prev, newFilter]). Returns a confirmation string.
- Render (inProgress): Filter icon (h-4 w-4, animate-pulse, text-purple-400) with "Applying filter..." text.
- Render (complete): Border-purple-500/30, bg-purple-500/10, text-purple-400. Shows Filter icon and "Filtered {columnKey} {operator} '{value}'".

### Action 3: highlightRows
- Name: "highlightRows"
- Description: "Highlight specific rows in the table to draw attention to them. Provide the row indices (0-based) from the currently visible/filtered data."
- Parameters:
  - rowIndices (number[], required) — "Array of row indices (0-based) to highlight"
- Handler logic: Directly calls setHighlightedRows(rowIndices). Returns "Highlighted N row(s)".
- Render (inProgress): Sparkles icon (h-4 w-4, animate-pulse, text-amber-400) with "Highlighting rows...".
- Render (complete): Border-amber-500/30, bg-amber-500/10, text-amber-400. Shows Sparkles icon and "Highlighted {count} row(s)".

### Action 4: clearFilters
- Name: "clearFilters"
- Description: "Remove all active filters, sort, and highlighted rows to reset the table to its original state"
- Parameters: Empty array (no parameters).
- Handler logic: Resets all state: setFilters({}), setActiveFilters([]), setSort(null), setHighlightedRows([]). Returns "All filters, sorting, and highlights cleared".
- No custom render — this action does not define a render function.

## Layout & Structure (top to bottom)

1. Outer wrapper: <div className={cn("w-full", className)}>
2. Active state badges bar (conditional, only when hasActiveState is true — active filters, a sort, or highlighted rows):
   - Flex row with flex-wrap, gap-2, mb-3.
   - Sort badge: inline-flex pill with border-blue-500/30, bg-blue-500/10, text-blue-400, text-xs. Shows "Sort: {columnKey} ascending/descending" with an X button to clear.
   - Active filter badges: One per filter, styled with border-purple-500/30, bg-purple-500/10, text-purple-400. Shows "{columnKey} {operator} '{value}'" with an X button.
   - Highlighted rows badge: border-amber-500/30, bg-amber-500/10, text-amber-400. Shows "{count} row(s) highlighted" with X button.
   - "Clear all" button on the right (ml-auto), text-xs, text-muted-foreground, hover:text-foreground.
3. Table container: <div className="overflow-hidden rounded-lg border border-border/50"> wrapping an overflow-x-auto div and a <table className="w-full text-sm">.
4. Table header (thead):
   - First row: Column headers with px-4 py-3, text-left, font-medium, text-muted-foreground. Sortable columns get cursor-pointer, select-none, hover:text-foreground, and show sort direction icons (ArrowUp/ArrowDown in text-blue-400 when active, ArrowUpDown when inactive). The aria-sort attribute is set for sortable columns. The scope="col" attribute is always set.
   - Second row: Inline filter inputs. Each filterable column shows a Search icon (absolute positioned left-2, h-3 w-3, text-muted-foreground/50) inside a relative div, with a text input that has h-7, rounded, border-border/30, bg-background/50, pl-7, text-xs, and an aria-label="Filter {col.label}". Non-filterable columns show an empty h-7 div.
5. Table body (tbody):
   - Empty state: single row with colSpan spanning all columns, centered "No matching rows found.", px-4 py-8, text-muted-foreground.
   - Data rows: border-b border-border/20, transition-all duration-300. Highlighted rows get bg-amber-500/10, border-amber-500/30, and inset box-shadow shadow-[inset_0_0_0_1px_rgba(245,158,11,0.2)]. Non-highlighted rows have hover:bg-muted/20. Cells are px-4 py-3 using custom render if provided, otherwise String(row[col.key] ?? "").
6. Footer: mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground. Shows "Showing X of Y rows" and highlighted count in text-amber-400.
7. Accessibility live region: <div aria-live="polite" className="sr-only"> announcing "Showing X of Y rows, sorted by {key} {direction}".

## Styling Specifications
- Table border: rounded-lg, border border-border/50, overflow-hidden
- Header background: bg-muted/30, border-b border-border/50
- Filter row: bg-muted/10, border-b border-border/30
- Body row borders: border-b border-border/20
- Highlighted row: bg-amber-500/10, border-amber-500/30, inset shadow rgba(245,158,11,0.2)
- Sort color theme: blue-400, blue-500/30, blue-500/10
- Filter color theme: purple-400, purple-500/30, purple-500/10
- Highlight color theme: amber-400, amber-500/30, amber-500/10

## Manual Interaction
- Clicking a sortable column header cycles: ascending -> descending -> no sort (null). The handleSort function checks if same column is sorted asc, toggles to desc; if desc, clears; otherwise starts asc.
- Typing in filter inputs updates filters state via handleFilterChange.
- X button on active filter badge calls removeActiveFilter(index).

## Sample Data

const sampleData = [
  { id: 1, name: "Alice Johnson", role: "Engineer", department: "Frontend", salary: 120000 },
  { id: 2, name: "Bob Smith", role: "Designer", department: "Design", salary: 105000 },
  { id: 3, name: "Carol Lee", role: "PM", department: "Product", salary: 130000 },
  { id: 4, name: "Dan Brown", role: "Engineer", department: "Backend", salary: 125000 },
  { id: 5, name: "Eve Davis", role: "Data Scientist", department: "ML", salary: 140000 },
];

const sampleColumns: ColumnDef[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "salary", label: "Salary", render: (val) => "$" + Number(val).toLocaleString() },
];

## Accessibility
- Column headers have scope="col" and sortable columns have aria-sort ("ascending", "descending", or "none").
- Filter inputs have aria-label="Filter {column label}".
- A screen-reader-only <div aria-live="polite"> announces visible row count and sort state.

## Complete Usage Example

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotTable, ColumnDef } from "@/components/copilot-table";

const data = [
  { id: 1, name: "Alice Johnson", role: "Engineer", department: "Frontend", salary: 120000 },
  { id: 2, name: "Bob Smith", role: "Designer", department: "Design", salary: 105000 },
  { id: 3, name: "Carol Lee", role: "PM", department: "Product", salary: 130000 },
];

const columns: ColumnDef[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "salary", label: "Salary", render: (val) => "$" + Number(val).toLocaleString() },
];

export default function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="p-8">
        <CopilotTable data={data} columns={columns} />
      </div>
      <CopilotPopup
        instructions="You are a data assistant. Help the user sort, filter, and analyze the table data."
        labels={{ title: "Table Assistant", initial: "Ask me to sort, filter, or highlight rows!" }}
      />
    </CopilotKit>
  );
}`,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-form"',
    copyPrompt: `Create a CopilotForm — an AI-powered intent-driven form built with CopilotKit and React that fills itself when users describe what they want in natural language.

## Core Concept
CopilotForm is a dynamic form component that exposes its field definitions and current values to an AI copilot via useCopilotReadable, and lets the AI fill, clear, or suggest values for any field through useCopilotAction. When the AI fills a field, that field gets a brief emerald glow animation and an "AI filled" badge appears next to its label. Users can still type manually to override AI values. The form supports three field types (text, select, textarea), client-side validation for required fields, and an onSubmit callback.

## Dependencies
- react (useState, useCallback, useRef)
- @copilotkit/react-core (useCopilotReadable, useCopilotAction)
- lucide-react (Sparkles, CheckCircle, Loader2)
- A cn classname merge utility (e.g. clsx + tailwind-merge)
- A shadcn/ui Input component (@/components/ui/input)
- A shadcn/ui Button component (@/components/ui/button)
- A shadcn/ui Badge component (@/components/ui/badge)
- Tailwind CSS

## Complete TypeScript Interfaces

export interface FieldConfig {
  name: string;                // Unique field identifier used as key in the values record
  label: string;               // Human-readable label displayed above the field
  type: "text" | "select" | "textarea"; // Determines which input element to render
  options?: string[];          // Only used when type is "select" — array of option strings
  placeholder?: string;        // Placeholder text for the input
  required?: boolean;          // If true, validation prevents submit when field is empty
}

interface CopilotFormProps {
  fields: FieldConfig[];       // Array of field configurations defining the form structure
  onSubmit: (values: Record<string, string>) => void; // Callback with all field values on valid submit
  className?: string;          // Optional additional CSS class for the form element
}

## Component Props

- fields (FieldConfig[], required): Array of field configuration objects. Each field defines its name, label, type, and optional properties. The form renders one input per field in order.
- onSubmit ((values: Record<string, string>) => void, required): Called when the user clicks Submit and all required fields are filled. Receives a Record mapping field names to their string values.
- className (string, optional): Appended to the root <form> element.

## State Management

1. values — useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.name, ""]))) — A record mapping each field name to its current string value. Initialized with empty strings for all fields.
2. errors — useState<Record<string, string>>({}) — A record mapping field names to error messages. Only populated during validation on submit.
3. aiFilledFields — useState<Set<string>>(new Set()) — Tracks which field names have been filled by the AI. Used to show the "AI filled" badge. When the user manually types in a field, that field is removed from this set.
4. highlightedFields — useState<Set<string>>(new Set()) — Tracks which fields are currently showing the emerald glow animation.
5. timeoutRefs — useRef<Record<string, NodeJS.Timeout>>({}) — Stores timeout handles for the glow animation cleanup, keyed by field name.

## Highlight Animation System

The triggerHighlight(fieldName: string) callback (useCallback):
1. Adds the fieldName to the highlightedFields Set.
2. Clears any existing timeout for that field name.
3. Sets a 1500ms timeout that removes the field from highlightedFields.
This produces an emerald glow shadow that appears on the field wrapper and fades after 1.5 seconds.

The setFieldValue(fieldName: string, value: string) callback (useCallback):
1. Updates the values record with the new value.
2. Adds the fieldName to aiFilledFields.
3. Calls triggerHighlight(fieldName) to start the glow animation.

## useCopilotReadable Configuration

useCopilotReadable({
  description: "Current form field definitions and their values",
  value: {
    fields: fields.map((f) => ({
      name: f.name,
      label: f.label,
      type: f.type,
      options: f.options,
      currentValue: values[f.name] || "",
    })),
  },
});

## useCopilotAction Definitions

### Action 1: fillForm
- Name: "fillForm"
- Description: "Fill multiple form fields at once. Use this when the user describes what values to set."
- Parameters:
  - fields (object[], required) — "Array of field name and value pairs to fill"
    - attributes:
      - fieldName (string) — "The name of the field to fill"
      - value (string) — "The value to set for the field"
- Handler logic: Iterates over the fieldUpdates array. For each { fieldName, value }, checks if fieldName exists in the current values record, and if so calls setFieldValue(fieldName, value).
- Render (inProgress): A rounded-lg bordered div (border-border/50, bg-card/50) with a Loader2 spinner (h-4 w-4, animate-spin, text-emerald-400) and text "Filling form...".
- Render (complete): A div with border-emerald-500/30, bg-emerald-500/10, text-emerald-400. Contains a "Form updated" header followed by a <ul> listing each filled field with a CheckCircle icon (h-3 w-3), the field name in text-emerald-300, a right arrow, and the value.

### Action 2: clearForm
- Name: "clearForm"
- Description: "Reset all form fields to empty values"
- Parameters: Empty array (no parameters).
- Handler logic: Resets values to empty strings for all fields using Object.fromEntries(fields.map(f => [f.name, ""])). Clears the aiFilledFields Set.
- No custom render.

### Action 3: suggestValues
- Name: "suggestValues"
- Description: "Suggest a value for a specific empty field based on context"
- Parameters:
  - fieldName (string, required) — "The name of the field to suggest a value for"
  - suggestion (string, required) — "The suggested value"
- Handler logic: If fieldName exists in the values record, calls setFieldValue(fieldName, suggestion).
- No custom render.

## Layout & Structure

The root element is a <form> with role="form", aria-label="Form", and className={cn("space-y-4", className)}. It calls handleSubmit on submit. From top to bottom:

1. Field list: For each field in the fields array:
   - Outer div with space-y-1.5
   - Label row: flex items-center gap-2. Contains:
     - A <label> with htmlFor={field.name}, text-sm font-medium text-foreground. Shows the field label text, plus a red asterisk (<span className="text-destructive ml-0.5">*</span>) if required.
     - "AI filled" badge (conditional, shown when aiFilledFields has this field): A Badge component with variant="secondary", classes "gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0", containing a Sparkles icon (size-2.5) and "AI filled" text.
   - Glow wrapper div: rounded-md transition-shadow duration-700. When highlightedFields has this field, adds shadow-[0_0_0_2px_rgba(16,185,129,0.4),0_0_12px_rgba(16,185,129,0.2)] for the emerald glow effect.
   - Input element (depends on field.type):
     - "select": A native <select> with h-9, w-full, rounded-md, border-input, bg-transparent, focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 text-foreground. Shows a default empty option with placeholder text, then maps field.options to <option> elements.
     - "textarea": A native <textarea> with min-h-[72px], w-full, rounded-md, border-input, bg-transparent, px-3 py-2, rows=3, same focus styles as select.
     - "text" (default): Uses the shadcn Input component with id, value, onChange, placeholder, and aria-invalid.
   - Error message: conditional <p> with text-xs text-destructive mt-1 showing the error text.

2. Submit button: A <Button> with type="submit", className="w-full mt-2", text "Submit".

## Manual Interaction
- handleChange(fieldName, value): Updates values for that field AND removes the field from aiFilledFields (since the user is now manually editing).
- handleSubmit(e): Prevents default. Validates all required fields — if any required field has an empty/whitespace-only value, adds "{label} is required" to the errors record. If errors exist, sets errors state and returns. Otherwise clears errors and calls onSubmit(values).

## Styling Specifications
- Form spacing: space-y-4
- Label: text-sm font-medium text-foreground
- Required indicator: text-destructive ml-0.5 (red asterisk)
- AI filled badge: bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0, gap-1
- Glow effect: shadow-[0_0_0_2px_rgba(16,185,129,0.4),0_0_12px_rgba(16,185,129,0.2)] with transition-shadow duration-700
- Action render colors: emerald-400/500 for fillForm
- Error text: text-xs text-destructive mt-1
- Select/textarea: border-input, dark:bg-input/30, focus ring with ring-ring/50
- Submit button: w-full mt-2

## Animation Details
- The emerald glow effect uses a CSS box-shadow with two layers: a 2px solid ring at rgba(16,185,129,0.4) and a 12px blur at rgba(16,185,129,0.2).
- The glow is controlled by the highlightedFields Set and auto-clears after 1500ms.
- The transition-shadow duration-700 class provides a smooth fade-in and fade-out.

## Sample Data

const sampleFields: FieldConfig[] = [
  { name: "companyName", label: "Company Name", type: "text", placeholder: "Enter company name", required: true },
  { name: "industry", label: "Industry", type: "select", options: ["SaaS", "Fintech", "Healthcare", "E-commerce", "Education"], required: true },
  { name: "companySize", label: "Company Size", type: "select", options: ["1-10", "11-50", "51-200", "201-1000", "1000+"] },
  { name: "website", label: "Website", type: "text", placeholder: "https://..." },
  { name: "description", label: "Description", type: "textarea", placeholder: "Tell us about your company..." },
];

## Accessibility
- Each input has a matching <label> with htmlFor pointing to the field name.
- Select and textarea elements set aria-invalid when there is a validation error.
- The form element has role="form" and aria-label="Form".
- Required fields are visually indicated with a red asterisk.

## Complete Usage Example

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotForm, FieldConfig } from "@/components/copilot-form";

const fields: FieldConfig[] = [
  { name: "name", label: "Full Name", type: "text", placeholder: "John Doe", required: true },
  { name: "email", label: "Email", type: "text", placeholder: "john@example.com", required: true },
  { name: "role", label: "Role", type: "select", options: ["Developer", "Designer", "PM", "Other"] },
  { name: "bio", label: "Bio", type: "textarea", placeholder: "Tell us about yourself..." },
];

export default function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="max-w-md mx-auto p-8">
        <CopilotForm
          fields={fields}
          onSubmit={(values) => console.log("Submitted:", values)}
        />
      </div>
      <CopilotPopup
        instructions="You are a form assistant. Help the user fill out the form. You can fill multiple fields at once or suggest values for individual fields."
        labels={{ title: "Form Assistant", initial: "Describe what you want and I will fill the form!" }}
      />
    </CopilotKit>
  );
}`,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-canvas"',
    copyPrompt: `Create a CopilotCanvas — an AI-powered kanban board built with CopilotKit and React with full drag-and-drop support and five AI actions for adding items, removing items, moving items between columns, reordering items, and adding new columns.

## Core Concept
CopilotCanvas is a kanban-style board with multiple columns, each containing draggable item cards. The AI can add, remove, move, and reorder items plus add entirely new columns through natural language commands. The board state is exposed to the AI via useCopilotReadable so it always knows the current layout. Users can also interact manually through native HTML5 drag-and-drop and a manual "Add item" button on each column. When the AI modifies an item, a violet pulse animation highlights the affected card for 1.5 seconds.

## Dependencies
- react (useState, useCallback, useRef)
- @copilotkit/react-core (useCopilotReadable, useCopilotAction)
- lucide-react (Plus, LayoutGrid, ArrowRight, Loader2)
- A cn classname merge utility (e.g. clsx + tailwind-merge)
- A shadcn/ui Badge component (@/components/ui/badge)
- Tailwind CSS

## Complete TypeScript Interfaces

export interface CanvasItem {
  id: string;                  // Unique identifier, e.g. "item-{timestamp}-{random}"
  title: string;               // Item title displayed on the card
  description?: string;        // Optional description text shown below the title
  priority?: "low" | "medium" | "high"; // Optional priority level for color-coded badge
}

export interface Column {
  id: string;                  // Unique column identifier, e.g. "col-todo", "col-{timestamp}-{random}"
  title: string;               // Column header text
  items: CanvasItem[];         // Array of items in this column
}

interface CopilotCanvasProps {
  initialColumns: Column[];    // Initial board layout with columns and their items
  onUpdate?: (columns: Column[]) => void; // Optional callback fired whenever columns change
  className?: string;          // Optional additional CSS class for the root container
}

## Component Props

- initialColumns (Column[], required): The initial board state. Each column has an id, title, and an items array.
- onUpdate ((columns: Column[]) => void, optional): Called with the full updated columns array every time the board changes (from AI actions, drag-drop, or manual add).
- className (string, optional): Appended to the root container div.

## Priority Color Map

const priorityColors: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
};

## State Management

1. columns — useState<Column[]>(initialColumns) — The full board state: all columns with their items.
2. highlightedItems — useState<Set<string>>(new Set()) — Tracks which item IDs are currently showing the pulse animation.
3. draggedItem — useState<{ item: CanvasItem; sourceColumnId: string } | null>(null) — Tracks the currently dragged item and its source column during drag-and-drop operations.
4. dragOverColumn — useState<string | null>(null) — The column ID being hovered over during a drag operation, used for visual drop zone feedback.
5. highlightTimeouts — useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map()) — Maps item IDs to their pulse animation timeout handles.

## Helper Functions

updateColumns(updater: (prev: Column[]) => Column[]): A useCallback wrapper around setColumns that also calls onUpdate with the new state.

highlightItem(itemId: string): A useCallback that:
1. Clears any existing timeout for that item ID.
2. Adds the item ID to highlightedItems Set.
3. Sets a 1500ms timeout to remove the ID and clean up the timeout map.

## useCopilotReadable Configuration

useCopilotReadable({
  description: "The current state of the kanban board with all columns and their items",
  value: columns,
});

This exposes the full columns array (including each column's id, title, and items with all their fields) to the AI.

## useCopilotAction Definitions

### Action 1: addItem
- Name: "addItem"
- Description: "Add a new item/task to a specific column on the board"
- Parameters:
  - columnId (string, required) — "The ID of the column to add the item to"
  - title (string, required) — "The title of the new item"
  - description (string, optional) — "Optional description for the item"
  - priority (string, optional) — 'Priority level: "low", "medium", or "high"'
- Handler logic: Generates a unique ID with "item-{Date.now()}-{random}". Validates the target column exists. Appends the new CanvasItem to the target column's items array via updateColumns. Calls highlightItem(newId).
- Render (inProgress): Loader2 spinner (h-4 w-4, animate-spin, text-violet-400) with "Adding item...".
- Render (complete): A div with border-violet-500/30, bg-violet-500/10, text-violet-400. Shows Plus icon (h-4 w-4) and "Added {title}". If priority is set, shows a small capitalize pill. If description is set, shows it truncated in text-xs text-violet-400/70.

### Action 2: removeItem
- Name: "removeItem"
- Description: "Remove an item from the board"
- Parameters:
  - itemId (string, required) — "The ID of the item to remove"
- Handler logic: Maps over all columns, filtering out the item with matching ID from each column's items array via updateColumns.
- No custom render.

### Action 3: moveItem
- Name: "moveItem"
- Description: "Move an item from its current column to a different column"
- Parameters:
  - itemId (string, required) — "The ID of the item to move"
  - targetColumnId (string, required) — "The ID of the column to move the item to"
- Handler logic: Validates the target column exists. Finds and removes the item from its current column. If not found, returns prev unchanged. Appends the item to the target column's items. Calls highlightItem(itemId).
- Render (inProgress): Loader2 (h-4 w-4, animate-spin, text-blue-400) with "Moving item...".
- Render (complete): A div with border-blue-500/30, bg-blue-500/10, text-blue-400. Shows ArrowRight icon and "Moved {itemId} -> {targetColumnId}".

### Action 4: reorderItems
- Name: "reorderItems"
- Description: "Reorder items within a column by providing the new order of item IDs"
- Parameters:
  - columnId (string, required) — "The ID of the column to reorder"
  - itemIds (string[], required) — "Array of item IDs in the desired order"
- Handler logic: Finds the target column. Creates a Map from existing items by ID. Maps the provided itemIds through the Map, filtering out any that were not found. Replaces the column's items with the reordered array. Calls highlightItem on each ID.
- No custom render.

### Action 5: addColumn
- Name: "addColumn"
- Description: "Add a new column to the board"
- Parameters:
  - title (string, required) — "The title of the new column"
- Handler logic: Generates a unique ID with "col-{Date.now()}-{random}". Appends a new Column object with empty items array via updateColumns.
- Render (inProgress): Loader2 (h-4 w-4, animate-spin, text-emerald-400) with "Adding column...".
- Render (complete): A div with border-emerald-500/30, bg-emerald-500/10, text-emerald-400. Shows LayoutGrid icon and "Added column {title}".

## Drag-and-Drop System

The component uses native HTML5 drag-and-drop:

- handleDragStart(item, sourceColumnId): Sets draggedItem state with the item and its source column.
- handleDragOver(e, columnId): Calls e.preventDefault() and sets dragOverColumn to the hovered column ID.
- handleDragLeave(): Clears dragOverColumn to null.
- handleDrop(e, targetColumnId): Prevents default. If no draggedItem or same column, clears and returns. Otherwise removes the item from source column and appends to target column via updateColumns. Calls highlightItem on the moved item. Clears draggedItem.
- handleDragEnd(): Clears both draggedItem and dragOverColumn.

## Layout & Structure

The root element is <div className={cn("flex gap-4 overflow-x-auto p-4", className)}>. This creates a horizontal scrolling container for the columns.

For each column:
1. Column container: A div with w-72 shrink-0 flex-col rounded-xl border-border/50 bg-card/50 backdrop-blur-sm. When dragOverColumn matches, adds border-violet-500/50 bg-violet-500/5. Has role="group" and aria-label={column.title}. Registers onDragOver, onDragLeave, onDrop handlers.
2. Column header: border-b border-border/30 px-4 py-3 flex items-center justify-between. Shows h3 with text-sm font-semibold text-foreground for the title, and a count badge (size-5 rounded-full bg-muted text-xs font-medium text-muted-foreground) showing item count.
3. Items list: flex-1 flex-col gap-2 p-3.
   - Empty state: A dashed border container with "Drop items here" text.
   - Item cards: Each card is a draggable div with cursor-grab, rounded-lg, border-border/40, bg-background/80, p-3, transition-all, hover:border-border/80, hover:shadow-sm, active:cursor-grabbing. When highlightedItems has the item ID: animate-pulse border-violet-500/60 shadow-[0_0_12px_rgba(139,92,246,0.3)]. When being dragged: opacity-40.
     - Title and priority row: flex items-start justify-between gap-2. Title in text-sm font-medium leading-snug. Priority Badge with capitalize text-[10px] and priority color classes.
     - Description (optional): mt-1.5 text-xs leading-relaxed text-muted-foreground.
     - ID display: mt-2 font-mono text-[10px] text-muted-foreground/60, showing first 8 chars of the item ID.
   - "Add item" button: flex w-full items-center justify-center gap-1, rounded-lg dashed border, text-xs text-muted-foreground/60, hover:border-border hover:text-muted-foreground. Shows Plus icon (size-3) and "Add item" text. On click, uses window.prompt for a title and adds a new medium-priority item.

## Styling Specifications
- Column width: w-72 (288px), shrink-0
- Column border: rounded-xl border-border/50 bg-card/50 backdrop-blur-sm
- Drop zone highlight: border-violet-500/50 bg-violet-500/5
- Card: rounded-lg border-border/40 bg-background/80 p-3
- Card hover: border-border/80 shadow-sm
- AI highlight pulse: animate-pulse border-violet-500/60 shadow-[0_0_12px_rgba(139,92,246,0.3)]
- Priority colors: emerald (low), amber (medium), red (high) — each at /20 bg, /400 text, /30 border
- Action color themes: violet (addItem), blue (moveItem), emerald (addColumn)

## Animation Details
- Highlight pulse uses Tailwind animate-pulse class plus a violet box-shadow glow.
- The highlight auto-clears after 1500ms.
- Cards have transition-all for smooth state changes.
- Drag opacity: dragged card gets opacity-40.

## Sample Data

const sampleColumns: Column[] = [
  {
    id: "col-todo",
    title: "To Do",
    items: [
      { id: "item-1", title: "Design landing page", description: "Create wireframes and mockups", priority: "high" },
      { id: "item-2", title: "Set up CI/CD pipeline", priority: "medium" },
    ],
  },
  {
    id: "col-progress",
    title: "In Progress",
    items: [
      { id: "item-3", title: "Implement auth flow", description: "OAuth2 with Google and GitHub", priority: "high" },
    ],
  },
  {
    id: "col-done",
    title: "Done",
    items: [
      { id: "item-4", title: "Project setup", description: "Initialize repo and configure tools", priority: "low" },
    ],
  },
];

## Accessibility
- Each column has role="group" and aria-label={column.title}.
- Each item card has an aria-label describing title and priority.
- Drag-and-drop provides visual feedback (border color change on drop target, opacity change on dragged item).

## Complete Usage Example

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotCanvas, Column } from "@/components/copilot-canvas";

const columns: Column[] = [
  { id: "todo", title: "To Do", items: [
    { id: "1", title: "Research competitors", description: "Analyze top 5 competitors", priority: "high" },
    { id: "2", title: "Write specs", priority: "medium" },
  ]},
  { id: "doing", title: "In Progress", items: [] },
  { id: "done", title: "Done", items: [] },
];

export default function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotCanvas
        initialColumns={columns}
        onUpdate={(cols) => console.log("Board updated:", cols)}
      />
      <CopilotPopup
        instructions="You are a project board assistant. Help manage tasks on the kanban board. You can add items, move them between columns, reorder them, and add new columns."
        labels={{ title: "Board Assistant", initial: "Tell me what to add or move on the board!" }}
      />
    </CopilotKit>
  );
}`,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-textarea"',
    copyPrompt: `Create a CopilotTextEditor — an AI-powered text editor with real-time inline autocompletions built with CopilotKit's CopilotTextarea component, plus three AI actions for replacing, appending, and clearing text content.

## Core Concept
CopilotTextEditor combines CopilotKit's CopilotTextarea component (which provides inline AI autosuggestions as-you-type) with useCopilotReadable and useCopilotAction hooks for broader AI control. The CopilotTextarea renders ghost text suggestions that the user can accept with Tab, while the useCopilotAction hooks let the AI entirely replace content, append text, or clear the editor through the chat interface. The component also tracks word count and character count and exposes them alongside the content and purpose to the AI via useCopilotReadable.

## Dependencies
- react (useState)
- @copilotkit/react-core (useCopilotReadable, useCopilotAction)
- @copilotkit/react-textarea (CopilotTextarea component) — IMPORTANT: also import "@copilotkit/react-textarea/styles.css" for the autosuggestion styling
- A cn classname merge utility (e.g. clsx + tailwind-merge)
- Tailwind CSS

## Complete TypeScript Interfaces

interface CopilotTextEditorProps {
  initialContent?: string;     // Optional starting text; defaults to ""
  purpose?: string;            // Describes the writing context, e.g. "writing a blog post about AI"
                               // Defaults to "writing content". Passed to autosuggestionsConfig.
  placeholder?: string;        // Placeholder text for the textarea; defaults to "Start typing... AI will help you write."
  className?: string;          // Optional additional CSS class for the root container
  onContentChange?: (content: string) => void; // Optional callback fired whenever content changes
}

## Component Props

- initialContent (string, optional, default: ""): The initial text to populate the editor with.
- purpose (string, optional, default: "writing content"): A string describing what the user is writing. This is passed to the CopilotTextarea's autosuggestionsConfig.textareaPurpose so the AI generates contextually relevant inline suggestions.
- placeholder (string, optional, default: "Start typing... AI will help you write."): Shown when the editor is empty.
- className (string, optional): Appended to the root div for external styling.
- onContentChange ((content: string) => void, optional): Called with the current content string whenever it changes (from user input or AI actions).

## State Management

1. content — useState(initialContent) — The current text content of the editor. This is the single source of truth for the editor's text.

Derived values (computed inline, not memoized):
- wordCount: content.split(/\\s+/).filter(Boolean).length — Number of words.
- charCount: content.length — Number of characters.

## useCopilotReadable Configuration

useCopilotReadable({
  description: "The current content of the AI-powered text editor",
  value: {
    content,                   // The full text string
    wordCount: content.split(/\\s+/).filter(Boolean).length,  // Word count
    purpose,                   // The writing purpose/context string
  },
});

This lets the AI see what the user has written, how long it is, and what they are writing about.

## useCopilotAction Definitions

### Action 1: setTextContent
- Name: "setTextContent"
- Description: "Replace the entire text content in the editor"
- Parameters:
  - content (string, required) — "The new content"
- Handler logic: Calls setContent(newContent), then calls onContentChange?.(newContent). Returns "Content updated".
- No custom render.

### Action 2: appendText
- Name: "appendText"
- Description: "Append text to the end of the current content"
- Parameters:
  - text (string, required) — "Text to append"
- Handler logic: Computes updated = content + text. Calls setContent(updated), then calls onContentChange?.(updated). Returns "Text appended".
- No custom render.

### Action 3: clearText
- Name: "clearText"
- Description: "Clear all text content from the editor"
- Parameters: Empty array (no parameters).
- Handler logic: Calls setContent(""), then calls onContentChange?.(""). Returns "Content cleared".
- No custom render.

## CopilotTextarea Configuration

The CopilotTextarea component from @copilotkit/react-textarea is the core input element. It is configured with:

- className: "min-h-[200px] w-full rounded-lg border border-border/50 bg-background/50 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
- placeholder: The placeholder prop value
- value: content (controlled)
- onValueChange: handleChange callback (updates content state and calls onContentChange)
- autosuggestionsConfig:
  - textareaPurpose: purpose (the writing context string)
  - chatApiConfigs:
    - suggestionsApiConfig:
      - maxTokens: 20 (keeps suggestions short, typically a few words)
      - stop: [".", "?", "!"] (stops suggestions at sentence boundaries)

The autosuggestionsConfig tells CopilotKit how to generate inline ghost-text suggestions. The textareaPurpose provides context (e.g., "writing a blog post about AI") so suggestions are relevant. The maxTokens limit of 20 and stop tokens at sentence-ending punctuation ensure suggestions are brief and natural.

## Layout & Structure

The root element is <div className={cn("space-y-3", className)}>. From top to bottom:

1. CopilotTextarea: The main editor textarea with inline AI suggestions. Takes up the full width with min-h-[200px]. Uses the controlled value/onValueChange pattern.

2. Footer bar: A div with "flex items-center justify-between px-1 text-xs text-muted-foreground". Contains:
   - Left: "{wordCount} words . {charCount} characters"
   - Right: "AI suggestions active" in text-emerald-400/70

## Styling Specifications
- Root: space-y-3
- Textarea: min-h-[200px] w-full rounded-lg border-border/50 bg-background/50 p-4 text-sm text-foreground
- Textarea focus: border-ring focus:outline-none focus:ring-1 focus:ring-ring/30
- Placeholder: placeholder:text-muted-foreground
- Footer text: text-xs text-muted-foreground
- AI indicator: text-emerald-400/70
- The CopilotTextarea has its own CSS from @copilotkit/react-textarea/styles.css that handles the inline suggestion ghost text styling

## Key Implementation Note
IMPORTANT: You must import the CopilotTextarea styles CSS file alongside the component:
import { CopilotTextarea } from "@copilotkit/react-textarea";
import "@copilotkit/react-textarea/styles.css";

Without the styles import, the inline autosuggestion ghost text will not display correctly.

## handleChange Function

const handleChange = (newContent: string) => {
  setContent(newContent);
  onContentChange?.(newContent);
};

This is the single handler for both user typing and the CopilotTextarea's onValueChange. It keeps the parent component in sync via the optional callback.

## Sample Data / Default Usage

No sample data is needed since this is a text editor. Typical usage involves passing a purpose prop:

<CopilotTextEditor
  purpose="writing a professional email to a client"
  placeholder="Start composing your email..."
  onContentChange={(text) => console.log("Content:", text)}
/>

Or with initial content:

<CopilotTextEditor
  initialContent="Dear Client,\\n\\nI wanted to follow up on our conversation..."
  purpose="writing a follow-up email"
/>

## Accessibility
- The CopilotTextarea renders a standard HTML textarea element, so it inherits native accessibility (focusable, keyboard navigable, compatible with screen readers).
- The placeholder text provides guidance when the editor is empty.
- Word and character counts are visible in the footer for user reference.

## Complete Usage Example

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotTextEditor } from "@/components/copilot-textarea";

export default function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-lg font-semibold mb-4">AI Writing Assistant</h1>
        <CopilotTextEditor
          purpose="writing a blog post about the future of AI"
          placeholder="Start writing your blog post... AI will suggest completions as you type."
          onContentChange={(content) => console.log("Updated:", content)}
        />
      </div>
      <CopilotPopup
        instructions="You are a writing assistant. Help the user write and edit their text. You can replace the entire content, append text to the end, or clear the editor. The CopilotTextarea also provides inline autocompletions as the user types."
        labels={{ title: "Writing Assistant", initial: "I can help you write! Just start typing for inline suggestions, or tell me what to write." }}
      />
    </CopilotKit>
  );
}`,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-chart"',
    copyPrompt: `Create a CopilotChart — an AI-powered interactive data visualization component built with CopilotKit and React that renders SaaS revenue data as both bar and line charts using pure SVG, with AI-controlled chart type switching, date range filtering, data point highlighting, and text annotations.

## Core Concept
CopilotChart is a self-contained SVG chart component that visualizes monthly revenue data with two rendering modes (bar and line). The AI integration allows a conversational copilot to switch chart types, zoom into date ranges, highlight specific data points with a glow effect, and annotate data points with labels — all through natural language commands. The component uses useCopilotReadable to expose the full chart state and useCopilotAction to register four distinct actions.

## Dependencies
- @copilotkit/react-core (useCopilotReadable, useCopilotAction)
- react (useState, useMemo, useCallback)
- A cn utility for merging Tailwind class names (e.g., from @/lib/utils)
- No external charting library — the chart is built entirely with SVG elements

## TypeScript Interfaces
export interface ChartDataPoint { month: string; revenue: number; users: number; growth: number; }
interface Annotation { index: number; label: string; }

## Component Props
interface CopilotChartProps { data?: ChartDataPoint[]; className?: string; }
- data defaults to 12-month DEFAULT_DATA if not provided.

## State Management
1. chartType — useState<"bar" | "line">("bar") — Controls which chart rendering mode is active.
2. dateRange — useState<{ start: number; end: number }>({ start: 0, end: data.length - 1 }) — The visible slice of data by 0-based index.
3. highlightedIndex — useState<number | null>(null) — Index of the currently highlighted data point in the full dataset.
4. annotations — useState<Annotation[]>([]) — Array of annotation objects referencing a data index and label.

Derived state (useMemo): filteredData (visible slice), maxRevenue, niceMax (nice Y-axis ceiling: raw=maxRevenue*1.1, step=10^floor(log10(raw)), ceil(raw/step)*step), yTicks (6 evenly spaced), barWidth (Math.max(12, (chartWidth - 8*(count-1))/count)), linePath (SVG "M/L" path string), resolvedHighlight (offset into filteredData), resolvedAnnotations (mapped to filteredData offsets).

SVG layout: svgWidth=720, svgHeight=360, paddingLeft=70, paddingRight=20, paddingTop=40, paddingBottom=50, chartWidth=630, chartHeight=270. Scale helpers: scaleY(value), getBarX(index), getPointX(index), formatRevenue(val) returning "$Xk".

## useCopilotReadable Configuration
useCopilotReadable({ description: "Current chart state including data points, chart type, visible date range, highlighted point, and annotations", value: { chartType, totalDataPoints: data.length, visibleDataPoints: filteredData.length, dateRange: { startMonth, endMonth, startIndex, endIndex }, highlightedIndex, annotations, data: filteredData } });

## useCopilotAction Definitions (4 total)

### Action 1: changeChartType
- Name: "changeChartType"
- Description: "Switch the chart visualization between bar chart and line chart. Use \\"bar\\" or \\"line\\"."
- Parameters: type (string, required) — 'The chart type to switch to: "bar" or "line"'
- Handler: Validates type, calls setChartType(type). Returns "Chart type changed to {type}".
- Render (inProgress): SVG spinner (animate-spin, text-blue-400), "Switching chart type..."
- Render (complete): Blue-500/30 border, blue-500/10 bg, text-blue-400. Inline SVG icon (3 rects for bar, polyline for line) plus bold type name.

### Action 2: filterDateRange
- Name: "filterDateRange"
- Description: "Filter the chart to show only data points within a specific index range (0-based). For example, startIndex=0 endIndex=5 shows Jan through Jun."
- Parameters: startIndex (number, required), endIndex (number, required) — 0-based inclusive indices. 0 = Jan, 11 = Dec.
- Handler: Clamps startIndex to [0, data.length-1], clamps endIndex to [clampedStart, data.length-1]. Sets dateRange. Returns "Date range set to {startMonth} - {endMonth}".
- Render (inProgress): text-purple-400 animate-pulse, calendar SVG, "Filtering date range..."
- Render (complete): Purple-500/30 border, purple-500/10 bg, "Showing {startMonth} to {endMonth}" bold.

### Action 3: highlightDataPoint
- Name: "highlightDataPoint"
- Description: "Highlight a specific data point on the chart with a glow effect. Use the 0-based index of the data point in the full dataset."
- Parameters: index (number, required) — 0-based, 0=Jan, 11=Dec
- Handler: Validates index in [0, data.length-1], sets highlightedIndex. Returns "Highlighted data point at index {index} ({month})".
- Render (inProgress): text-emerald-400 animate-pulse, star polygon SVG, "Highlighting data point..."
- Render (complete): Emerald-500/30 border, emerald-500/10 bg, "Highlighted {month}" bold.

### Action 4: addAnnotation
- Name: "addAnnotation"
- Description: "Add a text annotation above a specific data point on the chart. Use the 0-based index of the data point."
- Parameters: index (number, required), label (string, required) — "The annotation text to display above the data point"
- Handler: Validates index, appends {index, label} to annotations array via setAnnotations(prev => [...prev, {index, label}]). Returns confirmation with month and label.
- Render (inProgress): text-amber-400 animate-pulse, pencil SVG, "Adding annotation..."
- Render (complete): Amber-500/30 border, amber-500/10 bg, 'Annotated {month}: "{label}"'.

## Layout & Structure
1. Root: div with cn("w-full", className)
2. Header (mb-3, flex justify-between): h3 "SaaS Revenue Overview" (text-sm font-semibold) + toggle group (border-border/50 p-0.5) with Bar (active: bg-blue-500/20 text-blue-400) and Line (active: bg-violet-500/20 text-violet-400) buttons. Both: rounded-md px-3 py-1 text-xs font-medium transition-colors.
3. Active state badges (conditional, flex wrap gap-2): Date range badge (purple-500 themed) with close X. Highlight badge (emerald-500). Annotations count badge (amber-500). "Clear all" button (ml-auto).
4. SVG chart (overflow-hidden rounded-lg border-border/50): viewBox="0 0 720 360" role="img" with aria-label. Glow filter defs (feGaussianBlur stdDeviation=4, feFlood #10b981 0.6). Y-axis dashed grid + labels. X-axis baseline. Bar mode: rects fill-blue-500 fillOpacity=0.7 rx=3; highlighted fill-emerald-400 with glow filter. Line mode: area gradient (#8b5cf6), line stroke=#8b5cf6 strokeWidth=2.5, circles fill-violet-400/fill-emerald-400. Month labels, revenue labels, annotation groups (connector line, bg rect 80x18 rx=4, text truncated 14 chars).
5. Footer (mt-2, text-xs): "Showing X of Y months" + legend indicators.

## Sample Data
const DEFAULT_DATA: ChartDataPoint[] = [
  { month: "Jan", revenue: 28400, users: 820, growth: 4 },
  { month: "Feb", revenue: 31200, users: 910, growth: 7 },
  { month: "Mar", revenue: 29800, users: 880, growth: -2 },
  { month: "Apr", revenue: 34500, users: 1050, growth: 12 },
  { month: "May", revenue: 38900, users: 1200, growth: 14 },
  { month: "Jun", revenue: 42100, users: 1380, growth: 8 },
  { month: "Jul", revenue: 39700, users: 1340, growth: -3 },
  { month: "Aug", revenue: 45600, users: 1520, growth: 11 },
  { month: "Sep", revenue: 49200, users: 1740, growth: 15 },
  { month: "Oct", revenue: 53800, users: 1950, growth: 18 },
  { month: "Nov", revenue: 56400, users: 2180, growth: 10 },
  { month: "Dec", revenue: 62100, users: 2400, growth: 16 },
];

## Styling
Color palette: blue-500 (bars), violet-400/#8b5cf6 (line/points), emerald-400/#10b981 (highlights/glow), purple-500 (date range badges), amber-400/#f59e0b (annotations). Borders: border-border/50. Transitions: transition-all duration-300. Active toggles: bg-blue-500/20 (bar), bg-violet-500/20 (line). Glow: SVG feGaussianBlur + emerald flood. Action renders: animate-spin (chart type), animate-pulse (others).

## Accessibility
SVG has role="img" and aria-label: "{Bar/Line} chart showing SaaS revenue from {firstMonth} to {lastMonth}". Revenue values visible as text labels.

## Complete Usage Example
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotChart } from "@/components/copilot-chart";
export default function ChartPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="p-6"><CopilotChart /></div>
      <CopilotPopup instructions="You can control the chart. Change chart types, filter date ranges, highlight data points, and add annotations." labels={{ title: "Chart Assistant" }} />
    </CopilotKit>
  );
}

The component must be marked with "use client" at the top of the file.`,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-chat"',
    copyPrompt: `Create a CopilotChat — an AI-powered custom chat interface built with CopilotKit and React that features message bubbles with sender alignment, a typing indicator animation, message search with highlighting, conversation summarization, and four AI actions for sending messages, clearing history, searching, and summarizing.

## Core Concept
CopilotChat is a branded chat experience built on top of CopilotKit. Unlike CopilotKit's built-in chat components, this is a custom implementation that demonstrates how to build your own chat UI while leveraging CopilotKit for AI capabilities. The AI can send messages on behalf of participants, clear conversation history, search through messages with visual highlighting, and generate conversation summaries that appear as system messages. The component uses useCopilotReadable to expose the full message history and useCopilotAction to register four chat management actions.

## Dependencies
- @copilotkit/react-core (useCopilotReadable, useCopilotAction)
- react (useState, useRef, useEffect, useCallback)
- lucide-react (Send, Trash2, Search, FileText, Loader2, MessageSquare)
- @/components/ui/input (shadcn Input component)
- @/components/ui/button (shadcn Button component)
- A cn utility for merging Tailwind class names

## TypeScript Interfaces
export interface ChatMessage { id: string; sender: string; content: string; timestamp: string; isHighlighted?: boolean; }
interface CopilotChatProps { initialMessages?: ChatMessage[]; className?: string; }

## Component Props
- initialMessages (ChatMessage[], optional): Array of pre-loaded messages. Defaults to 6 messages between "You" and "Alex" about a project launch.
- className (string, optional): Additional CSS classes for root container.

## State Management
1. messages — useState<ChatMessage[]>(initialMessages ?? defaultMessages) — The full chat history.
2. inputValue — useState("") — Current text in the input field.
3. isTyping — useState(false) — Whether the typing indicator is visible.
4. messagesEndRef — useRef<HTMLDivElement>(null) — Ref for auto-scroll anchor.

Auto-scroll effect: useEffect that calls messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) when messages or isTyping changes.

Helper: addMessage(sender, content) — Creates a new ChatMessage with unique id ("msg-{timestamp}-{random}"), formatted timestamp (12-hour with AM/PM), appends to messages array, returns the new message.

## useCopilotReadable Configuration
useCopilotReadable({ description: "The current chat message history including sender names, message content, and timestamps", value: { totalMessages: messages.length, messages: messages.map(m => ({ id: m.id, sender: m.sender, content: m.content, timestamp: m.timestamp, isHighlighted: m.isHighlighted ?? false })) } });

## useCopilotAction Definitions (4 total)

### Action 1: sendMessage
- Name: "sendMessage"
- Description: "Send a new chat message. Use sender 'You' for the user or another name like 'Alex' for other participants."
- Parameters: sender (string, required) — "The name of the message sender", content (string, required) — "The message text to send"
- Handler: Sets isTyping=true, then after 600ms timeout calls addMessage(sender, content) and sets isTyping=false. Returns confirmation string.
- Render (inProgress): Loader2 animate-spin text-violet-400, "Sending message..."
- Render (complete): violet-500/30 border, violet-500/10 bg, MessageSquare icon, "Message sent as {sender}" bold.

### Action 2: clearHistory
- Name: "clearHistory"
- Description: "Clear all chat messages and reset the conversation history"
- Parameters: [] (none)
- Handler: Calls setMessages([]). Returns "Chat history has been cleared".
- Render (inProgress): Loader2 animate-spin text-red-400, "Clearing history..."
- Render (complete): red-500/30 border, red-500/10 bg, Trash2 icon, "Chat history cleared".

### Action 3: searchMessages
- Name: "searchMessages"
- Description: "Search through chat messages for a keyword or phrase. Matching messages will be highlighted with a glow effect."
- Parameters: query (string, required) — "The search term to look for in message content"
- Handler: Lowercases query, maps over messages setting isHighlighted=true where content includes the query. Returns match count.
- Render (inProgress): Loader2 animate-spin text-amber-400, 'Searching for "{query}"...'
- Render (complete): amber-500/30 border, amber-500/10 bg, Search icon, "Found {count} message(s) matching \\"{query}\\"" bold.

### Action 4: summarizeConversation
- Name: "summarizeConversation"
- Description: "Generate a brief summary of the current conversation and add it as a system message in the chat"
- Parameters: summary (string, required) — "A concise summary of the conversation so far"
- Handler: Calls addMessage("System", summary). Returns confirmation.
- Render (inProgress): Loader2 animate-spin text-emerald-400, "Summarizing conversation..."
- Render (complete): emerald-500/30 border, emerald-500/10 bg, FileText icon, "Conversation Summary" header + summary text (text-xs text-emerald-400/80).

## Layout & Structure
1. Root: flex flex-col rounded-xl border-border/50 bg-card/50 backdrop-blur-sm.
2. Header: flex items-center justify-between border-b border-border/30 px-4 py-3. Left: MessageSquare icon (text-violet-400) + "Chat" title + message count.
3. Messages area: flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[300px] max-h-[500px]. Empty state: centered "No messages yet" text. Messages render based on sender:
   - "You" messages: Right-aligned (justify-end). Bubble: bg-violet-600 text-white rounded-2xl rounded-br-md px-3.5 py-2.5 max-w-[75%]. Timestamp: text-white/60.
   - Other messages: Left-aligned (justify-start). Bubble: bg-muted/60 text-foreground rounded-2xl rounded-bl-md border-border/30. Sender name: text-[11px] font-semibold. Timestamp: text-muted-foreground/50.
   - "System" messages: Centered. max-w-[85%] rounded-lg border-border/30 bg-muted/30 text-center text-xs italic.
   - Highlighted messages (search): shadow-[0_0_16px_rgba(245,158,11,0.4)] ring-2 ring-amber-500/50. System highlighted: border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)].
4. Typing indicator: Three bouncing dots (h-2 w-2 rounded-full bg-muted-foreground/60) with staggered animation-delay (0ms, 150ms, 300ms) using animate-bounce.
5. Input area: border-t border-border/30 px-4 py-3. Flex row: Input component (flex-1) + Send Button (bg-violet-600 hover:bg-violet-700, disabled when empty).

## Sample Data
const defaultMessages: ChatMessage[] = [
  { id: "msg-1", sender: "You", content: "Hey Alex, how's everything looking for the project launch next week?", timestamp: "10:02 AM" },
  { id: "msg-2", sender: "Alex", content: "Pretty good! The design assets are finalized and the dev team merged the last feature branch yesterday.", timestamp: "10:04 AM" },
  { id: "msg-3", sender: "You", content: "Nice. Did QA finish the regression tests yet?", timestamp: "10:05 AM" },
  { id: "msg-4", sender: "Alex", content: "Almost - they found two minor bugs in the checkout flow. Fixes are in review right now, should be merged by EOD.", timestamp: "10:07 AM" },
  { id: "msg-5", sender: "You", content: "Great. Let's sync tomorrow morning to go over the launch checklist one more time.", timestamp: "10:09 AM" },
  { id: "msg-6", sender: "Alex", content: "Sounds good! I'll prepare the final deployment runbook and share it before the meeting.", timestamp: "10:11 AM" },
];

## Styling
- Violet-600 for "You" bubbles, bg-muted/60 for others. Search highlights: amber-500 glow. Action colors: violet (send), red (clear), amber (search), emerald (summarize).
- Typing dots: animate-bounce with staggered delays. Auto-scroll: smooth behavior.
- Timestamps: text-[10px]. Message text: text-sm leading-relaxed.

## Accessibility
- Messages auto-scroll on new content. Input supports Enter to send, Shift+Enter for newline. Send button disabled when input is empty.

## Complete Usage Example
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotChat } from "@/components/copilot-chat";
export default function ChatPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="p-6 max-w-lg mx-auto"><CopilotChat /></div>
      <CopilotPopup instructions="You can manage the chat. Send messages as any participant, clear history, search messages, and summarize conversations." labels={{ title: "Chat Assistant" }} />
    </CopilotKit>
  );
}

The component must be marked with "use client" at the top of the file.`,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-dashboard"',
    copyPrompt: `Create a CopilotDashboard — an AI-powered metrics dashboard component built with CopilotKit and React that displays KPI cards with sparkline mini-charts, date range filtering, metric highlighting with glow effects, metric comparison, and AI-generated insight cards.

## Core Concept
CopilotDashboard is a SaaS metrics overview with a responsive grid of KPI cards, each showing a title, value, trend indicator with percentage change, and a mini sparkline SVG chart. The AI integration lets users ask questions like "highlight MRR" or "compare revenue and churn" and the dashboard responds with visual glow effects, comparison panels, and AI-generated insight cards. The component uses useCopilotReadable to expose all metric data and useCopilotAction to register four actions.

## Dependencies
- @copilotkit/react-core (useCopilotReadable, useCopilotAction)
- react (useState, useCallback, useRef, useMemo)
- lucide-react (TrendingUp, TrendingDown, Loader2, Sparkles, CheckCircle)
- A cn utility for merging Tailwind class names

## TypeScript Interfaces
export interface DashboardMetric { id: string; title: string; value: string; change: string; changeType: "positive" | "negative"; sparklineData: number[]; }
interface CopilotDashboardProps { metrics?: DashboardMetric[]; className?: string; }
type DateRange = "7d" | "30d" | "90d" | "1y";

## Component Props
- metrics (DashboardMetric[], optional): Defaults to 6 SaaS KPI metrics.
- className (string, optional): Additional CSS classes.

## State Management
1. metrics — useState<DashboardMetric[]>(propMetrics ?? defaultMetrics)
2. dateRange — useState<DateRange>("30d")
3. highlightedMetrics — useState<Set<string>>(new Set()) — Set of metric IDs currently glowing.
4. insight — useState<string | null>(null) — AI-generated insight text.
5. comparisonResult — useState<string | null>(null) — Metric comparison summary text.
6. highlightTimeouts — useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

Highlight system: triggerHighlight(metricId) adds the ID to highlightedMetrics Set, sets a 1500ms timeout to remove it. Clears existing timeout for the same ID first.

## Sparkline Sub-component
function Sparkline({ data, color, width=80, height=32 }): Renders a polyline SVG from data points. Scales x across width, y across height with 4px padding. Stroke color passed as prop, strokeWidth=1.5, round caps/joins. Returns null if data.length < 2.

## useCopilotReadable Configuration
useCopilotReadable({ description: "Current metrics dashboard state including all KPI metrics, active date range, and any AI-generated insights", value: { dateRange, metrics: metrics.map(m => ({ id, title, value, change, changeType })), highlightedMetrics: Array.from(highlightedMetrics), currentInsight: insight, comparisonResult } });

## useCopilotAction Definitions (4 total)

### Action 1: filterByDateRange
- Name: "filterByDateRange"
- Description: "Change the dashboard date range filter. Available ranges: 7d, 30d, 90d, 1y"
- Parameters: range (string, required) — '"7d", "30d", "90d", or "1y"'
- Handler: Validates against ["7d","30d","90d","1y"]. Sets dateRange. Returns confirmation.
- Render (inProgress): Loader2 text-blue-400 animate-spin, "Changing date range..."
- Render (complete): blue-500/30 border, blue-500/10 bg, CheckCircle, "Date range set to {range}" bold.

### Action 2: highlightMetric
- Name: "highlightMetric"
- Description: "Highlight a specific metric card to draw attention to it with a violet glow animation"
- Parameters: metricId (string, required) — dynamic description listing available metric IDs
- Handler: Finds metric, if not found returns error. Calls triggerHighlight(metricId). Returns confirmation.
- Render (inProgress): Loader2 text-violet-400, "Highlighting metric..."
- Render (complete): violet-500/30 border, violet-500/10 bg, Sparkles icon, "Highlighted {metric.title}" bold.

### Action 3: compareMetrics
- Name: "compareMetrics"
- Description: "Compare two metrics side by side and display a summary of their differences"
- Parameters: metricIdA (string, required), metricIdB (string, required), summary (string, required) — "A brief AI-generated comparison summary"
- Handler: Finds both metrics (returns error if either not found). Calls triggerHighlight on both. Sets comparisonResult to summary or auto-generated comparison string. Returns the result.
- Render (inProgress): Loader2 text-amber-400, "Comparing metrics..."
- Render (complete): amber-500/30 border, amber-500/10 bg, CheckCircle, "Compared {A.title} vs {B.title}" bold + summary.

### Action 4: generateInsight
- Name: "generateInsight"
- Description: "Generate and display an AI insight card below the metrics based on the current dashboard data"
- Parameters: insight (string, required) — "The AI-generated insight text to display"
- Handler: Sets insight state. Returns confirmation.
- Render (inProgress): Loader2 text-emerald-400, "Generating insight..."
- Render (complete): emerald-500/30 border, emerald-500/10 bg, Sparkles icon, "Insight added to dashboard" + truncated insight text.

## Layout & Structure
1. Root: div with cn("w-full space-y-4", className)
2. Header: flex justify-between. h2 "Metrics Dashboard" (text-lg font-semibold). Date range buttons: ["7d","30d","90d","1y"] in a rounded-lg border-border/50 bg-card/50 p-1 container. Active: bg-foreground text-background shadow-sm. Inactive: text-muted-foreground hover:text-foreground. All: rounded-md px-3 py-1.5 text-xs font-medium.
3. Metrics grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4. Each card: rounded-xl border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300. Highlighted: animate-[highlight-glow_1.5s_ease-in-out] border-violet-500/60 shadow-[0_0_16px_rgba(139,92,246,0.35)]. Card content: title (text-xs font-medium text-muted-foreground), value (text-2xl font-bold tracking-tight), Sparkline component (color: green for positive, red for negative), trend indicator (TrendingUp/TrendingDown icon in emerald-500/red-500 + change text + "vs prev. period").
4. Comparison panel (conditional): rounded-xl border-amber-500/30 bg-amber-500/5 p-4. TrendingUp icon in amber-400, "Metric Comparison" title, comparison text, Dismiss button.
5. AI Insight panel (conditional): rounded-xl border-violet-500/30 bg-violet-500/5 p-4. Sparkles icon in violet-400, "AI Insight" title, insight text, Dismiss button.
6. Screen reader live region: div aria-live="polite" className="sr-only" announcing metric count and date range.

## Sample Data
const defaultMetrics: DashboardMetric[] = [
  { id: "mrr", title: "MRR", value: "$48.5k", change: "+12%", changeType: "positive", sparklineData: [30,35,32,40,38,45,42,48] },
  { id: "churn-rate", title: "Churn Rate", value: "2.1%", change: "-0.3%", changeType: "positive", sparklineData: [3.2,3.0,2.8,2.9,2.5,2.4,2.2,2.1] },
  { id: "nps-score", title: "NPS Score", value: "72", change: "+5", changeType: "positive", sparklineData: [58,60,62,65,64,68,70,72] },
  { id: "active-users", title: "Active Users", value: "1,234", change: "+8%", changeType: "positive", sparklineData: [980,1020,1050,1080,1100,1150,1200,1234] },
  { id: "revenue", title: "Revenue", value: "$142k", change: "+15%", changeType: "positive", sparklineData: [95,100,108,115,120,128,135,142] },
  { id: "avg-ticket", title: "Avg Ticket", value: "$38", change: "+2%", changeType: "positive", sparklineData: [32,33,34,35,34,36,37,38] },
];

## Styling
- Highlight glow: border-violet-500/60 shadow-[0_0_16px_rgba(139,92,246,0.35)] with 1.5s animation. Sparkline colors: rgb(34,197,94) positive, rgb(239,68,68) negative. Trend icons: emerald-500 (up), red-500 (down). Backdrop: bg-card/50 backdrop-blur-sm. Date range active: bg-foreground text-background.

## Accessibility
- aria-live="polite" sr-only region announces dashboard state changes.
- Color is supplemented with TrendingUp/TrendingDown icons for trend direction.

## Complete Usage Example
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotDashboard } from "@/components/copilot-dashboard";
export default function DashboardPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="p-6"><CopilotDashboard /></div>
      <CopilotPopup instructions="You can control the dashboard. Filter by date range, highlight metrics, compare metrics, and generate insights." labels={{ title: "Dashboard Assistant" }} />
    </CopilotKit>
  );
}

The component must be marked with "use client" at the top of the file.`,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-calendar"',
    copyPrompt: `Create a CopilotCalendar — an AI-powered weekly calendar grid built with CopilotKit and React that displays seven days of time slots with colored event blocks, and provides five AI actions for adding, moving, removing, finding free slots, and clearing events through natural language.

## Core Concept

CopilotCalendar is a week-view scheduling grid that renders Mon through Sun as columns and 8 AM through 5 PM (hours 8-17) as rows. Events are positioned absolutely within their grid cell, with their height calculated from their duration. The AI integration allows users to say things like "schedule a design review on Wednesday at 2 PM" or "find me a free hour on Friday" and the component executes those changes through five registered CopilotKit actions. Each newly created or moved event receives a 1.5-second pulse animation to draw the user's attention. A footer bar displays the total event count and a color legend.

## Dependencies

Install the following npm packages:
- @copilotkit/react-core (for useCopilotReadable and useCopilotAction hooks)
- @copilotkit/react-ui (for CopilotPopup or CopilotSidebar so the user can interact with the AI)
- lucide-react (for icons: Loader2, CheckCircle)
- Tailwind CSS with a dark theme configuration
- A \\\`cn\\\` utility function for conditional class merging (typically from @/lib/utils)

## TypeScript Interfaces

\\\`\\\`\\\`typescript
export interface CalendarEvent {
  id: string;           // Unique identifier, e.g. "evt-1" for defaults or "evt-<timestamp>-<random>" for new events
  title: string;        // Display name of the event, e.g. "Team Standup"
  day: string;          // Day of the week: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
  startHour: number;    // Starting hour in 24h format, valid range 8-17
  endHour: number;      // Ending hour in 24h format, valid range 9-18, must be > startHour
  color: string;        // Color key: "violet" | "blue" | "emerald" | "amber" | "rose"
}

interface CopilotCalendarProps {
  initialEvents?: CalendarEvent[];  // Optional initial events; defaults to 5 sample meetings
  className?: string;               // Optional additional CSS classes for the root container
}
\\\`\\\`\\\`

## Component Props

- \\\`initialEvents\\\` (CalendarEvent[], optional): An array of calendar events to pre-populate. If not provided, five default events are used: Team Standup (Mon 9-10, violet), Design Review (Tue 14-15, blue), Sprint Planning (Wed 10-11, emerald), 1:1 with Manager (Thu 11-12, amber), and Demo Day (Fri 15-16, rose).
- \\\`className\\\` (string, optional): Appended to the root div for external styling overrides.

## Constants and Color Map

Define two constant arrays and a color mapping object:

\\\`\\\`\\\`typescript
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  violet: { bg: "bg-violet-500/20", border: "border-violet-500/30", text: "text-violet-300" },
  blue:   { bg: "bg-blue-500/20",   border: "border-blue-500/30",   text: "text-blue-300" },
  emerald:{ bg: "bg-emerald-500/20",border: "border-emerald-500/30",text: "text-emerald-300" },
  amber:  { bg: "bg-amber-500/20",  border: "border-amber-500/30",  text: "text-amber-300" },
  rose:   { bg: "bg-rose-500/20",   border: "border-rose-500/30",   text: "text-rose-300" },
};
\\\`\\\`\\\`

## Helper Function

\\\`formatHour(hour: number): string\\\` — Converts a 24-hour number to a display string. Returns "12 PM" for 12, \\\`\\\${hour - 12} PM\\\` for hours > 12, and \\\`\\\${hour} AM\\\` for hours < 12.

## State Management

The component uses these hooks:
1. \\\`events\\\` (useState<CalendarEvent[]>): The full list of calendar events. Initialized to \\\`initialEvents ?? defaultEvents\\\`.
2. \\\`newEventIds\\\` (useState<Set<string>>): A set of event IDs currently in the pulse animation state. Events are added to this set when created or moved, then automatically removed after 1500ms.
3. \\\`pulseTimeouts\\\` (useRef<Map<string, ReturnType<typeof setTimeout>>>): A ref holding active timeout handles keyed by event ID, so existing pulse timers can be cleared and re-started if a second pulse is triggered before the first expires.

The \\\`triggerPulse\\\` callback (useCallback) manages the animation lifecycle: it clears any existing timeout for the event ID, adds the ID to the \\\`newEventIds\\\` set, schedules a 1500ms timeout that removes the ID from the set and cleans up the timeout map entry.

## useCopilotReadable Configuration

\\\`\\\`\\\`typescript
useCopilotReadable({
  description: "Current weekly calendar state including all events and the visible time range",
  value: {
    totalEvents: events.length,
    days: DAYS,
    visibleHours: { start: 8, end: 18 },
    events: events.map((evt) => ({
      id: evt.id,
      title: evt.title,
      day: evt.day,
      startHour: evt.startHour,
      endHour: evt.endHour,
      color: evt.color,
    })),
  },
});
\\\`\\\`\\\`

## useCopilotAction Definitions (5 actions)

### 1. addEvent
- **name**: "addEvent"
- **description**: "Add a new event to the weekly calendar at a specific day and time slot"
- **parameters**: title (string, required), day (string, required — "Mon" through "Sun"), startHour (number, required — 8 to 17), endHour (number, required — 9 to 18, must be > startHour), color (string, optional — defaults to "blue")
- **render**: When inProgress, show a rounded-lg bordered box with Loader2 spinning in violet-400 and text "Adding event...". When complete, show a violet-themed bordered box with CheckCircle icon and text "Added {title} on {day} {startHour}–{endHour}" using formatHour for display.
- **handler**: Validates that day is in the DAYS array (returns error string if not). Validates startHour is between 8 and 17. Validates endHour is between 9 and 18 and greater than startHour. Generates a new ID using \\\`evt-\\\${Date.now()}-\\\${Math.random().toString(36).slice(2, 7)}\\\`. Creates the CalendarEvent with the provided color or falls back to "blue" if the color is not in colorMap. Appends it to the events array and calls triggerPulse with the new ID. Returns a confirmation string.

### 2. moveEvent
- **name**: "moveEvent"
- **description**: "Move an existing event to a different day and/or time slot on the calendar"
- **parameters**: eventId (string, required), newDay (string, optional), newStartHour (number, optional), newEndHour (number, optional)
- **render**: When inProgress, show Loader2 in blue-400 with "Moving event...". When complete, show blue-themed box with CheckCircle and "Moved {eventId}" plus the new day and time if provided, using formatHour.
- **handler**: Maps over the events array. For the matching event, spreads the existing fields and overrides day, startHour, endHour with new values if provided (uses nullish coalescing to keep originals). If no match found, returns "Event {eventId} not found". Calls triggerPulse on the moved event. Returns confirmation string.

### 3. removeEvent
- **name**: "removeEvent"
- **description**: "Remove an event from the calendar by its ID"
- **parameters**: eventId (string, required)
- **render**: When inProgress, show Loader2 in rose-400 with "Removing event...". When complete, show rose-themed box with CheckCircle and "Removed event {eventId}".
- **handler**: Filters the events array, removing the event with the matching ID. Tracks whether the event was found. If not found, returns "Event {eventId} not found". Returns confirmation string.

### 4. findFreeSlot
- **name**: "findFreeSlot"
- **description**: "Find the next available free time slot on a given day (or any day) that fits a requested duration"
- **parameters**: day (string, optional — if omitted, searches all days starting from Mon), durationHours (number, optional — defaults to 1)
- **render**: When inProgress, show Loader2 in emerald-400 with "Searching for free slot...". When complete, show emerald-themed box with CheckCircle and "Found free slot" plus the day if specified.
- **handler**: Sets duration to durationHours or 1. Determines the days to search: if a specific day is provided, only search that day; otherwise iterate through all DAYS in order. For each search day, filters and sorts events by startHour. Then iterates hour from 8 to (18 - duration), checking if any event on that day has a conflict (evt.startHour < slotEnd && evt.endHour > hour). Returns the first conflict-free slot as a formatted string. If no free slot is found across all searched days, returns "No free slot found matching the criteria".

### 5. clearDay
- **name**: "clearDay"
- **description**: "Remove all events from a specific day of the week"
- **parameters**: day (string, required — "Mon" through "Sun")
- **render**: When inProgress, show Loader2 in amber-400 with "Clearing day...". When complete, show amber-themed box with CheckCircle and "Cleared all events on {day}".
- **handler**: Validates that day is in the DAYS array (returns error string if not). Counts events matching the day, then filters them out of the events array. Returns "Cleared {count} event(s) from {day}".

## Render Action Status Boxes Pattern

All five actions share the same render pattern. Each has two states:
- **inProgress**: A flex container with items-center gap-2, rounded-lg border with border-border/50 bg-card/50 px-3 py-2 text-sm. Contains a Loader2 icon with h-4 w-4 animate-spin in a color matching the action's theme, and a text span describing the ongoing operation.
- **complete**: A flex container styled with the action's theme color — e.g. border-violet-500/30 bg-violet-500/10 text-violet-400 for addEvent, border-blue-500/30 for moveEvent, border-rose-500/30 for removeEvent, border-emerald-500/30 for findFreeSlot, border-amber-500/30 for clearDay. Contains a CheckCircle icon and a summary span.

## Layout & Structure

The root div has classes "w-full" plus the optional className prop. Inside it:

1. **Calendar Grid Container**: An outer div with overflow-hidden rounded-lg border border-border/50. Inside, an overflow-x-auto wrapper. Inside that, a CSS Grid with \\\`gridTemplateColumns: "64px repeat(7, minmax(120px, 1fr))"\\\`.

2. **Top-left Corner Cell**: An empty div with border-b border-r border-border/30 bg-muted/30 px-2 py-2.

3. **Day Header Row**: Seven cells, one for each day in DAYS. Each has border-b border-r border-border/30 bg-muted/30 px-3 py-2 text-center text-sm font-semibold text-foreground. The last cell also gets last:border-r-0.

4. **Hour Rows**: For each hour in HOURS (8-17), render a React.Fragment containing:
   - **Hour Label Cell**: A div with border-b border-r border-border/20 bg-muted/10 px-2 py-1 text-right text-xs text-muted-foreground, height set to ROW_HEIGHT (48px). Contains the formatted hour string.
   - **Seven Day Cells**: For each day, a relative-positioned div with border-b border-r border-border/10 last:border-r-0, height ROW_HEIGHT. Events that start at this hour are rendered inside as absolutely positioned blocks.

5. **Event Blocks**: For each event starting at the current hour in the current day column, render an absolutely positioned div. The height is calculated as \\\`(endHour - startHour) * ROW_HEIGHT - 4\\\` pixels. Classes: "absolute inset-x-1 top-0.5 z-10 overflow-hidden rounded-md border px-2 py-1 text-xs font-medium transition-all" plus the color classes from colorMap, plus "animate-pulse" if the event ID is in the newEventIds set. The event shows its title in a truncated div, and if the duration is > 1 hour, also shows the time range in a smaller text-[10px] opacity-70 line. The title attribute on the block shows the full title and time range on hover.

6. **Footer Bar**: Below the grid, a div with mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground. Left side shows "{events.length} event(s) on calendar". Right side renders the color legend by mapping over colorMap entries, showing a small 2x2 rounded-full dot and the capitalized color name.

7. **Accessibility**: An aria-live="polite" sr-only div at the bottom announces the event count for screen readers.

## Sample Default Data

\\\`\\\`\\\`typescript
const defaultEvents: CalendarEvent[] = [
  { id: "evt-1", title: "Team Standup",    day: "Mon", startHour: 9,  endHour: 10, color: "violet" },
  { id: "evt-2", title: "Design Review",   day: "Tue", startHour: 14, endHour: 15, color: "blue" },
  { id: "evt-3", title: "Sprint Planning", day: "Wed", startHour: 10, endHour: 11, color: "emerald" },
  { id: "evt-4", title: "1:1 with Manager",day: "Thu", startHour: 11, endHour: 12, color: "amber" },
  { id: "evt-5", title: "Demo Day",        day: "Fri", startHour: 15, endHour: 16, color: "rose" },
];
\\\`\\\`\\\`

## Complete Usage Example

\\\`\\\`\\\`tsx
import { CopilotCalendar } from "@/components/copilot-calendar";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function SchedulePage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="flex-1 p-6 overflow-auto">
        <CopilotCalendar />
      </div>
      <CopilotSidebar
        defaultOpen={true}
        instructions="You are a scheduling assistant. Help the user manage their weekly calendar. You can add events, move them to different days and times, remove them, find free slots, and clear entire days. Always confirm changes after making them."
        labels={{ title: "Calendar AI", initial: "How can I help with your schedule?" }}
      />
    </div>
  );
}
\\\`\\\`\\\`

Try saying: "Schedule a team lunch on Friday at noon for 1 hour", "Move the standup to Tuesday", "Find me a free 2-hour block", or "Clear all events on Wednesday".`,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-editor"',
    copyPrompt: `Create a CopilotEditor — an AI-powered split-pane markdown editor built with CopilotKit and React that provides real-time preview, a formatting toolbar, and five AI actions for inserting, replacing, formatting, improving, and adding headings to document content.

## Core Concept

CopilotEditor is a markdown writing environment with a side-by-side editor and live preview. The left pane is a raw markdown textarea with line numbers; the right pane renders the markdown as styled HTML in real time. The AI integration lets users ask natural language questions like "add a conclusion paragraph" or "improve the writing quality" and the component executes those changes through registered CopilotKit actions. The component includes a toolbar for manual formatting (bold, italic, heading, code, list) and displays word/line counts.

## Dependencies

Install the following npm packages:
- @copilotkit/react-core (for useCopilotReadable and useCopilotAction hooks)
- @copilotkit/react-ui (for CopilotPopup or CopilotSidebar to interact with the AI)
- lucide-react (for icons: Bold, Italic, Heading, Code, List, Loader2, CheckCircle, Sparkles)
- tailwind CSS with a dark theme configuration
- A \`cn\` utility function for conditional class merging (typically from @/lib/utils)
- A Button component from your UI library (e.g., @/components/ui/button)

## TypeScript Interfaces

\`\`\`typescript
interface CopilotEditorProps {
  initialContent?: string;  // Optional initial markdown content; defaults to a sample blog post
  className?: string;       // Optional additional CSS classes for the root container
}
\`\`\`

No other exported interfaces are needed. The component manages all state internally.

## Component Props

- \`initialContent\` (string, optional): The initial markdown string to load into the editor. If not provided, a rich default blog post about "The Future of AI in Software Development" is used. The default content includes an h1 title, h2 sections, bullet lists, and a fenced TypeScript code block.
- \`className\` (string, optional): Appended to the root div for external styling overrides.

## State Management

The component uses these useState hooks:
1. \`content\` (string): The current markdown document text. Initialized to \`initialContent ?? DEFAULT_CONTENT\`.

Additional refs and memos:
- \`textareaRef\` (useRef<HTMLTextAreaElement>): Reference to the textarea element for cursor position management.
- \`wordCount\` (useMemo): Computed as \`content.split(/\\s+/).filter(Boolean).length\`.
- \`lineCount\` (useMemo): Computed as \`content.split("\\n").length\`.
- \`previewHtml\` (useMemo): Computed by passing content through a \`renderMarkdownToHtml\` function.

## Helper Functions

1. \`renderMarkdownToHtml(markdown: string): string\` — A custom markdown-to-HTML renderer that processes the markdown line by line. It handles:
   - Fenced code blocks (\\\`\\\`\\\`) rendered as \`<pre><code>\` with class "rounded-lg bg-muted/30 border border-border/40 p-4 my-3 overflow-x-auto" and inner code with "text-sm font-mono text-foreground/90". HTML entities are escaped inside code blocks.
   - Headings: h1 (\`# \`) with "text-2xl font-bold text-foreground mt-6 mb-3", h2 (\`## \`) with "text-lg font-semibold text-foreground mt-6 mb-2", h3 (\`### \`) with "text-base font-semibold text-foreground mt-5 mb-2".
   - Unordered lists (\`- \` prefix) wrapped in \`<ul class="list-disc list-inside space-y-1 my-2 text-sm text-foreground/90">\`.
   - Blank lines rendered as \`<div class="h-3"></div>\` spacers.
   - Regular paragraphs as \`<p class="text-sm leading-relaxed text-foreground/90 my-1">\`.

2. \`applyInlineFormatting(text: string): string\` — Processes inline markdown: \`**bold**\` to \`<strong>\`, \`*italic*\` to \`<em>\`, and \\\`inline code\\\` to \`<code class="rounded bg-muted/30 px-1.5 py-0.5 text-xs font-mono">\`.

3. \`insertAtCursorPosition(text: string)\` (useCallback): Inserts text at the current textarea cursor position. Gets selectionStart and selectionEnd from the textarea ref, splices the content, updates state, and uses requestAnimationFrame to restore cursor position and focus.

4. \`wrapSelection(wrapper: string)\` (useCallback): Wraps the currently selected text with the wrapper string (e.g., "**" for bold, "*" for italic, "\\\`" for code). If nothing is selected, wraps the placeholder word "text". Uses requestAnimationFrame to set selection to the wrapped content.

## useCopilotReadable Configuration

\`\`\`typescript
useCopilotReadable({
  description: "Current markdown document content in the editor, including word count and line count",
  value: {
    content,      // The full markdown string
    wordCount,    // Number of words in the document
    lineCount,    // Number of lines in the document
  },
});
\`\`\`

## useCopilotAction Definitions

### Action 1: insertAtCursor
- **Name**: "insertAtCursor"
- **Description**: "Insert text at the current cursor position in the markdown editor"
- **Parameters**:
  - \`text\` (string, required): "The text to insert at the cursor position"
- **Handler**: Calls \`insertAtCursorPosition(text)\`. Returns "Inserted text at cursor position".
- **Render (inProgress)**: A rounded-lg container with border-border/50, bg-card/50, showing a Loader2 spinner (animate-spin, text-blue-400) and text "Inserting text...".
- **Render (complete)**: A rounded-lg container with border-blue-500/30, bg-blue-500/10, text-blue-400, showing a CheckCircle icon and "Inserted {length} characters" with the character count in bold.

### Action 2: replaceContent
- **Name**: "replaceContent"
- **Description**: "Replace the entire content of the markdown editor with new content"
- **Parameters**:
  - \`newContent\` (string, required): "The new markdown content to replace the existing content"
- **Handler**: Calls \`setContent(newContent)\`. Returns "Content replaced successfully".
- **Render (inProgress)**: Loader2 with text-violet-400, message "Replacing content...".
- **Render (complete)**: Border border-violet-500/30, bg-violet-500/10, text-violet-400, CheckCircle icon, "Content replaced ({wordCount} words)" where word count is computed from the new content.

### Action 3: formatAsMarkdown
- **Name**: "formatAsMarkdown"
- **Description**: "Clean up and format the current content as properly structured markdown with consistent headings, spacing, and formatting"
- **Parameters**:
  - \`formattedContent\` (string, required): "The cleaned-up and properly formatted markdown content"
- **Handler**: Calls \`setContent(formattedContent)\`. Returns "Content formatted as clean markdown".
- **Render (inProgress)**: Loader2 with text-emerald-400, "Formatting markdown...".
- **Render (complete)**: Border border-emerald-500/30, bg-emerald-500/10, text-emerald-400, "Markdown formatted successfully".

### Action 4: improveWriting
- **Name**: "improveWriting"
- **Description**: "Improve the writing quality of the current document by enhancing clarity, grammar, and flow while preserving the original meaning and markdown structure"
- **Parameters**:
  - \`improvedContent\` (string, required): "The improved version of the document with better writing quality"
- **Handler**: Calls \`setContent(improvedContent)\`. Returns "Writing quality improved".
- **Render (inProgress)**: Loader2 with text-amber-400, "Improving writing...".
- **Render (complete)**: Border border-amber-500/30, bg-amber-500/10, text-amber-400, "Writing improved".

### Action 5: addHeading
- **Name**: "addHeading"
- **Description**: "Add a markdown heading at the end of the document. Supports h1 (#), h2 (##), and h3 (###) levels."
- **Parameters**:
  - \`text\` (string, required): "The heading text"
  - \`level\` (number, required): "The heading level: 1 for h1, 2 for h2, 3 for h3"
- **Handler**: Computes prefix as "#".repeat(Math.min(Math.max(level, 1), 3)), constructs heading as "\\n\\n{prefix} {text}\\n\\n", appends to trimmed content via \`setContent(prev => prev.trimEnd() + heading)\`. Returns "Added h{level} heading: {text}".
- **Render (inProgress)**: Loader2 with text-purple-400, "Adding heading...".
- **Render (complete)**: Border border-purple-500/30, bg-purple-500/10, text-purple-400, "Added h{level} heading: {text}" with args displayed in bold.

## Layout & Structure

The root element is a flex column with gap-3. From top to bottom:

1. **Toolbar**: A flex row with items-center gap-1, wrapped in a rounded-lg container with border-border/50 bg-card/50 px-2 py-1.5. Contains:
   - Bold button (wraps selection with "**"), ghost variant, 8x8 size
   - Italic button (wraps with "*"), ghost variant, 8x8 size
   - Heading button (inserts "\\n## "), ghost variant, 8x8 size
   - Code button (wraps with "\\\`"), ghost variant, 8x8 size
   - List button (inserts "\\n- "), ghost variant, 8x8 size
   - A vertical divider (mx-2 h-5 w-px bg-border/50)
   - An AI indicator: Sparkles icon (h-3.5 w-3.5 text-violet-400) with "AI actions available" text
   - Right-aligned word/line count display: "{wordCount} words · {lineCount} lines"

2. **Split-pane editor**: A CSS grid with grid-cols-2 gap-3 and minHeight 480px.
   - **Left (Editor pane)**: A rounded-lg container with border-border/50 bg-background/50. Contains:
     - A line number gutter: flex column, items-end, border-r border-border/30 bg-muted/20 px-3 py-3 font-mono text-xs leading-[1.625rem] text-muted-foreground/50 select-none aria-hidden="true". Maps each line to a <span> with the line number.
     - A textarea: flex-1 resize-none bg-transparent p-3 font-mono text-sm leading-[1.625rem] text-foreground outline-none, spellCheck=false.
   - **Right (Preview pane)**: A rounded-lg container with overflow-auto border-border/50 bg-card/30 p-5. Contains:
     - A "Preview" label bar: mb-3 flex items-center gap-2 border-b border-border/30 pb-2 text-xs font-medium text-muted-foreground.
     - A div with className "prose-sm" using dangerouslySetInnerHTML to render the previewHtml.

## Styling Specifications

- **Color palette**: blue-400/500 (insert action), violet-400/500 (replace action, AI indicator), emerald-400/500 (format action), amber-400/500 (improve writing action), purple-400/500 (heading action)
- **Borders**: border-border/50 throughout, border-border/30 for subtle dividers
- **Backgrounds**: bg-card/50 for toolbar and cards, bg-background/50 for editor, bg-card/30 for preview, bg-muted/30 for code blocks and inline code, bg-muted/20 for line number gutter
- **Font**: font-mono for editor textarea and line numbers, text-sm for body, text-xs for metadata
- **All action render containers**: rounded-lg border px-3 py-2 text-sm with flex items-center gap-2

## Sample Data (DEFAULT_CONTENT)

The default content is a markdown document with the following structure:
- h1: "The Future of AI in Software Development"
- Intro paragraph about AI transforming software development
- h2: "AI-Powered Code Generation" with a paragraph and 4 bullet points
- h2: "Automated Testing and Quality Assurance" with a paragraph and 4 bullet points
- A fenced TypeScript code block showing an async function with template literal
- A closing paragraph about developers embracing AI

## Accessibility

- Line number gutter uses aria-hidden="true" so screen readers skip decorative line numbers.
- Toolbar buttons use title attributes ("Bold", "Italic", "Heading", "Code", "List") for tooltip/screen reader labels.
- The textarea has spellCheck={false} for code-oriented editing.

## Complete Usage Example

\`\`\`tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotEditor } from "@/components/copilot-editor";

export default function EditorPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="p-6">
        <CopilotEditor
          initialContent="# My Document\\n\\nStart writing here..."
          className="max-w-5xl mx-auto"
        />
      </div>
      <CopilotPopup
        instructions="You are an AI writing assistant. Help the user edit their markdown document. You can insert text, replace content, format markdown, improve writing quality, and add headings."
        labels={{ title: "Writing Assistant", initial: "How can I help with your document?" }}
      />
    </CopilotKit>
  );
}
\`\`\``,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-timeline"',
    copyPrompt: `Create a CopilotTimeline — an AI-powered project milestone timeline built with CopilotKit and React that displays milestones along a vertical axis with alternating card layout on desktop and stacked layout on mobile, with four AI actions for adding, removing, updating, and reordering milestones.

## Core Concept

CopilotTimeline is a visual project timeline that shows milestones as cards positioned along a vertical center line. On desktop, cards alternate left and right; on mobile, they stack on the left side. Each milestone has a status (pending, in-progress, or completed) shown as a colored dot on the timeline axis. The AI integration allows users to manage the timeline through natural language — "add a milestone for code review next week" or "mark the Alpha Release as completed" — and each AI modification triggers a brief pulse animation on the affected card.

## Dependencies

Install the following npm packages:
- @copilotkit/react-core (for useCopilotReadable and useCopilotAction hooks)
- @copilotkit/react-ui (for CopilotPopup or CopilotSidebar)
- lucide-react (for icons: Circle, CheckCircle2, Clock, Loader2, Sparkles, CheckCircle)
- Tailwind CSS with dark theme
- A \`cn\` utility function for conditional class merging

## TypeScript Interfaces

\`\`\`typescript
export interface TimelineMilestone {
  id: string;            // Unique identifier, e.g. "ms-1" or "ms-{timestamp}-{random}"
  title: string;         // Short milestone title, e.g. "Project Kickoff"
  description: string;   // Brief description of the milestone's scope
  date: string;          // Display date string, e.g. "Jan 15, 2025"
  status: "pending" | "in-progress" | "completed";  // Current milestone status
}

interface CopilotTimelineProps {
  initialMilestones?: TimelineMilestone[];  // Optional custom milestones; defaults to 8 sample milestones
  className?: string;                       // Optional additional CSS classes
}
\`\`\`

## Component Props

- \`initialMilestones\` (TimelineMilestone[], optional): Array of milestone objects to populate the timeline. If not provided, 8 default milestones are used spanning a product launch lifecycle.
- \`className\` (string, optional): Appended to the root div for external styling.

## State Management

1. \`milestones\` (TimelineMilestone[]): The array of all milestones. Initialized to \`initialMilestones ?? defaultMilestones\`.
2. \`pulsingIds\` (Set<string>): A Set tracking which milestone IDs are currently showing the pulse animation. Managed via a \`triggerPulse\` callback.

Additional refs:
- \`pulseTimeouts\` (useRef<Map<string, ReturnType<typeof setTimeout>>>): Maps milestone IDs to their active pulse timeout handles so they can be cleared and re-triggered.

## Pulse Animation System

The \`triggerPulse(milestoneId: string)\` callback (useCallback):
1. Clears any existing timeout for that milestone ID.
2. Adds the milestone ID to the \`pulsingIds\` Set.
3. Sets a 1500ms timeout that removes the ID from the Set and cleans up the timeout map.
This creates a brief glow animation on the card whenever the AI modifies a milestone.

## Status Configuration

A \`statusConfig\` object maps each status to visual properties:

\`\`\`typescript
const statusConfig = {
  completed: {
    color: "bg-emerald-500",
    border: "border-emerald-500",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,  // from lucide-react
    label: "Completed",
  },
  "in-progress": {
    color: "bg-blue-500",
    border: "border-blue-500",
    text: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: Clock,
    label: "In Progress",
  },
  pending: {
    color: "bg-muted",
    border: "border-muted",
    text: "text-muted-foreground",
    badge: "bg-muted/50 text-muted-foreground border-border/50",
    icon: Circle,
    label: "Pending",
  },
};
\`\`\`

## useCopilotReadable Configuration

\`\`\`typescript
useCopilotReadable({
  description: "Current project timeline milestones with their titles, descriptions, dates, and statuses (pending, in-progress, completed)",
  value: {
    totalMilestones: milestones.length,
    completed: milestones.filter((m) => m.status === "completed").length,
    inProgress: milestones.filter((m) => m.status === "in-progress").length,
    pending: milestones.filter((m) => m.status === "pending").length,
    milestones,  // The full array of TimelineMilestone objects
  },
});
\`\`\`

## useCopilotAction Definitions

### Action 1: addMilestone
- **Name**: "addMilestone"
- **Description**: "Add a new milestone to the project timeline. It will be appended at the end by default."
- **Parameters**:
  - \`title\` (string, required): "The title of the milestone"
  - \`description\` (string, required): "A brief description of the milestone"
  - \`date\` (string, required): "The target date for the milestone (e.g. 'Jul 1, 2025')"
  - \`status\` (string, optional): "The status of the milestone: \\"pending\\", \\"in-progress\\", or \\"completed\\""
- **Handler**: Generates a unique ID using \`ms-\${Date.now()}-\${Math.random().toString(36).slice(2, 7)}\`. Creates a new TimelineMilestone with the provided fields (defaulting status to "pending" if not provided). Appends it to the milestones array. Calls \`triggerPulse(newId)\`. Returns "Added milestone \\"{title}\\" on {date}".
- **Render (inProgress)**: Loader2 spinner with text-emerald-400, "Adding milestone...".
- **Render (complete)**: Border border-emerald-500/30, bg-emerald-500/10, text-emerald-400, CheckCircle, "Added milestone **{title}** ({date})".

### Action 2: removeMilestone
- **Name**: "removeMilestone"
- **Description**: "Remove a milestone from the timeline by its ID"
- **Parameters**:
  - \`milestoneId\` (string, required): Dynamic description listing current milestones and their IDs, e.g., "The ID of the milestone to remove. Current milestones: ms-1 (Project Kickoff), ms-2 (User Research), ..."
- **Handler**: Finds the target milestone. If not found, returns an error string. Otherwise filters it out of the array. Returns "Removed milestone \\"{title}\\"".
- **Render (inProgress)**: Loader2 with text-red-400, "Removing milestone...".
- **Render (complete)**: Border border-red-500/30, bg-red-500/10, text-red-400, "Removed milestone **{milestoneId}**".

### Action 3: updateStatus
- **Name**: "updateStatus"
- **Description**: "Update the status of a milestone to \\"pending\\", \\"in-progress\\", or \\"completed\\""
- **Parameters**:
  - \`milestoneId\` (string, required): Dynamic description listing current milestone IDs and titles.
  - \`status\` (string, required): "The new status: \\"pending\\", \\"in-progress\\", or \\"completed\\""
- **Handler**: Validates the status against ["pending", "in-progress", "completed"]. If invalid, returns error. Finds the target; if not found, returns error. Maps over milestones to update the matching one. Calls \`triggerPulse(milestoneId)\`. Returns "Updated \\"{title}\\" status to {status}".
- **Render (inProgress)**: Loader2 with text-blue-400, "Updating status...".
- **Render (complete)**: Border border-blue-500/30, bg-blue-500/10, text-blue-400, "Updated **{milestoneId}** to **{status}**".

### Action 4: reorderTimeline
- **Name**: "reorderTimeline"
- **Description**: "Reorder the timeline milestones by providing the milestone IDs in the desired order"
- **Parameters**:
  - \`milestoneIds\` (string[], required): Dynamic description listing current IDs, "Array of milestone IDs in the desired order."
- **Handler**: Creates a Map from current milestones by ID. Maps the provided ID array through the Map to build the reordered array, filtering out any not found. Calls \`triggerPulse\` on each ID. Returns "Reordered {count} milestone(s)".
- **Render (inProgress)**: Loader2 with text-violet-400, "Reordering timeline...".
- **Render (complete)**: Border border-violet-500/30, bg-violet-500/10, text-violet-400, "Reordered **{count}** milestone(s)".

## Layout & Structure

The root element is a \`div\` with "relative w-full py-8".

1. **Header**: A flex row (mb-8) with:
   - Sparkles icon (h-5 w-5 text-violet-400)
   - h2 "Project Timeline" (text-lg font-semibold)
   - Right-aligned completion count: "{completed}/{total} completed" (text-xs text-muted-foreground)

2. **Timeline container** (relative div):
   - **Desktop center line**: An absolutely positioned div at left-1/2, full height, w-0.5, bg-border/50. Hidden on mobile (hidden md:block).
   - **Mobile left line**: An absolutely positioned div at left-4, full height, w-0.5, bg-border/50. Visible only on mobile (block md:hidden).

3. **Milestone cards**: A space-y-8 (md:space-y-12) container. Each milestone renders:
   - A relative flex container that is left-aligned with pl-12 on mobile, and alternates between flex-row (even index) and flex-row-reverse (odd index) on desktop with md:pl-0.
   - **Mobile status dot**: Absolutely positioned at left-2.5 top-1, h-3.5 w-3.5 rounded-full with border-2 in the status color, containing an inner dot (h-1.5 w-1.5). Hidden on desktop (md:hidden). Gets animate-pulse when isPulsing.
   - **Desktop status dot**: Absolutely positioned at left-1/2 top-3, h-4 w-4, -translate-x-1/2, border-2 in status color, inner dot h-2 w-2. Hidden on mobile (hidden md:flex). Gets animate-pulse when isPulsing.
   - **Card**: Width w-full (md:w-[calc(50%-2rem)]). Contains a rounded-lg div with border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:shadow-sm. When pulsing: border-violet-500/60 shadow-[0_0_12px_rgba(139,92,246,0.3)].
     - Date and status badge row (mb-2, flex justify-between): date in text-xs text-muted-foreground, status badge with the StatusIcon (h-3 w-3) and label in a rounded-full pill using the config.badge colors at text-[10px] font-medium.
     - Title: h3 with text-sm font-semibold.
     - Description: p with mt-1 text-xs leading-relaxed text-muted-foreground.
     - Milestone ID: mt-3 font-mono text-[10px] text-muted-foreground/60.

4. **Empty state**: When milestones.length === 0, show a centered dashed border container with Circle icon and "No milestones yet. Ask the AI to add one!" message.

## Styling Specifications

- **Status colors**: emerald-500 (completed), blue-500 (in-progress), muted (pending)
- **Action colors**: emerald (add), red (remove), blue (update status), violet (reorder)
- **Pulse glow**: border-violet-500/60 shadow-[0_0_12px_rgba(139,92,246,0.3)] with animate-pulse class
- **Card hover**: border-border/80 hover:shadow-sm transition-all duration-300
- **Badge styling**: rounded-full border px-2 py-0.5 text-[10px] font-medium with status-specific bg/text/border colors at /10, /400, /30 opacity levels
- **Backdrop**: bg-card/50 backdrop-blur-sm on cards

## Animation Details

- The pulse effect uses Tailwind's built-in \`animate-pulse\` class on the status indicator dots.
- The pulse is triggered by \`triggerPulse\` and lasts 1500ms before auto-clearing.
- Cards have a transition-all duration-300 for smooth hover and pulse state changes.
- The violet glow shadow (0_0_12px with rgba(139,92,246,0.3)) appears alongside the pulse.

## Sample Data

8 default milestones representing a product launch lifecycle:
1. "Project Kickoff" — "Initial planning, team alignment, and project scope definition" — Jan 15, 2025 — completed
2. "User Research" — "Conduct user interviews, surveys, and competitive analysis" — Feb 1, 2025 — completed
3. "Design Phase" — "Create wireframes, prototypes, and finalize the design system" — Feb 20, 2025 — completed
4. "Development Sprint 1" — "Core feature implementation and infrastructure setup" — Mar 15, 2025 — completed
5. "Alpha Release" — "Internal release for early testing and feedback collection" — Apr 10, 2025 — in-progress
6. "Beta Launch" — "Public beta release with limited feature set for early adopters" — May 1, 2025 — pending
7. "QA & Testing" — "Comprehensive quality assurance, performance, and security testing" — May 20, 2025 — pending
8. "GA Launch" — "General availability release with full feature set and documentation" — Jun 15, 2025 — pending

## Accessibility

- The mobile and desktop status indicators use visual-only elements; the status is also communicated through the badge text label inside each card.
- The component is keyboard-navigable through normal DOM flow.
- Color is not the sole indicator of status — each status also has a text label in the badge ("Completed", "In Progress", "Pending").

## Complete Usage Example

\`\`\`tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotTimeline } from "@/components/copilot-timeline";
import type { TimelineMilestone } from "@/components/copilot-timeline";

const myMilestones: TimelineMilestone[] = [
  {
    id: "m-1",
    title: "Requirements Gathering",
    description: "Define project scope and gather stakeholder requirements",
    date: "Mar 1, 2025",
    status: "completed",
  },
  {
    id: "m-2",
    title: "Architecture Design",
    description: "Design system architecture and technical specifications",
    date: "Mar 15, 2025",
    status: "in-progress",
  },
  {
    id: "m-3",
    title: "Implementation",
    description: "Build core features and integrate services",
    date: "Apr 15, 2025",
    status: "pending",
  },
];

export default function TimelinePage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="p-6 max-w-4xl mx-auto">
        <CopilotTimeline initialMilestones={myMilestones} />
      </div>
      <CopilotPopup
        instructions="You are a project management assistant. Help the user manage their project timeline. You can add milestones, remove them, update their status, and reorder the timeline."
        labels={{ title: "Timeline Assistant", initial: "How can I help with your timeline?" }}
      />
    </CopilotKit>
  );
}
\`\`\``,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-notifications"',
    copyPrompt: `Create a CopilotNotifications — an AI-powered notification center built with CopilotKit and React that provides filterable tabs, priority-based color coding, dismissal animations, and six AI actions for marking as read, dismissing, categorizing, prioritizing, and summarizing notifications.

## Core Concept

CopilotNotifications is a full-featured notification inbox with filter tabs (All, Unread, Alerts, Messages), priority-coded left borders, type icons, and badge indicators. The AI integration allows users to triage notifications through natural language — "mark all urgent alerts as read", "categorize the billing notifications as finance", or "summarize my unread notifications". Each notification has a type (alert, message, update, reminder), a priority level (low, medium, high, urgent), read/unread status, and an optional category label. Dismissed notifications fade out with a slide animation before being removed.

## Dependencies

Install the following npm packages:
- @copilotkit/react-core (for useCopilotReadable and useCopilotAction hooks)
- @copilotkit/react-ui (for CopilotPopup or CopilotSidebar)
- lucide-react (for icons: Bell, AlertTriangle, MessageSquare, Info, X, Loader2, CheckCircle, Sparkles)
- Tailwind CSS with dark theme
- A \`cn\` utility function for conditional class merging
- A Badge component from your UI library (e.g., @/components/ui/badge)

## TypeScript Interfaces

\`\`\`typescript
export interface NotificationItem {
  id: string;              // Unique identifier, e.g. "notif-1"
  title: string;           // Short notification title
  message: string;         // Full notification message text
  type: "alert" | "message" | "update" | "reminder";  // Notification type
  priority: "low" | "medium" | "high" | "urgent";     // Priority level
  read: boolean;           // Whether the notification has been read
  timestamp: string;       // Display timestamp, e.g. "2 minutes ago"
  category?: string;       // Optional category label assigned by AI, e.g. "work", "billing"
}

type FilterTab = "all" | "unread" | "alerts" | "messages";

interface CopilotNotificationsProps {
  initialNotifications?: NotificationItem[];  // Optional custom notifications; defaults to 10 samples
  className?: string;                         // Optional additional CSS classes
}
\`\`\`

## Component Props

- \`initialNotifications\` (NotificationItem[], optional): Defaults to \`defaultNotifications\` — an array of 10 sample notifications.
- \`className\` (string, optional): Appended to the root div.

## State Management

1. \`notifications\` (NotificationItem[]): The full array of notification objects.
2. \`activeTab\` (FilterTab): The currently active filter tab. Initialized to "all".
3. \`dismissingIds\` (Set<string>): Tracks which notification IDs are currently in the dismiss animation (opacity fade + translate).

Computed values (useMemo):
- \`filteredNotifications\`: Derived from \`notifications\` based on \`activeTab\` — "unread" filters to !n.read, "alerts" filters to type === "alert", "messages" filters to type === "message", "all" returns everything.
- \`unreadCount\`: Count of notifications where read === false.

## Dismiss Animation System

The \`dismissNotification(id: string)\` callback (useCallback):
1. Adds the ID to \`dismissingIds\` Set, which triggers CSS classes "opacity-0 translate-x-4" on that notification row.
2. After a 300ms setTimeout, removes the notification from the array and cleans up the dismissingIds Set.

## Color Configuration Maps

**Priority border colors** (left border of each notification row):
\`\`\`typescript
const priorityBorderColors = {
  urgent: "border-l-red-500",
  high: "border-l-amber-500",
  medium: "border-l-blue-500",
  low: "border-l-muted",
};
\`\`\`

**Priority badge colors**:
\`\`\`typescript
const priorityBadgeColors = {
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  low: "bg-muted/50 text-muted-foreground border-border/50",
};
\`\`\`

**Type icons** (displayed to the left of each notification):
- alert: AlertTriangle with text-red-400
- message: MessageSquare with text-blue-400
- update: Info with text-emerald-400
- reminder: Bell with text-amber-400

**Type badge colors**:
\`\`\`typescript
const typeBadgeColors = {
  alert: "bg-red-500/10 text-red-400 border-red-500/20",
  message: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  update: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  reminder: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};
\`\`\`

## useCopilotReadable Configuration

\`\`\`typescript
useCopilotReadable({
  description: "Current notification center state including all notifications with their read status, priority, type, and category",
  value: {
    totalNotifications: notifications.length,
    unreadCount,
    activeFilter: activeTab,
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      priority: n.priority,
      read: n.read,
      timestamp: n.timestamp,
      category: n.category,
    })),
  },
});
\`\`\`

## useCopilotAction Definitions

### Action 1: markAsRead
- **Name**: "markAsRead"
- **Description**: "Mark one or more notifications as read. Provide an array of notification IDs to mark as read, or pass a single ID."
- **Parameters**:
  - \`notificationIds\` (string[], required): "Array of notification IDs to mark as read"
- **Handler**: Creates a Set from the IDs, maps over notifications setting read=true for matching IDs. Returns "Marked {count} notification(s) as read".
- **Render (inProgress)**: Loader2 with text-emerald-400, "Marking as read...".
- **Render (complete)**: Border border-emerald-500/30, bg-emerald-500/10, text-emerald-400, "Marked **{count}** notification(s) as read".

### Action 2: dismissNotification
- **Name**: "dismissNotification"
- **Description**: "Dismiss and remove one or more notifications from the list. The notifications will fade out before being removed."
- **Parameters**:
  - \`notificationIds\` (string[], required): "Array of notification IDs to dismiss"
- **Handler**: Iterates over IDs and calls \`dismissNotification(id)\` for each. Returns "Dismissed {count} notification(s)".
- **Render (inProgress)**: Loader2 with text-red-400, "Dismissing notifications...".
- **Render (complete)**: Border border-red-500/30, bg-red-500/10, text-red-400, "Dismissed **{count}** notification(s)".

### Action 3: categorize
- **Name**: "categorize"
- **Description**: "Assign a category label to one or more notifications for organizational purposes"
- **Parameters**:
  - \`notificationIds\` (string[], required): "Array of notification IDs to categorize"
  - \`category\` (string, required): "The category label to assign (e.g., 'work', 'personal', 'infrastructure', 'billing')"
- **Handler**: Creates a Set from IDs, maps over notifications to set \`category\` on matching IDs. Returns "Categorized {count} notification(s) as \\"{category}\\"".
- **Render (inProgress)**: Loader2 with text-violet-400, "Categorizing notifications...".
- **Render (complete)**: Border border-violet-500/30, bg-violet-500/10, text-violet-400, "Categorized **{count}** notification(s) as **{category}**".

### Action 4: prioritize
- **Name**: "prioritize"
- **Description**: "Change the priority level of one or more notifications. Valid priorities: low, medium, high, urgent."
- **Parameters**:
  - \`notificationIds\` (string[], required): "Array of notification IDs to re-prioritize"
  - \`priority\` (string, required): "The new priority level: \\"low\\", \\"medium\\", \\"high\\", or \\"urgent\\""
- **Handler**: Creates a Set from IDs, maps over notifications to update the priority on matching IDs. Returns "Updated {count} notification(s) to {priority} priority".
- **Render (inProgress)**: Loader2 with text-amber-400, "Updating priority...".
- **Render (complete)**: Border border-amber-500/30, bg-amber-500/10, text-amber-400, "Set **{count}** notification(s) to **{priority}** priority".

### Action 5: summarizeAll
- **Name**: "summarizeAll"
- **Description**: "Generate a summary of all current notifications. Returns a structured overview of the notification center state for the AI to present to the user."
- **Parameters**: None (empty array).
- **Handler**: Computes counts by priority (urgent, high) and by type (alerts, messages). Collects unique categories. Builds a JSON object with total, unread, byPriority, byType, categories, and topUrgent (filtered to urgent/high priority items with id, title, type). Returns JSON.stringify of that object.
- **Render (inProgress)**: Loader2 with text-blue-400, "Summarizing notifications...".
- **Render (complete)**: Border border-blue-500/30, bg-blue-500/10, text-blue-400, "Notification summary generated".

## Layout & Structure

The root element is a flex column with "w-full max-w-xl". From top to bottom:

1. **Header**: A flex row with justify-between, px-4 py-3, border-b border-border/50. Contains:
   - Left: Bell icon (h-5 w-5), "Notifications" title (text-sm font-semibold), and a red unread count badge (rounded-full bg-red-500 text-white text-[10px] min-w-[18px]) shown only when unreadCount > 0.
   - Right: A "Mark all read" button (text-xs text-muted-foreground hover:text-foreground) that sets all notifications to read=true.

2. **Filter tabs**: A flex row with gap-1, px-4 py-2, border-b border-border/30. Four tab buttons:
   - Each button: rounded-md px-2.5 py-1.5 text-xs font-medium. Active tab uses bg-muted text-foreground; inactive uses text-muted-foreground hover:text-foreground hover:bg-muted/50.
   - Each tab shows a count badge (rounded-full px-1.5 py-0.5 text-[10px]) when count > 0.
   - Tabs: All ({total}), Unread ({unreadCount}), Alerts ({alertCount}), Messages ({messageCount}).

3. **Notification list**: A flex-1 overflow-y-auto container.
   - **Empty state**: Centered Sparkles icon (h-8 w-8 text-muted-foreground/40) with "No notifications" and "You're all caught up!" text.
   - **Notification rows**: Each row is a flex gap-3 container with border-b border-border/20 border-l-4 px-4 py-3 transition-all duration-300. Priority determines the border-l color. Unread notifications get bg-muted/20. Dismissing notifications get "opacity-0 translate-x-4".
     - **Type icon**: mt-0.5 shrink-0, renders the type-specific icon.
     - **Content area** (flex-1 min-w-0):
       - Title row: flex items-start justify-between. Left side has an unread dot (h-2 w-2 rounded-full bg-blue-500) and the title (text-sm, font-semibold if unread, font-medium text-foreground/80 if read, truncate). Right side has an X dismiss button (h-3.5 w-3.5) with aria-label.
       - Message: text-xs text-muted-foreground leading-relaxed line-clamp-2.
       - Badge row (mt-2 flex items-center gap-2 flex-wrap): Priority Badge, Type Badge, optional Category Badge (bg-violet-500/10 text-violet-400 border-violet-500/20), and right-aligned timestamp (text-[10px] text-muted-foreground/60).

4. **Footer**: border-t border-border/50 px-4 py-2 text-xs text-muted-foreground. Shows "{filtered} of {total} notifications" on left and "{unread} unread" in text-blue-400 on right when unreadCount > 0.

## Styling Specifications

- **Priority left borders**: red-500 (urgent), amber-500 (high), blue-500 (medium), muted (low)
- **Type icon colors**: red-400 (alert), blue-400 (message), emerald-400 (update), amber-400 (reminder)
- **Badge sizes**: text-[10px] font-medium capitalize
- **Unread indicator**: h-2 w-2 rounded-full bg-blue-500
- **Header unread badge**: bg-red-500 text-white rounded-full min-w-[18px]
- **Dismiss animation**: opacity-0 translate-x-4 transition-all duration-300 (300ms delay before removal)

## Sample Data

10 default notifications:
1. "Deployment Failed" — urgent alert, unread, 2 minutes ago
2. "New PR Review Request" — high message, unread, 15 minutes ago
3. "System Update Available" — medium update, read, 1 hour ago
4. "Meeting in 30 minutes" — medium reminder, unread, 30 minutes ago
5. "Disk Usage Warning" — high alert, unread, 45 minutes ago
6. "Team message from Alex" — low message, read, 2 hours ago
7. "Invoice Payment Due" — high reminder, unread, 3 hours ago
8. "New Feature Released" — low update, read, 5 hours ago
9. "Security Scan Complete" — medium alert, read, 6 hours ago
10. "Welcome to the team!" — low message, read, 1 day ago

## Accessibility

- Each dismiss button has an aria-label of "Dismiss {notification.title}".
- The unread dot is a purely visual indicator supplemented by font-weight difference (font-semibold vs font-medium) for unread vs read.
- Tab buttons provide clear interactive targets with hover state feedback.
- The notification list is scrollable with overflow-y-auto.

## Complete Usage Example

\`\`\`tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotNotifications } from "@/components/copilot-notifications";
import type { NotificationItem } from "@/components/copilot-notifications";

const myNotifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "Build Failed",
    message: "CI pipeline failed on main branch. Check logs for details.",
    type: "alert",
    priority: "urgent",
    read: false,
    timestamp: "5 minutes ago",
  },
  {
    id: "n-2",
    title: "New Comment on PR #42",
    message: "Sarah left feedback on your pull request.",
    type: "message",
    priority: "medium",
    read: false,
    timestamp: "20 minutes ago",
  },
  {
    id: "n-3",
    title: "Weekly Report Ready",
    message: "Your team performance report for this week is available.",
    type: "update",
    priority: "low",
    read: true,
    timestamp: "1 hour ago",
  },
];

export default function NotificationsPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="flex justify-center p-6">
        <CopilotNotifications initialNotifications={myNotifications} />
      </div>
      <CopilotPopup
        instructions="You are a notification triage assistant. Help the user manage their notifications. You can mark notifications as read, dismiss them, assign categories, change priority levels, and summarize all notifications."
        labels={{ title: "Notification Assistant", initial: "How can I help with your notifications?" }}
      />
    </CopilotKit>
  );
}
\`\`\``,
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
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/copilot-search"',
    copyPrompt: `Create a CopilotSearch — an AI-powered product search interface built with CopilotKit and React that provides text search, category filter chips, sortable results in a responsive grid, star ratings, stock indicators, and five AI actions for searching, filtering, removing filters, sorting, and highlighting products.

## Core Concept

CopilotSearch is a searchable product catalog with a search bar, active filter chips, sort controls, and a card grid of results. Users can type queries to filter by name, category, or description, or they can ask the AI "show me books under $50" or "sort by rating descending" and the AI drives the interface through registered actions. Products matching AI highlights get a brief violet glow effect. The component supports adding multiple filter chips that are combined with the text search for progressive filtering.

## Dependencies

Install the following npm packages:
- @copilotkit/react-core (for useCopilotReadable and useCopilotAction hooks)
- @copilotkit/react-ui (for CopilotPopup or CopilotSidebar)
- lucide-react (for icons: Search, X, Star, Loader2, CheckCircle, Sparkles)
- Tailwind CSS with dark theme
- A \`cn\` utility function for conditional class merging
- An Input component from your UI library (e.g., @/components/ui/input)
- A Badge component from your UI library (e.g., @/components/ui/badge)

## TypeScript Interfaces

\`\`\`typescript
export interface Product {
  id: string;           // Unique identifier, e.g. "e1", "b2", "c3", "h4"
  name: string;         // Product name, e.g. "Wireless Headphones"
  category: string;     // Category name, e.g. "Electronics", "Books", "Clothing", "Home"
  price: number;        // Price in dollars as an integer, e.g. 79
  rating: number;       // Rating from 1.0 to 5.0, e.g. 4.5
  description: string;  // Product description text
  inStock: boolean;     // Whether the product is currently in stock
}

interface CopilotSearchProps {
  products?: Product[];  // Optional product catalog; defaults to 16 sample products
  className?: string;    // Optional additional CSS classes
}

type SortField = "price" | "rating" | "name";
type SortDirection = "asc" | "desc";

interface SortOrder {
  field: SortField;       // Which field to sort by
  direction: SortDirection; // Ascending or descending
}
\`\`\`

## Component Props

- \`products\` (Product[], optional): Defaults to DEFAULT_PRODUCTS — a catalog of 16 items across 4 categories.
- \`className\` (string, optional): Appended to the root div.

## State Management

1. \`query\` (string): The current text search query. Initialized to "".
2. \`filters\` (string[]): Array of active filter chip strings (category names or keywords). Initialized to [].
3. \`sortOrder\` (SortOrder | null): Current sort configuration. Initialized to null (no sort).
4. \`highlightedId\` (string | null): The product ID currently being highlighted with a glow effect. Null when no highlight is active.

Additional refs:
- \`highlightTimeout\` (useRef<NodeJS.Timeout | null>): Tracks the timeout for clearing the highlight glow.

Computed values (useMemo):
- \`filteredResults\`: Derived from products by applying in order: (1) text search — filters where name, category, or description includes the lowercase query; (2) category filters — if filters.length > 0, keeps products where category matches or name includes any filter string (case-insensitive); (3) sort — if sortOrder is set, sorts by the specified field and direction. Price and rating sort numerically; name sorts with localeCompare.

## Highlight System

The \`triggerHighlight(productId: string)\` callback (useCallback):
1. Sets \`highlightedId\` to the product ID.
2. Clears any existing timeout.
3. Sets a 1500ms timeout to set \`highlightedId\` back to null.

## StarRating Sub-component

A helper component \`StarRating({ rating }: { rating: number })\` that renders 5 Star icons in a flex row:
- Filled stars (index < Math.round(rating)): "fill-amber-400 text-amber-400"
- Unfilled stars: "text-muted-foreground/30"
- Each star is h-3.5 w-3.5
- Followed by a text span with the numeric rating value (text-xs text-muted-foreground, ml-1)

## useCopilotReadable Configuration

\`\`\`typescript
useCopilotReadable({
  description: "Current search interface state including results, active filters, and sort order",
  value: {
    query,
    totalProducts: products.length,
    visibleResults: filteredResults.length,
    activeFilters: filters,
    sortOrder,
    results: filteredResults.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating,
      inStock: p.inStock,
    })),
    availableCategories: [...new Set(products.map((p) => p.category))],
  },
});
\`\`\`

## useCopilotAction Definitions

### Action 1: search
- **Name**: "search"
- **Description**: "Search for products by name, category, or description. Sets the search query text."
- **Parameters**:
  - \`query\` (string, required): "The search query to filter products"
- **Handler**: Calls \`setQuery(searchQuery)\`. Returns "Search updated to \\"{searchQuery}\\"".
- **Render (inProgress)**: Loader2 with text-violet-400, "Searching...".
- **Render (complete)**: Border border-violet-500/30, bg-violet-500/10, text-violet-400, "Searched for **\\"{query}\\"**".

### Action 2: addFilter
- **Name**: "addFilter"
- **Description**: "Add a filter chip to narrow down results by category or keyword. Available categories: Electronics, Books, Clothing, Home."
- **Parameters**:
  - \`filter\` (string, required): "The filter value to add (e.g., a category name)"
- **Handler**: Checks for duplicates (case-insensitive). If not already present, appends to the filters array. Returns "Filter \\"{filter}\\" added".
- **Render (inProgress)**: Loader2 with text-emerald-400, "Adding filter...".
- **Render (complete)**: Border border-emerald-500/30, bg-emerald-500/10, text-emerald-400, "Added filter **\\"{filter}\\"**".

### Action 3: removeFilter
- **Name**: "removeFilter"
- **Description**: "Remove an active filter chip from the search results"
- **Parameters**:
  - \`filter\` (string, required): "The filter value to remove"
- **Handler**: Filters the filters array to remove the matching string (case-insensitive). Returns "Filter \\"{filter}\\" removed".
- **Render (inProgress)**: Loader2 with text-rose-400, "Removing filter...".
- **Render (complete)**: Border border-rose-500/30, bg-rose-500/10, text-rose-400, "Removed filter **\\"{filter}\\"**".

### Action 4: sortResults
- **Name**: "sortResults"
- **Description**: "Sort search results by a specific field in ascending or descending order"
- **Parameters**:
  - \`field\` (string, required): "The field to sort by: 'price', 'rating', or 'name'"
  - \`direction\` (string, required): "Sort direction: 'asc' for ascending or 'desc' for descending"
- **Handler**: Validates field against ["price", "rating", "name"]. If invalid, returns error. Sets \`sortOrder\` to { field, direction }. Returns "Results sorted by {field} {direction}ending".
- **Render (inProgress)**: Loader2 with text-blue-400, "Sorting results...".
- **Render (complete)**: Border border-blue-500/30, bg-blue-500/10, text-blue-400, "Sorted by **{field}** ascending/descending".

### Action 5: highlightResult
- **Name**: "highlightResult"
- **Description**: "Highlight a specific product result to draw attention to it. The highlight will glow briefly."
- **Parameters**:
  - \`productId\` (string, required): "The product ID to highlight (e.g., 'e1', 'b2', 'c3', 'h4')"
- **Handler**: Finds the product by ID. If not found, returns error. Calls \`triggerHighlight(productId)\`. Returns "Highlighted \\"{product.name}\\"".
- **Render (inProgress)**: Loader2 with text-amber-400, "Highlighting result...".
- **Render (complete)**: Border border-amber-500/30, bg-amber-500/10, text-amber-400, "Highlighted product **{productId}**".

## Layout & Structure

The root element is a div with "w-full space-y-4". From top to bottom:

1. **Search bar**: A relative container with a Search icon absolutely positioned (left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground) and an Input element with type="text", placeholder "Search products...", and className "pl-10".

2. **Active filter chips** (shown only when filters.length > 0): A flex flex-wrap items-center gap-2 container. Each filter is a Badge with variant="secondary" and classes "gap-1.5 bg-violet-500/10 text-violet-400 border border-violet-500/30 pr-1.5". Each has an X button (h-3 w-3) with hover:bg-violet-500/20. A "Clear all" button at the end (text-xs text-muted-foreground) resets filters, sortOrder, and query.

3. **Result count bar**: A flex items-center justify-between text-sm text-muted-foreground. Left side: "Showing {filtered} of {total} products". Right side (when sortOrder is set): Sparkles icon (h-3 w-3 text-blue-400) with "Sorted by {field} ascending/descending".

4. **Results grid**:
   - **Empty state**: A centered container with border-border/50 py-12. Search icon (h-8 w-8 text-muted-foreground/40), "No products found." and "Try adjusting your search or filters."
   - **Product cards**: A grid grid-cols-1 md:grid-cols-2 gap-4 container. Each card is a rounded-lg border-border/50 bg-card/50 p-4 transition-all duration-300. Highlighted cards get "border-violet-500/60 shadow-[0_0_0_1px_rgba(139,92,246,0.3),0_0_16px_rgba(139,92,246,0.25)]". Non-highlighted cards get "hover:border-border hover:bg-card/80".
     - **Header**: flex items-start justify-between. Product name (font-medium text-foreground) and category Badge (variant="secondary", text-[10px] px-2 py-0.5, shrink-0).
     - **Price and rating** (mt-2 flex items-center justify-between): Price as "\${price}" (text-lg font-semibold), StarRating component.
     - **Description** (mt-2): text-xs leading-relaxed text-muted-foreground.
     - **Stock indicator** (mt-3 flex items-center gap-1.5): A small dot (h-2 w-2 rounded-full, bg-emerald-400 if in stock, bg-red-400 if not) and text label ("In Stock" in text-emerald-400 or "Out of Stock" in text-red-400, text-xs).

## Styling Specifications

- **Color palette**: violet-400/500 (search, filters, highlight glow), emerald-400/500 (add filter, in-stock), rose-400/500 (remove filter), blue-400/500 (sort), amber-400/500 (highlight, star ratings), red-400 (out of stock)
- **Highlight glow**: border-violet-500/60 with box-shadow "0_0_0_1px_rgba(139,92,246,0.3),0_0_16px_rgba(139,92,246,0.25)" — a double-layer glow effect. Duration 1500ms.
- **Card transitions**: transition-all duration-300 on all cards for smooth hover and highlight states.
- **Filter chips**: bg-violet-500/10 text-violet-400 border-violet-500/30 with X button having hover:bg-violet-500/20 transition-colors.
- **Star ratings**: fill-amber-400 text-amber-400 for filled stars, text-muted-foreground/30 for unfilled.

## Sample Data (DEFAULT_PRODUCTS)

16 products across 4 categories (4 per category):

**Electronics**: Wireless Headphones ($79, 4.5), Smart Watch ($199, 4.2), Bluetooth Speaker ($49, 4.7), USB-C Hub ($35, 4.0, out of stock)
**Books**: Clean Code ($42, 4.8), Design Patterns ($55, 4.6), The Pragmatic Programmer ($45, 4.9), Refactoring ($48, 4.4, out of stock)
**Clothing**: Tech Hoodie ($65, 4.3), Running Shoes ($120, 4.6), Casual Backpack ($85, 4.5), Wool Beanie ($25, 4.1, out of stock)
**Home**: Desk Lamp ($38, 4.4), Standing Desk Mat ($45, 4.2), Mechanical Keyboard ($149, 4.8), Monitor Light Bar ($55, 4.6)

Each product includes a descriptive sentence highlighting its key feature.

## Accessibility

- The search Input is a standard HTML input element with type="text" and a placeholder for screen readers.
- Filter chip dismiss buttons are standard buttons.
- The stock indicator uses both color and text to communicate status.
- Star ratings include a numeric text label alongside the visual stars.

## Complete Usage Example

\`\`\`tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotSearch } from "@/components/copilot-search";
import type { Product } from "@/components/copilot-search";

const myProducts: Product[] = [
  {
    id: "p1",
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 299,
    rating: 4.7,
    description: "Adjustable office chair with lumbar support and breathable mesh back.",
    inStock: true,
  },
  {
    id: "p2",
    name: "Standing Desk",
    category: "Furniture",
    price: 449,
    rating: 4.5,
    description: "Electric height-adjustable standing desk with memory presets.",
    inStock: true,
  },
  {
    id: "p3",
    name: "Noise-Canceling Earbuds",
    category: "Audio",
    price: 129,
    rating: 4.3,
    description: "True wireless earbuds with active noise cancellation.",
    inStock: false,
  },
];

export default function SearchPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="p-6 max-w-4xl mx-auto">
        <CopilotSearch products={myProducts} />
      </div>
      <CopilotPopup
        instructions="You are a product search assistant. Help the user find products by searching, filtering by category, sorting by price or rating, and highlighting specific results. Available categories depend on the product catalog."
        labels={{ title: "Search Assistant", initial: "What are you looking for?" }}
      />
    </CopilotKit>
  );
}
\`\`\``,
  },
  {
    slug: "animated-shader-hero",
    name: "AnimatedShaderHero",
    description:
      "A stunning WebGL shader-powered hero section with an animated cosmic background, gradient text animations, trust badges, and call-to-action buttons. The shader responds to pointer movement in real time.",
    category: "layout",
    tags: ["WebGL", "shader", "hero", "animation", "landing-page"],
    hooks: [],
    preview: "/previews/animated-shader-hero.png",
    installCommand: 'npx shadcn@latest add "https://agenticui.dev/r/animated-shader-hero"',
    copyPrompt: `Create an AnimatedShaderHero — a full-screen, WebGL2-powered hero section with a real-time animated cosmic/nebula shader background, gradient text animations, a trust badge, and call-to-action buttons. The shader reacts to pointer position and movement.

## Core Concept
AnimatedShaderHero is a visually striking landing page hero section that renders a GLSL fragment shader as its full-screen background using a WebGL2 canvas. The shader generates an animated cosmic/nebula effect using fractional Brownian motion (fBm) noise layered with cloud formations and light particle loops. The foreground content — trust badge, headline, subtitle, CTA buttons — is absolutely positioned over the canvas with staggered fade-in animations. The shader responds to pointer events (mouse/touch), passing movement deltas and coordinates as uniforms to the GPU. The entire component is client-side only ("use client").

## Dependencies
- react (useRef, useEffect)
- No external UI libraries needed — all styling is Tailwind CSS utility classes
- WebGL2 context required in the browser (widely supported)

## Architecture Overview
The component has 5 distinct pieces, all in a single file:
1. **defaultShaderSource** — GLSL ES 3.0 fragment shader source string
2. **WebGLRenderer** — Class that manages WebGL2 context, shader compilation, uniform binding, and rendering
3. **PointerHandler** — Class that manages pointer events (down, up, move, leave) and tracks multi-pointer state
4. **useShaderBackground** — Custom React hook that ties the renderer and pointer handler to a canvas element with resize handling and an animation loop
5. **AnimatedShaderHero** — The React component that renders the canvas, styles overlay, and foreground content

## Complete TypeScript Interfaces

interface HeroProps {
  trustBadge?: {
    text: string;       // Badge text shown next to icons
    icons?: string[];   // Emoji or text icons rendered in the badge (e.g., ["✨", "🚀"])
  };
  headline: {
    line1: string;      // First line of the hero heading (orange-to-yellow gradient)
    line2: string;      // Second line (yellow-to-red gradient)
  };
  subtitle: string;     // Description text below heading
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;   // Additional CSS classes for the root div
}

## GLSL Shader Source (Critical — copy exactly)
The fragment shader MUST be GLSL ES 3.0 (\`#version 300 es\`). It uses:
- \`precision highp float;\`
- Output: \`out vec4 O;\`
- Uniforms: \`uniform vec2 resolution; uniform float time;\`
- Defines: \`FC = gl_FragCoord.xy\`, \`T = time\`, \`R = resolution\`, \`MN = min(R.x,R.y)\`

Key shader functions:
1. \`float rnd(vec2 p)\` — Hash-based pseudo-random using fract/dot
2. \`float noise(in vec2 p)\` — Value noise with bicubic smoothing
3. \`float fbm(vec2 p)\` — 5-octave fractional Brownian motion with a rotating matrix \`mat2(1.,-.5,.2,1.2)\`, halving amplitude each octave
4. \`float clouds(vec2 p)\` — 3-iteration cloud layer mixing fBm results
5. \`void main(void)\` — Normalizes coordinates, computes cloud background, then loops 12 light particles with cosine color offsets, noise-based brightness, and distance-based color mixing to produce the final cosmic effect

The full shader source is ~60 lines. It MUST be stored as a module-level \`const defaultShaderSource\` string (template literal).

## WebGLRenderer Class (Module-level, NOT inside a hook)
\`\`\`
class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null;
  private vs: WebGLShader | null;
  private fs: WebGLShader | null;
  private buffer: WebGLBuffer | null;
  private scale: number;
  private shaderSource: string;
  private mouseMove: number[];    // [dx, dy] accumulated movement
  private mouseCoords: number[];  // [x, y] last pointer position
  private pointerCoords: number[]; // flattened array of all active pointer positions
  private nbrOfPointers: number;

  // Vertex shader: simple passthrough (#version 300 es)
  private vertexSrc: string;
  // Quad vertices: [-1,1, -1,-1, 1,1, 1,-1]
  private vertices: number[];

  constructor(canvas, scale): initializes WebGL2 context, sets viewport
  updateShader(source): reset → setup → init with new fragment source
  updateMove/updateMouse/updatePointerCoords/updatePointerCount: setter methods
  updateScale(scale): updates viewport dimensions
  compile(shader, source): compiles a shader, logs errors
  test(source): compiles fragment shader in isolation, returns error or null
  reset(): detaches/deletes existing shaders and program
  setup(): creates vertex + fragment shaders, compiles, creates program, links
  init(): creates vertex buffer, binds position attribute, gets uniform locations (resolution, time, move, touch, pointerCount, pointers)
  render(now): clears to black, uses program, sets all uniforms, draws TRIANGLE_STRIP of 4 vertices
}
\`\`\`

Key rendering uniforms set each frame:
- \`resolution\`: canvas.width, canvas.height (in device pixels)
- \`time\`: now * 1e-3 (seconds since start from requestAnimationFrame timestamp)
- \`move\`: accumulated pointer movement deltas
- \`touch\`: first pointer position (mapped to canvas coordinates)
- \`pointerCount\`: number of active pointers
- \`pointers\`: flattened array of all pointer positions

## PointerHandler Class (Module-level, NOT inside a hook)
\`\`\`
class PointerHandler {
  private scale: number;
  private active: boolean;
  private pointers: Map<number, number[]>; // pointerId → [x, y] mapped coords
  private lastCoords: number[];
  private moves: number[];

  constructor(element, scale):
    - pointerdown: sets active, maps and stores pointer
    - pointerup/pointerleave: saves last coords if single pointer, deletes pointer, updates active
    - pointermove: if active, updates lastCoords, maps pointer, accumulates movementX/Y to moves

  // Coordinate mapping: (x, y) → [x * scale, element.height - y * scale]
  // This flips Y axis for WebGL coordinate system

  getScale/updateScale: scale getter/setter
  get count: pointers.size
  get move: accumulated [dx, dy]
  get coords: flat array of all pointer positions, or [0,0] if none
  get first: first pointer value or lastCoords
}
\`\`\`

## useShaderBackground Hook
\`\`\`
const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Also refs for animationFrame ID, renderer, and pointer handler

  useEffect(() => {
    // 1. Size canvas: width = window.innerWidth * dpr, height = window.innerHeight * dpr
    //    where dpr = Math.max(1, 0.5 * window.devicePixelRatio)
    // 2. Create WebGLRenderer and PointerHandler with canvas and dpr
    // 3. Call renderer.setup() and renderer.init()
    // 4. Test shader, if valid call renderer.updateShader(defaultShaderSource)
    // 5. Set up resize handler (recalculates canvas size, updates scales)
    // 6. Start animation loop: each frame updates renderer with pointer data, calls render(now)
    // 7. Cleanup: remove resize listener, cancel animation frame, reset renderer
  }, []);

  return canvasRef;
};
\`\`\`

## Animation System (CSS Keyframes)
Create a ShaderHeroStyles component that injects a \`<style>\` element via dangerouslySetInnerHTML with these keyframes:
- \`shader-fade-in-down\`: from { opacity:0, translateY(-20px) } to { opacity:1, translateY(0) } — 0.8s ease-out
- \`shader-fade-in-up\`: from { opacity:0, translateY(30px) } to { opacity:1, translateY(0) } — 0.8s ease-out, starts with opacity:0
- Classes: \`.shader-animate-fade-in-down\`, \`.shader-animate-fade-in-up\`
- Delay classes: \`.shader-delay-200\` (0.2s), \`.shader-delay-400\` (0.4s), \`.shader-delay-600\` (0.6s), \`.shader-delay-800\` (0.8s)

All class names MUST use the \`shader-\` prefix to avoid collisions.

## Component Layout Structure
\`\`\`
<div className="relative w-full h-screen overflow-hidden bg-black {className}">
  <ShaderHeroStyles />
  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain touch-none" style={{ background: "black" }} />

  {/* Foreground overlay — absolutely positioned, z-10 */}
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">

    {/* Trust Badge — shader-animate-fade-in-down */}
    {trustBadge && (
      <div className="mb-8 shader-animate-fade-in-down">
        <div className="flex items-center gap-2 px-6 py-3 bg-orange-500/10 backdrop-blur-md border border-orange-300/30 rounded-full text-sm">
          {/* Icons in yellow-300, text in orange-100 */}
        </div>
      </div>
    )}

    <div className="text-center space-y-6 max-w-5xl mx-auto px-4">
      {/* Headline line1 — gradient: orange-300 → yellow-400 → amber-300, shader-delay-200 */}
      {/* Headline line2 — gradient: yellow-300 → orange-400 → red-400, shader-delay-400 */}
      {/* Both lines: text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent */}

      {/* Subtitle — text-lg md:text-xl lg:text-2xl text-orange-100/90 font-light, shader-delay-600 */}

      {/* CTA Buttons — shader-delay-800 */}
      {/* Primary: bg-gradient-to-r from-orange-500 to-yellow-500, text-black, rounded-full, hover:scale-105 */}
      {/* Secondary: bg-orange-500/10, border border-orange-300/30, text-orange-100, rounded-full, backdrop-blur-sm */}
    </div>
  </div>
</div>
\`\`\`

## Color Palette
- Background: pure black (#000)
- Shader: warm cosmic tones (orange, amber, generated by GLSL)
- Trust badge: orange-500/10 bg, orange-300/30 border, orange-100 text
- Headline gradients: orange-300 → yellow-400 → amber-300 (line1), yellow-300 → orange-400 → red-400 (line2)
- Subtitle: orange-100/90
- Primary CTA: orange-500 → yellow-500 gradient, black text
- Secondary CTA: orange-500/10 bg, orange-300/30 border, orange-100 text

## Important Implementation Notes
1. The file MUST start with "use client" — WebGL and pointer events are browser-only
2. WebGLRenderer and PointerHandler classes MUST be defined at module level (outside any component/hook) to avoid recreation on re-renders
3. The shader source is stored as a const at module level
4. The useShaderBackground hook manages the full lifecycle: canvas sizing → WebGL init → animation loop → cleanup
5. Canvas uses touch-none CSS to prevent default touch behaviors on mobile
6. The DPR (device pixel ratio) is halved: \`Math.max(1, 0.5 * window.devicePixelRatio)\` for performance
7. All animation class names use the \`shader-\` prefix to prevent collisions with other animation utilities
8. The component uses \`dangerouslySetInnerHTML\` for the style injection (not styled-jsx) for Next.js App Router compatibility
9. Exports: \`export default AnimatedShaderHero\` and \`export type { HeroProps }\`

## Complete Usage Example
\`\`\`tsx
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";

export default function LandingPage() {
  return (
    <AnimatedShaderHero
      trustBadge={{
        text: "Trusted by forward-thinking teams.",
        icons: ["✨"]
      }}
      headline={{
        line1: "Launch Your",
        line2: "Workflow Into Orbit"
      }}
      subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams."
      buttons={{
        primary: {
          text: "Get Started for Free",
          onClick: () => console.log("Get started!")
        },
        secondary: {
          text: "Explore Features",
          onClick: () => console.log("Explore!")
        }
      }}
    />
  );
}
\`\`\`

The component renders at full viewport height by default (\`h-screen\`). Use the \`className\` prop to override height, e.g. \`className="!h-[600px]"\` for a fixed-height hero.`,
  },
];

export const categories = [
  { id: "all", label: "All Components", icon: "Grid3X3", count: components.length },
  { id: "data", label: "Data Display", icon: "Table", count: components.filter((c) => c.category === "data").length },
  { id: "forms", label: "Forms & Input", icon: "FormInput", count: components.filter((c) => c.category === "forms").length },
  { id: "canvas", label: "Canvas & Board", icon: "Layout", count: components.filter((c) => c.category === "canvas").length },
  { id: "chat", label: "Chat & Messaging", icon: "MessageSquare", count: components.filter((c) => c.category === "chat").length },
  { id: "productivity", label: "Productivity", icon: "CalendarDays", count: components.filter((c) => c.category === "productivity").length },
  { id: "layout", label: "Layout & Hero", icon: "Layout", count: components.filter((c) => c.category === "layout").length },
];

export function getComponentBySlug(slug: string): ComponentMeta | undefined {
  return components.find((c) => c.slug === slug);
}

export function getComponentsByCategory(category: string): ComponentMeta[] {
  if (category === "all") return components;
  return components.filter((c) => c.category === category);
}
