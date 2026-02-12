"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotSearch } from "@/components/registry/copilot-search";
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
import { GlowingEffect } from "@/components/ui/glowing-effect";


const codeSnippet = `import { CopilotSearch } from "@/components/registry/copilot-search";

// Uses built-in product catalog:
<CopilotSearch />

// With custom products:
<CopilotSearch
  products={[
    {
      id: "1",
      name: "Wireless Headphones",
      category: "Electronics",
      price: 79.99,
      rating: 4.5,
      description: "Premium wireless headphones",
      inStock: true,
    },
    // ...
  ]}
/>`;

function SearchChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this search interface, such as 'Search for items under $50', 'Filter by 4+ star rating', or 'Sort results by price ascending'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotSearchPage() {
  const component = getComponentBySlug("copilot-search")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <SearchChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <div className="relative mb-8 rounded-xl">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <Card className="relative border-border/50">
              <CardHeader>
                <CardTitle>Live Demo</CardTitle>
                <CardDescription>
                  An AI-powered search interface. Use the search bar directly or
                  open the chat to search, filter, sort, and highlight results
                  using natural language.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopilotSearch />
              </CardContent>
            </Card>
          </div>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Try these prompts
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Search for items under $50",
                "Filter by 4+ star rating",
                "Sort results by price ascending",
                "Show only electronics in stock",
              ].map((prompt) => (
                <span
                  key={prompt}
                  className="rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-default"
                >
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
                  Drop the search interface into your project. Pass a custom
                  product catalog or use the built-in sample data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={codeSnippet} filename="usage.tsx" />
              </CardContent>
            </Card>
          </div>

          <ComponentNav currentSlug="copilot-search" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help users search and explore the product catalog. You can perform text searches, add/remove faceted filters (by category, price range, rating), sort results, and highlight specific products. When the user asks about finding products, use the available actions."
        labels={{
          title: "Search Assistant",
          initial: "What are you looking for? I can search, filter, and sort results.",
        }}
      />
    </CopilotKit>
  );
}
