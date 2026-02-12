"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotTable, ColumnDef } from "@/components/registry/copilot-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComponentPageHeader } from "@/components/layout/component-page-header";
import { getComponentBySlug } from "@/lib/components-data";
import { CodeBlock } from "@/components/layout/code-block";
import { ComponentNav } from "@/components/layout/component-nav";
import { GlowingEffect } from "@/components/ui/glowing-effect";


interface SaaSMetric {
  [key: string]: unknown;
  name: string;
  mrr: number;
  customers: number;
  growth: string;
  plan: string;
  status: string;
}

const sampleData: SaaSMetric[] = [
  { name: "Acme Corp", mrr: 48500, customers: 312, growth: "+18.2%", plan: "Enterprise", status: "Active" },
  { name: "Globex Inc", mrr: 32100, customers: 187, growth: "+12.5%", plan: "Pro", status: "Active" },
  { name: "Initech", mrr: 8900, customers: 45, growth: "-3.1%", plan: "Starter", status: "Churned" },
  { name: "Umbrella Ltd", mrr: 67200, customers: 523, growth: "+24.8%", plan: "Enterprise", status: "Active" },
  { name: "Stark Industries", mrr: 125000, customers: 891, growth: "+31.4%", plan: "Enterprise", status: "Active" },
  { name: "Wayne Enterprises", mrr: 95400, customers: 678, growth: "+22.1%", plan: "Enterprise", status: "Active" },
  { name: "Pied Piper", mrr: 5200, customers: 23, growth: "+45.0%", plan: "Starter", status: "Trial" },
  { name: "Hooli", mrr: 78300, customers: 412, growth: "+8.7%", plan: "Pro", status: "Active" },
  { name: "Dunder Mifflin", mrr: 12400, customers: 67, growth: "-1.2%", plan: "Pro", status: "Churned" },
  { name: "Prestige Worldwide", mrr: 3100, customers: 12, growth: "+52.3%", plan: "Starter", status: "Trial" },
  { name: "Cyberdyne Systems", mrr: 41800, customers: 234, growth: "+15.6%", plan: "Pro", status: "Active" },
  { name: "Soylent Corp", mrr: 19500, customers: 98, growth: "+9.3%", plan: "Pro", status: "Active" },
  { name: "Aperture Science", mrr: 56700, customers: 345, growth: "+19.8%", plan: "Enterprise", status: "Active" },
];

const columns: ColumnDef<SaaSMetric>[] = [
  { key: "name", label: "Company" },
  {
    key: "mrr",
    label: "MRR",
    render: (value) => {
      const num = value as number;
      return (
        <span className="font-mono font-medium">
          ${num.toLocaleString()}
        </span>
      );
    },
  },
  {
    key: "customers",
    label: "Customers",
    render: (value) => {
      const num = value as number;
      return <span className="font-mono">{num.toLocaleString()}</span>;
    },
  },
  {
    key: "growth",
    label: "Growth",
    render: (value) => {
      const str = value as string;
      const isPositive = str.startsWith("+");
      return (
        <span className={isPositive ? "text-emerald-400" : "text-red-400"}>
          {str}
        </span>
      );
    },
  },
  {
    key: "plan",
    label: "Plan",
    render: (value) => {
      const plan = value as string;
      const variant =
        plan === "Enterprise"
          ? "default"
          : plan === "Pro"
          ? "secondary"
          : "outline";
      return <Badge variant={variant}>{plan}</Badge>;
    },
  },
  {
    key: "status",
    label: "Status",
    render: (value) => {
      const status = value as string;
      const colorClass =
        status === "Active"
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          : status === "Churned"
          ? "bg-red-500/15 text-red-400 border-red-500/30"
          : "bg-blue-500/15 text-blue-400 border-blue-500/30";
      return (
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}
        >
          {status}
        </span>
      );
    },
  },
];

const codeSnippet = `import { CopilotTable, ColumnDef } from "@/components/registry/copilot-table";

interface SaaSMetric {
  name: string;
  mrr: number;
  customers: number;
  growth: string;
  plan: string;
  status: string;
}

const columns: ColumnDef<SaaSMetric>[] = [
  { key: "name", label: "Company" },
  { key: "mrr", label: "MRR", render: (v) => \`$\${v.toLocaleString()}\` },
  { key: "customers", label: "Customers" },
  { key: "growth", label: "Growth" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
];

<CopilotTable data={data} columns={columns} />`;

function TableChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this data table, like sorting, filtering, or highlighting data. Make suggestions specific to the SaaS metrics data shown, such as 'Sort by MRR descending', 'Show only Enterprise plans', or 'Highlight top growers'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotTablePage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <TableChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ComponentPageHeader component={getComponentBySlug("copilot-table")!} />

          {/* Live Demo */}
          <div className="relative mb-8 rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Live Demo</CardTitle>
                <CardDescription>
                  Click column headers to sort. Use the filter row to search. Or
                  open the chat to ask AI to sort, filter, or highlight data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopilotTable<SaaSMetric> data={sampleData} columns={columns} />
              </CardContent>
            </Card>
          </div>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Try these prompts</h3>
            <div className="flex flex-wrap gap-2">
              {["Sort by MRR descending", "Show only Enterprise plans", "Highlight companies growing over 20%", "Clear all filters"].map((prompt) => (
                <span key={prompt} className="rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-default">
                  {prompt}
                </span>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div className="relative rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>
                  Drop the component into your project and pass your data and column definitions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={codeSnippet} filename="usage.tsx" />
              </CardContent>
            </Card>
          </div>

          <ComponentNav currentSlug="copilot-table" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help users explore and analyze the data table. You can sort columns, filter rows, and highlight interesting data. When the user asks about the data, use the available actions to manipulate the table view."
        labels={{
          title: "Table Assistant",
          initial: "Ask me to sort, filter, or highlight data in the table.",
        }}
      />
    </CopilotKit>
  );
}
