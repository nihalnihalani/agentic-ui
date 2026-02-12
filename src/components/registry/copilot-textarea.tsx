"use client";

import { useState } from "react";
import { CopilotTextarea } from "@copilotkit/react-textarea";
import "@copilotkit/react-textarea/styles.css";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";

interface CopilotTextEditorProps {
  initialContent?: string;
  purpose?: string;
  placeholder?: string;
  className?: string;
  onContentChange?: (content: string) => void;
}

export function CopilotTextEditor({
  initialContent = "",
  purpose = "writing content",
  placeholder = "Start typing... AI will help you write.",
  className,
  onContentChange,
}: CopilotTextEditorProps) {
  const [content, setContent] = useState(initialContent);

  useCopilotReadable({
    description: "The current content of the AI-powered text editor",
    value: {
      content,
      wordCount: content.split(/\s+/).filter(Boolean).length,
      purpose,
    },
  });

  useCopilotAction({
    name: "setTextContent",
    description: "Replace the entire text content in the editor",
    parameters: [
      {
        name: "content",
        type: "string",
        description: "The new content",
        required: true,
      },
    ],
    handler: ({ content: newContent }) => {
      setContent(newContent);
      onContentChange?.(newContent);
      return "Content updated";
    },
  });

  useCopilotAction({
    name: "appendText",
    description: "Append text to the end of the current content",
    parameters: [
      {
        name: "text",
        type: "string",
        description: "Text to append",
        required: true,
      },
    ],
    handler: ({ text }) => {
      const updated = content + text;
      setContent(updated);
      onContentChange?.(updated);
      return "Text appended";
    },
  });

  useCopilotAction({
    name: "clearText",
    description: "Clear all text content from the editor",
    parameters: [],
    handler: () => {
      setContent("");
      onContentChange?.("");
      return "Content cleared";
    },
  });

  const handleChange = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className={cn("space-y-3", className)}>
      <CopilotTextarea
        className="min-h-[200px] w-full rounded-lg border border-border/50 bg-background/50 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
        placeholder={placeholder}
        value={content}
        onValueChange={handleChange}
        autosuggestionsConfig={{
          textareaPurpose: purpose,
          chatApiConfigs: {
            suggestionsApiConfig: {
              maxTokens: 20,
              stop: [".", "?", "!"],
            },
          },
        }}
      />
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          {wordCount} words · {charCount} characters
        </span>
        <span className="text-emerald-400/70">AI suggestions active</span>
      </div>
    </div>
  );
}
