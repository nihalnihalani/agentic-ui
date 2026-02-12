"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading,
  Code,
  List,
  Loader2,
  CheckCircle,
  Sparkles,
} from "lucide-react";

interface CopilotEditorProps {
  initialContent?: string;
  className?: string;
}

const DEFAULT_CONTENT = `# The Future of AI in Software Development

Artificial intelligence is rapidly transforming how we build software. From intelligent code completion to automated testing, AI tools are becoming indispensable companions for developers worldwide.

## AI-Powered Code Generation

Modern AI assistants can understand natural language descriptions and translate them into working code. This shift is enabling developers to:

- Focus on architecture and design rather than boilerplate
- Prototype ideas in minutes instead of hours
- Reduce common bugs through intelligent suggestions
- Learn new frameworks and languages faster

## Automated Testing and Quality Assurance

AI is also revolutionizing how we test software. Intelligent systems can now:

- Generate comprehensive test suites from code analysis
- Identify edge cases that humans often miss
- Predict which areas of code are most likely to contain bugs
- Automatically fix simple issues before they reach production

\`\`\`typescript
// Example: AI-assisted function with auto-generated types
async function fetchUserData(userId: string): Promise<User> {
  const response = await api.get(\`/users/\${userId}\`);
  return validateUser(response.data);
}
\`\`\`

The future belongs to developers who embrace AI as a collaborative partner, not a replacement. The most productive teams will be those that learn to leverage these tools effectively.
`;

function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const htmlParts: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        htmlParts.push(
          `<pre class="rounded-lg bg-muted/30 border border-border/40 p-4 my-3 overflow-x-auto"><code class="text-sm font-mono text-foreground/90">${codeBlockContent.join("\n")}</code></pre>`
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        if (inList) {
          htmlParts.push("</ul>");
          inList = false;
        }
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(
        line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      );
      continue;
    }

    // Handle headings
    if (line.startsWith("### ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      const text = applyInlineFormatting(line.slice(4));
      htmlParts.push(
        `<h3 class="text-base font-semibold text-foreground mt-5 mb-2">${text}</h3>`
      );
      continue;
    }
    if (line.startsWith("## ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      const text = applyInlineFormatting(line.slice(3));
      htmlParts.push(
        `<h2 class="text-lg font-semibold text-foreground mt-6 mb-2">${text}</h2>`
      );
      continue;
    }
    if (line.startsWith("# ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      const text = applyInlineFormatting(line.slice(2));
      htmlParts.push(
        `<h1 class="text-2xl font-bold text-foreground mt-6 mb-3">${text}</h1>`
      );
      continue;
    }

    // Handle list items
    if (line.startsWith("- ")) {
      if (!inList) {
        htmlParts.push('<ul class="list-disc list-inside space-y-1 my-2 text-sm text-foreground/90">');
        inList = true;
      }
      const text = applyInlineFormatting(line.slice(2));
      htmlParts.push(`<li>${text}</li>`);
      continue;
    }

    // Close list if we're no longer in one
    if (inList && !line.startsWith("- ")) {
      htmlParts.push("</ul>");
      inList = false;
    }

    // Handle blank lines
    if (line.trim() === "") {
      htmlParts.push('<div class="h-3"></div>');
      continue;
    }

    // Regular paragraph
    const text = applyInlineFormatting(line);
    htmlParts.push(
      `<p class="text-sm leading-relaxed text-foreground/90 my-1">${text}</p>`
    );
  }

  // Close any open tags
  if (inList) {
    htmlParts.push("</ul>");
  }
  if (inCodeBlock && codeBlockContent.length > 0) {
    htmlParts.push(
      `<pre class="rounded-lg bg-muted/30 border border-border/40 p-4 my-3 overflow-x-auto"><code class="text-sm font-mono text-foreground/90">${codeBlockContent.join("\n")}</code></pre>`
    );
  }

  return htmlParts.join("\n");
}

function applyInlineFormatting(text: string): string {
  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic: *text*
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Inline code: `text`
  text = text.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-muted/30 px-1.5 py-0.5 text-xs font-mono">$1</code>'
  );
  return text;
}

