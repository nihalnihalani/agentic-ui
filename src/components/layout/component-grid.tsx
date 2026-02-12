"use client";

import { useState, useMemo } from "react";
import { Search, Grid3X3, Table, FormInput, Layout, MessageSquare, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { components, categories } from "@/lib/components-data";
import { ComponentCard } from "./component-card";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  Grid3X3: <Grid3X3 className="size-4" />,
  Table: <Table className="size-4" />,
  FormInput: <FormInput className="size-4" />,
  Layout: <Layout className="size-4" />,
  MessageSquare: <MessageSquare className="size-4" />,
  CalendarDays: <CalendarDays className="size-4" />,
};

export interface ComponentGridProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ComponentGrid({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ComponentGridProps) {
  const filtered = useMemo(() => {
    let result = components;
    if (activeCategory !== "all") {
      result = result.filter((c) => c.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <section id="components" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Section header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Components
          </h2>
          <p className="mt-3 text-muted-foreground">
            Drop-in AI-powered components ready for your CopilotKit app.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {iconMap[cat.icon]}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div role="search" className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              aria-label="Search components"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((component, i) => (
            <ComponentCard
              key={component.slug}
              component={component}
              index={i}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            No components match your search.
          </div>
        )}
      </div>
    </section>
  );
}
