"use client";

import { useState } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Offline" | "Busy";
  lastSeen: string;
}

const INITIAL_DATA: Employee[] = [
  { id: "1", name: "Alice Johnson", role: "Frontend Dev", status: "Active", lastSeen: "Now" },
  { id: "2", name: "Bob Smith", role: "Product Manager", status: "Busy", lastSeen: "1h ago" },
  { id: "3", name: "Charlie Brown", role: "Designer", status: "Offline", lastSeen: "2d ago" },
  { id: "4", name: "Diana Prince", role: "DevOps", status: "Active", lastSeen: "Now" },
  { id: "5", name: "Evan Wright", role: "Backend Dev", status: "Busy", lastSeen: "4h ago" },
];

export function SmartDataGrid() {
  const [data, setData] = useState<Employee[]>(INITIAL_DATA);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  // 1. Give the AI context about the data in the table
  useCopilotReadable({
    description: "The current list of employees in the Smart Data Grid",
    value: data,
  });

  // 2. Allow the AI to manipulate the table
  useCopilotAction({
    name: "filterAndSortEmployees",
    description: "Filter, sort, or highlight employees in the table",
    parameters: [
      {
        name: "filterText",
        type: "string",
        description: "Text to filter rows by name or role",
      },
      {
        name: "statusFilter",
        type: "string",
        description: "Filter by status (Active, Busy, Offline)",
        enum: ["Active", "Busy", "Offline"],
      },
      {
        name: "sortBy",
        type: "string",
        description: "Field to sort by",
        enum: ["name", "role", "status"],
      },
      {
        name: "highlightIds",
        type: "string[]",
        description: "List of employee IDs to highlight",
      },
    ],
    handler: async ({ filterText, statusFilter, sortBy, highlightIds }) => {
      let filtered = [...INITIAL_DATA];

      if (filterText) {
        const q = filterText.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)
        );
      }

      if (statusFilter) {
        filtered = filtered.filter((e) => e.status === statusFilter);
      }

      if (sortBy) {
        filtered.sort((a, b) =>
          String(a[sortBy as keyof Employee]).localeCompare(
            String(b[sortBy as keyof Employee])
          )
        );
      }

      setData(filtered);

      if (highlightIds) {
        setHighlightedIds(highlightIds);
      } else {
        setHighlightedIds([]);
      }

      return `Updated table: ${filtered.length} rows visible.`;
    },
  });

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
      {/* Header */}
      <div className="border-b bg-muted/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">
            Team Members
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            {data.length} active filters
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Role
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Last Seen
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            <AnimatePresence>
              {data.map((employee) => (
                <motion.tr
                  key={employee.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    backgroundColor: highlightedIds.includes(employee.id)
                      ? "rgba(59, 130, 246, 0.1)" // Blue highlight
                      : "transparent",
                  }}
                  exit={{ opacity: 0 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      {employee.name}
                    </div>
                  </td>
                  <td className="p-4 align-middle">{employee.role}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        employee.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : employee.status === "Busy"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-slate-500/10 text-slate-500"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {employee.lastSeen}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No employees found.
        </div>
      )}
    </div>
  );
}
