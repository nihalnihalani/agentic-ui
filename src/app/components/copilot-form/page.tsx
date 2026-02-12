"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import {
  CopilotForm,
  type FieldConfig,
} from "@/components/registry/copilot-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComponentPageHeader } from "@/components/layout/component-page-header";
import { getComponentBySlug } from "@/lib/components-data";
import { CodeBlock } from "@/components/layout/code-block";
import { ComponentNav } from "@/components/layout/component-nav";

import { toast } from "sonner";

const formFields: FieldConfig[] = [
  {
    name: "companyName",
    label: "Company Name",
    type: "text",
    placeholder: "e.g. Acme Inc.",
    required: true,
  },
  {
    name: "industry",
    label: "Industry",
    type: "select",
    options: ["SaaS", "Fintech", "Healthcare", "E-commerce", "Education", "Other"],
    required: true,
  },
  {
    name: "targetAudience",
    label: "Target Audience",
    type: "select",
    options: ["B2B Enterprise", "B2B SMB", "B2C Consumer", "B2B2C"],
  },
  {
    name: "companySize",
    label: "Company Size",
    type: "select",
    options: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description of your company...",
  },
  {
    name: "websiteUrl",
    label: "Website URL",
    type: "text",
    placeholder: "https://example.com",
  },
  {
    name: "primaryFeature",
    label: "Primary Feature",
    type: "text",
    placeholder: "e.g. Real-time analytics dashboard",
  },
  {
    name: "pricingModel",
    label: "Pricing Model",
    type: "select",
    options: ["Freemium", "Subscription", "Usage-based", "Enterprise"],
  },
];

const codeSnippet = `import { CopilotForm, type FieldConfig } from "@/components/registry/copilot-form";

const fields: FieldConfig[] = [
  { name: "companyName", label: "Company Name", type: "text" },
  { name: "industry", label: "Industry", type: "select",
    options: ["SaaS", "Fintech", "Healthcare"] },
  { name: "description", label: "Description", type: "textarea" },
];

<CopilotForm
  fields={fields}
  onSubmit={(values) => console.log(values)}
/>`;

function FormChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this company profile form, such as 'Fill in a SaaS company profile', 'Suggest a pricing model', or 'Clear the form'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotFormPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <FormChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <ComponentPageHeader component={getComponentBySlug("copilot-form")!} />

          {/* Live Demo */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>Live Demo - Company Profile Form</CardTitle>
              <CardDescription>
                Open the chat popup and describe your company. For example, try:
                &quot;We&apos;re a B2B SaaS company called CloudMetrics with 50 employees,
                targeting enterprise clients. We offer usage-based pricing for
                our real-time analytics platform.&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CopilotForm
                fields={formFields}
                onSubmit={(values) => {
                  console.log("Form submitted:", values);
                  toast.success("Form submitted successfully!", {
                    description: `${Object.values(values).filter(Boolean).length} fields filled`,
                  });
                }}
              />
            </CardContent>
          </Card>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Try these prompts</h3>
            <div className="flex flex-wrap gap-2">
              {["Set up a B2B SaaS targeting enterprise", "Fill in a healthcare startup profile", "Suggest a pricing model", "Clear the form"].map((prompt) => (
                <span key={prompt} className="rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-default">
                  {prompt}
                </span>
              ))}
            </div>
          </div>

          {/* Code Snippet */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>
                Add CopilotForm to your project with a custom field
                configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeSnippet} filename="usage.tsx" />
            </CardContent>
          </Card>

          <ComponentNav currentSlug="copilot-form" />
        </div>

        <CopilotPopup
          instructions="You help users fill out this company profile form. When a user describes their business, fill in all relevant fields. For example, if they say 'We're a B2B SaaS targeting enterprise clients', fill in industry, target audience, company size, etc."
          labels={{
            title: "Form Assistant",
            initial: "Describe your company and I'll fill in the form for you!",
          }}
        />
      </div>
    </CopilotKit>
  );
}