export function CopilotEditor({
  initialContent,
  className,
}: CopilotEditorProps) {
  const [content, setContent] = useState(initialContent ?? DEFAULT_CONTENT);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = useMemo(
    () => content.split(/\s+/).filter(Boolean).length,
    [content]
  );

  const lineCount = useMemo(
    () => content.split("\n").length,
    [content]
  );

  const previewHtml = useMemo(() => renderMarkdownToHtml(content), [content]);

  const insertAtCursorPosition = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setContent((prev) => prev + text);
        return;
      }
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = content.slice(0, start);
      const after = content.slice(end);
      const updated = before + text + after;
      setContent(updated);
      requestAnimationFrame(() => {
        textarea.selectionStart = start + text.length;
        textarea.selectionEnd = start + text.length;
        textarea.focus();
      });
    },
    [content]
  );

  const wrapSelection = useCallback(
    (wrapper: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.slice(start, end);
      const wrapped = `${wrapper}${selected || "text"}${wrapper}`;
      const before = content.slice(0, start);
      const after = content.slice(end);
      setContent(before + wrapped + after);
      requestAnimationFrame(() => {
        textarea.selectionStart = start + wrapper.length;
        textarea.selectionEnd = start + wrapper.length + (selected || "text").length;
        textarea.focus();
      });
    },
    [content]
  );

  // Expose document content to AI
  useCopilotReadable({
    description:
      "Current markdown document content in the editor, including word count and line count",
    value: {
      content,
      wordCount,
      lineCount,
    },
  });

  // Action: Insert text at cursor position
  useCopilotAction({
    name: "insertAtCursor",
    description:
      "Insert text at the current cursor position in the markdown editor",
    parameters: [
      {
        name: "text",
        type: "string",
        description: "The text to insert at the cursor position",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>Inserting text...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Inserted <strong>{(args.text ?? "").length}</strong> characters
          </span>
        </div>
      );
    },
    handler: ({ text }) => {
      insertAtCursorPosition(text);
      return `Inserted text at cursor position`;
    },
  });

  // Action: Replace entire content
  useCopilotAction({
    name: "replaceContent",
    description:
      "Replace the entire content of the markdown editor with new content",
    parameters: [
      {
        name: "newContent",
        type: "string",
        description: "The new markdown content to replace the existing content",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Replacing content...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Content replaced ({(args.newContent ?? "").split(/\s+/).filter(Boolean).length} words)
          </span>
        </div>
      );
    },
    handler: ({ newContent }) => {
      setContent(newContent);
      return "Content replaced successfully";
    },
  });

  // Action: Format as markdown
  useCopilotAction({
    name: "formatAsMarkdown",
    description:
      "Clean up and format the current content as properly structured markdown with consistent headings, spacing, and formatting",
    parameters: [
      {
        name: "formattedContent",
        type: "string",
        description: "The cleaned-up and properly formatted markdown content",
        required: true,
      },
    ],
    render: ({ status }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Formatting markdown...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>Markdown formatted successfully</span>
        </div>
      );
    },
    handler: ({ formattedContent }) => {
      setContent(formattedContent);
      return "Content formatted as clean markdown";
    },
  });

  // Action: Improve writing
  useCopilotAction({
    name: "improveWriting",
    description:
      "Improve the writing quality of the current document by enhancing clarity, grammar, and flow while preserving the original meaning and markdown structure",
    parameters: [
      {
        name: "improvedContent",
        type: "string",
        description:
          "The improved version of the document with better writing quality",
        required: true,
      },
    ],
    render: ({ status }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Improving writing...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <CheckCircle className="h-4 w-4" />
          <span>Writing improved</span>
        </div>
      );
    },
    handler: ({ improvedContent }) => {
      setContent(improvedContent);
      return "Writing quality improved";
    },
  });

  // Action: Add heading
  useCopilotAction({
    name: "addHeading",
    description:
      "Add a markdown heading at the end of the document. Supports h1 (#), h2 (##), and h3 (###) levels.",
    parameters: [
      {
        name: "text",
        type: "string",
        description: "The heading text",
        required: true,
      },
      {
        name: "level",
        type: "number",
        description: "The heading level: 1 for h1, 2 for h2, 3 for h3",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
            <span>Adding heading...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm text-purple-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Added h{args.level} heading: <strong>{args.text}</strong>
          </span>
        </div>
      );
    },
    handler: ({ text, level }) => {
      const prefix = "#".repeat(Math.min(Math.max(level, 1), 3));
      const heading = `\n\n${prefix} ${text}\n\n`;
      setContent((prev) => prev.trimEnd() + heading);
      return `Added h${level} heading: ${text}`;
    },
  });

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-card/50 px-2 py-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => wrapSelection("**")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => wrapSelection("*")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertAtCursorPosition("\n## ")}
          title="Heading"
        >
          <Heading className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => wrapSelection("`")}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertAtCursorPosition("\n- ")}
          title="List"
        >
          <List className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-5 w-px bg-border/50" />

        <div className="flex items-center gap-1.5 px-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          <span>AI actions available</span>
        </div>

        <div className="ml-auto text-xs text-muted-foreground">
          {wordCount} words &middot; {lineCount} lines
        </div>
      </div>

      {/* Split-pane editor and preview */}
      <div className="grid grid-cols-2 gap-3" style={{ minHeight: 480 }}>
        {/* Editor pane */}
        <div className="relative flex overflow-hidden rounded-lg border border-border/50 bg-background/50">
          {/* Line number gutter */}
          <div
            className="flex flex-col items-end border-r border-border/30 bg-muted/20 px-3 py-3 font-mono text-xs leading-[1.625rem] text-muted-foreground/50 select-none"
            aria-hidden="true"
          >
            {content.split("\n").map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none bg-transparent p-3 font-mono text-sm leading-[1.625rem] text-foreground placeholder:text-muted-foreground/40 outline-none"
            spellCheck={false}
          />
        </div>

        {/* Preview pane */}
        <div className="overflow-auto rounded-lg border border-border/50 bg-card/30 p-5">
          <div className="mb-3 flex items-center gap-2 border-b border-border/30 pb-2 text-xs font-medium text-muted-foreground">
            <span>Preview</span>
          </div>
          <div
            className="prose-sm"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </div>
  );
}
