"use client";

import { useState } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { ComponentGrid } from "@/components/layout/component-grid";
import { components, categories } from "@/lib/components-data";
import { GenerativePreview } from "./generative-preview";

export function SmartRegistry() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Give the AI context about what the user is seeing
  useCopilotReadable({
    description: "The state of the component registry the user is viewing",
    value: {
      activeCategory,
      searchQuery,
      availableCategories: categories.map((c) => c.id),
      allComponents: components.map((c) => ({
        name: c.name,
        description: c.description,
        category: c.category,
        tags: c.tags,
      })),
    },
  });

  // 2. Give the AI the ability to control the view
  useCopilotAction({
    name: "filterRegistry",
    description: "Filter the component registry by category or search query",
    parameters: [
      {
        name: "category",
        type: "string",
        description: "The category ID to filter by (e.g., 'data', 'forms', 'canvas', 'all')",
        required: false,
      },
      {
        name: "query",
        type: "string",
        description: "The search query to filter components by name or description",
        required: false,
      },
    ],
    handler: async ({ category, query }) => {
      if (category) setActiveCategory(category);
      if (query !== undefined) setSearchQuery(query);
      return "Registry filtered updated.";
    },
  });

  return (
    <>
      <GenerativePreview />
      <ComponentGrid
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </>
  );
}
