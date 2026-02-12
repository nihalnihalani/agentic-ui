"use client";

import { useState, useCallback, useRef } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sparkles, CheckCircle, Loader2 } from "lucide-react";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface CopilotFormProps {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, string>) => void;
  className?: string;
}

export function CopilotForm({ fields, onSubmit, className }: CopilotFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(
    new Set()
  );
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const triggerHighlight = useCallback((fieldName: string) => {
    setHighlightedFields((prev) => new Set(prev).add(fieldName));
    if (timeoutRefs.current[fieldName]) {
      clearTimeout(timeoutRefs.current[fieldName]);
    }
    timeoutRefs.current[fieldName] = setTimeout(() => {
      setHighlightedFields((prev) => {
        const next = new Set(prev);
        next.delete(fieldName);
        return next;
      });
    }, 1500);
  }, []);

  const setFieldValue = useCallback(
    (fieldName: string, value: string) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));
      setAiFilledFields((prev) => new Set(prev).add(fieldName));
      triggerHighlight(fieldName);
    },
    [triggerHighlight]
  );

  useCopilotReadable({
    description: "Current form field definitions and their values",
    value: {
      fields: fields.map((f) => ({
        name: f.name,
        label: f.label,
        type: f.type,
        options: f.options,
        currentValue: values[f.name] || "",
      })),
    },
  });

  useCopilotAction({
    name: "fillForm",
    description:
      "Fill multiple form fields at once. Use this when the user describes what values to set.",
    parameters: [
      {
        name: "fields",
        type: "object[]",
        description: "Array of field name and value pairs to fill",
        attributes: [
          {
            name: "fieldName",
            type: "string",
            description: "The name of the field to fill",
          },
          {
            name: "value",
            type: "string",
            description: "The value to set for the field",
          },
        ],
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Filling form...</span>
          </div>
        );
      }
      const filledFields = args.fields ?? [];
      return (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <div className="mb-1 font-medium">Form updated</div>
          <ul className="space-y-0.5">
            {filledFields.map((f: { fieldName?: string; value?: string }, i: number) => (
              <li key={i} className="flex items-center gap-1.5 text-xs">
                <CheckCircle className="h-3 w-3 shrink-0" />
                <span className="text-emerald-300">{f.fieldName}</span>
                <span className="text-emerald-400/60">&rarr;</span>
                <span className="truncate">{f.value}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
    handler: ({ fields: fieldUpdates }) => {
      for (const { fieldName, value } of fieldUpdates) {
        if (fieldName in values) {
          setFieldValue(fieldName, value);
        }
      }
    },
  });

  useCopilotAction({
    name: "clearForm",
    description: "Reset all form fields to empty values",
    parameters: [],
    handler: () => {
      setValues(Object.fromEntries(fields.map((f) => [f.name, ""])));
      setAiFilledFields(new Set());
    },
  });

  useCopilotAction({
    name: "suggestValues",
    description:
      "Suggest a value for a specific empty field based on context",
    parameters: [
      {
        name: "fieldName",
        type: "string",
        description: "The name of the field to suggest a value for",
      },
      {
        name: "suggestion",
        type: "string",
        description: "The suggested value",
      },
    ],
    handler: ({ fieldName, suggestion }) => {
      if (fieldName in values) {
        setFieldValue(fieldName, suggestion);
      }
    },
  });

  const handleChange = (fieldName: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    setAiFilledFields((prev) => {
      const next = new Set(prev);
      next.delete(fieldName);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} role="form" aria-label="Form" className={cn("space-y-4", className)}>
      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label
              htmlFor={field.name}
              className="text-sm font-medium text-foreground"
            >
              {field.label}{field.required && <span className="text-destructive ml-0.5">*</span>}
            </label>
            {aiFilledFields.has(field.name) && (
              <Badge
                variant="secondary"
                className="gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0"
              >
                <Sparkles className="size-2.5" />
                AI filled
              </Badge>
            )}
          </div>

          <div
            className={cn(
              "rounded-md transition-shadow duration-700",
              highlightedFields.has(field.name) &&
                "shadow-[0_0_0_2px_rgba(16,185,129,0.4),0_0_12px_rgba(16,185,129,0.2)]"
            )}
          >
            {field.type === "select" ? (
              <select
                id={field.name}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                aria-invalid={!!errors[field.name]}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 text-foreground"
              >
                <option value="" className="bg-background text-muted-foreground">
                  {field.placeholder || `Select ${field.label.toLowerCase()}`}
                </option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt} className="bg-background text-foreground">
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                aria-invalid={!!errors[field.name]}
                rows={3}
                className="flex min-h-[72px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30"
              />
            ) : (
              <Input
                id={field.name}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                aria-invalid={!!errors[field.name]}
              />
            )}
          </div>
          {errors[field.name] && (
            <p className="text-xs text-destructive mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <Button type="submit" className="w-full mt-2">
        Submit
      </Button>
    </form>
  );
}
