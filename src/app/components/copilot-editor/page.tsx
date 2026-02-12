"use client";

import { CopilotKit, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotEditor } from "@/components/registry/copilot-editor";
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
import { PromptCopyBlock } from "@/components/layout/prompt-copy-block";

const codeSnippet = `import { CopilotEditor } from "@/components/registry/copilot-editor";

// Uses built-in sample content:
<CopilotEditor />

// With custom initial content:
<CopilotEditor
  initialContent="# My Document\\n\\nStart writing here..."
/>`;

function EditorChatSuggestions() {
  useCopilotChatSuggestions({
    instructions:
      "Suggest 3 actions the user can take with this markdown editor, such as 'Add a conclusion paragraph', 'Convert bullet list to a table', or 'Improve the intro paragraph'.",
    maxSuggestions: 3,
  });
  return null;
}

export default function CopilotEditorPage() {
  const component = getComponentBySlug("copilot-editor")!;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <EditorChatSuggestions />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ComponentPageHeader component={component} />

          {/* Live Demo */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
              <CardDescription>
                A markdown editor with AI writing assistance. Edit directly or
                open the chat to insert, replace, format, and improve text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CopilotEditor />
            </CardContent>
          </Card>

          {/* Try these prompts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Try these prompts
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Add a conclusion paragraph",
                "Convert the bullet list to a table",
                "Improve the intro paragraph",
                "Add a heading about best practices",
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

          {/* Copy Prompt for AI Tools */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Copy Prompt for AI Tools
            </h3>
            <PromptCopyBlock prompt={component.copyPrompt} />
          </div>

          {/* Usage */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>
                Add the editor to your project with optional initial content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeSnippet} filename="usage.tsx" />
            </CardContent>
          </Card>

          <ComponentNav currentSlug="copilot-editor" />
        </div>
      </div>

      <CopilotPopup
        instructions="You help users write and edit markdown content. You can insert text at the cursor position, replace all content, format text as markdown (headings, bold, italic, code, lists, tables), improve writing quality, and add headings. Be creative and helpful with writing assistance."
        labels={{
          title: "Editor Assistant",
          initial: "I can help you write! Ask me to add, edit, or format content.",
        }}
      />
    </CopilotKit>
  );
}
