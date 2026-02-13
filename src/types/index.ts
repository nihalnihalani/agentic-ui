export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  category: "data" | "forms" | "canvas" | "layout" | "chat" | "productivity" | "agentic";
  tags: string[];
  hooks: string[];
  preview: string;
  installCommand: string;
  copyPrompt: string;
}

export interface ComponentCategory {
  id: string;
  label: string;
  icon: string;
  count: number;
}
