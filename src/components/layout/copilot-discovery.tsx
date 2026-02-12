"use client";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { useRouter } from "next/navigation";
import { components } from "@/lib/components-data";

export function CopilotDiscovery() {
  const router = useRouter();

  useCopilotReadable({
    description:
      "The complete catalog of AgenticUI components available in this registry. Each component is a copy-paste React component with CopilotKit AI superpowers built in.",
    value: components.map((c) => ({
      name: c.name,
      slug: c.slug,
      description: c.description,
      category: c.category,
      tags: c.tags,
      hooks: c.hooks,
      url: `/components/${c.slug}`,
    })),
  });

  useCopilotAction({
    name: "searchComponents",
    description:
      "Search the AgenticUI component catalog by keyword, category, or use case. Returns matching components.",
    parameters: [
      {
        name: "query",
        type: "string",
        description:
          "Search query - can be a keyword, category, or use case description",
        required: true,
      },
    ],
    handler: ({ query }) => {
      const q = query.toLowerCase();
      const matches = components.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.includes(q)) ||
          c.category.includes(q)
      );
      if (matches.length === 0) {
        return "No components match that query. Available components: " +
          components.map((c) => c.name).join(", ");
      }
      return matches
        .map(
          (c) =>
            `**${c.name}** (${c.category}): ${c.description} → /components/${c.slug}`
        )
        .join("\n\n");
    },
  });

  useCopilotAction({
    name: "viewComponent",
    description:
      "Navigate to a specific component's detail page to see a live demo and code.",
    parameters: [
      {
        name: "slug",
        type: "string",
        description:
          "The component slug. Available: copilot-table, copilot-form, copilot-canvas",
        required: true,
      },
    ],
    handler: ({ slug }) => {
      router.push(`/components/${slug}`);
      return `Navigating to /components/${slug}`;
    },
  });

  useCopilotAction({
    name: "compareComponents",
    description:
      "Compare two or more components to help the user decide which to use.",
    parameters: [
      {
        name: "slugs",
        type: "string[]",
        description: "Array of component slugs to compare",
        required: true,
      },
    ],
    handler: ({ slugs }) => {
      const found = (slugs as string[])
        .map((s) => components.find((c) => c.slug === s))
        .filter(Boolean);
      if (found.length === 0) return "No matching components found.";
      return found
        .map(
          (c) =>
            `**${c!.name}**\n- Category: ${c!.category}\n- Hooks: ${c!.hooks.join(", ")}\n- Tags: ${c!.tags.join(", ")}\n- ${c!.description}`
        )
        .join("\n\n---\n\n");
    },
  });

  return null;
}
