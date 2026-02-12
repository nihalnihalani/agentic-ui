"use client";

import { useState, useMemo, useCallback } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";

type AnyRow = Record<string, unknown>;

export interface ColumnDef<T = AnyRow> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface SortState {
  columnKey: string;
  direction: "asc" | "desc";
}

interface FilterState {
  columnKey: string;
  value: string;
  operator: "contains" | "equals" | "gt" | "lt" | "gte" | "lte";
}

interface CopilotTableProps<T = AnyRow> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
}

export function CopilotTable<T extends AnyRow>({
  data,
  columns,
  className,
}: CopilotTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeFilters, setActiveFilters] = useState<FilterState[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);

  const applyFilter = useCallback(
    (row: T, filter: FilterState): boolean => {
      const rawValue = row[filter.columnKey as keyof T];
      const cellValue = String(rawValue ?? "").toLowerCase();
      const filterValue = filter.value.toLowerCase();

      switch (filter.operator) {
        case "contains":
          return cellValue.includes(filterValue);
        case "equals":
          return cellValue === filterValue;
        case "gt":
          return parseFloat(cellValue) > parseFloat(filterValue);
        case "lt":
          return parseFloat(cellValue) < parseFloat(filterValue);
        case "gte":
          return parseFloat(cellValue) >= parseFloat(filterValue);
        case "lte":
          return parseFloat(cellValue) <= parseFloat(filterValue);
        default:
          return true;
      }
    },
    []
  );

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply inline text filters
    for (const [key, value] of Object.entries(filters)) {
      if (value.trim()) {
        result = result.filter((row) =>
          String(row[key as keyof T] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    }

    // Apply AI-driven filters
    for (const filter of activeFilters) {
      result = result.filter((row) => applyFilter(row, filter));
    }

    // Apply sort
    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.columnKey as keyof T];
        const bVal = b[sort.columnKey as keyof T];
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");
        const aNum = parseFloat(aStr);
        const bNum = parseFloat(bStr);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sort.direction === "asc" ? aNum - bNum : bNum - aNum;
        }
        return sort.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, filters, activeFilters, sort, applyFilter]);

  // Expose table state to AI
  useCopilotReadable({
    description: "Current data table state including all rows, active sort, and active filters",
    value: {
      totalRows: data.length,
      visibleRows: filteredAndSortedData.length,
      columns: columns.map((c) => c.key),
      currentSort: sort,
      activeFilters,
      highlightedRows,
      data: filteredAndSortedData,
    },
  });

  // AI action: sort table
  useCopilotAction({
    name: "sortTable",
    description: "Sort the table by a specific column in ascending or descending order",
    parameters: [
      {
        name: "columnKey",
        type: "string",
        description: `The column to sort by. Available columns: ${columns.map((c) => c.key).join(", ")}`,
        required: true,
      },
      {
        name: "direction",
        type: "string",
        description: "Sort direction: 'asc' for ascending or 'desc' for descending",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <ArrowUpDown className="h-4 w-4 animate-spin text-blue-400" />
            <span>Sorting table...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <ArrowUp className="h-4 w-4" />
          <span>
            Sorted by <strong>{args.columnKey}</strong> {args.direction}ending
          </span>
        </div>
      );
    },
    handler: ({ columnKey, direction }) => {
      const validCol = columns.find(c => c.key === columnKey);
      if (!validCol) return `Column ${columnKey} not found`;
      setSort({
        columnKey,
        direction: direction as "asc" | "desc",
      });
      return `Table sorted by ${columnKey} in ${direction}ending order`;
    },
  });

  // AI action: filter table
  useCopilotAction({
    name: "filterTable",
    description:
      "Filter the table rows by a specific column and value. Use operator to control matching: contains, equals, gt (greater than), lt (less than), gte (>=), lte (<=)",
    parameters: [
      {
        name: "columnKey",
        type: "string",
        description: `The column to filter by. Available columns: ${columns.map((c) => c.key).join(", ")}`,
        required: true,
      },
      {
        name: "value",
        type: "string",
        description: "The value to filter for",
        required: true,
      },
      {
        name: "operator",
        type: "string",
        description: "The filter operator: contains, equals, gt, lt, gte, lte",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Filter className="h-4 w-4 animate-pulse text-purple-400" />
            <span>Applying filter...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm text-purple-400">
          <Filter className="h-4 w-4" />
          <span>
            Filtered <strong>{args.columnKey}</strong> {args.operator} &quot;{args.value}&quot;
          </span>
        </div>
      );
    },
    handler: ({ columnKey, value, operator }) => {
      const validCol = columns.find(c => c.key === columnKey);
      if (!validCol) return `Column ${columnKey} not found`;
      const newFilter: FilterState = {
        columnKey,
        value,
        operator: operator as FilterState["operator"],
      };
      setActiveFilters((prev) => [...prev, newFilter]);
      return `Filter applied: ${columnKey} ${operator} "${value}"`;
    },
  });

  // AI action: highlight rows
  useCopilotAction({
    name: "highlightRows",
    description:
      "Highlight specific rows in the table to draw attention to them. Provide the row indices (0-based) from the currently visible/filtered data.",
    parameters: [
      {
        name: "rowIndices",
        type: "number[]",
        description: "Array of row indices (0-based) to highlight",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Sparkles className="h-4 w-4 animate-pulse text-amber-400" />
            <span>Highlighting rows...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <Sparkles className="h-4 w-4" />
          <span>
            Highlighted <strong>{args.rowIndices?.length ?? 0}</strong> row(s)
          </span>
        </div>
      );
    },
    handler: ({ rowIndices }) => {
      setHighlightedRows(rowIndices);
      return `Highlighted ${rowIndices.length} row(s)`;
    },
  });

  // AI action: clear filters
  useCopilotAction({
    name: "clearFilters",
    description: "Remove all active filters, sort, and highlighted rows to reset the table to its original state",
    parameters: [],
    handler: () => {
      setFilters({});
      setActiveFilters([]);
      setSort(null);
      setHighlightedRows([]);
      return "All filters, sorting, and highlights cleared";
    },
  });

  const handleSort = (columnKey: string) => {
    setSort((prev) => {
      if (prev?.columnKey === columnKey) {
        if (prev.direction === "asc") return { columnKey, direction: "desc" };
        return null;
      }
      return { columnKey, direction: "asc" };
    });
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters((prev) => ({ ...prev, [columnKey]: value }));
  };

  const removeActiveFilter = (index: number) => {
    setActiveFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const hasActiveState = activeFilters.length > 0 || sort !== null || highlightedRows.length > 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Active filters / sort badges */}
      {hasActiveState && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {sort && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400">
              Sort: {sort.columnKey} {sort.direction === "asc" ? "ascending" : "descending"}
              <button
                onClick={() => setSort(null)}
                className="ml-0.5 rounded hover:text-blue-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {activeFilters.map((filter, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-400"
            >
              {filter.columnKey} {filter.operator} &quot;{filter.value}&quot;
              <button
                onClick={() => removeActiveFilter(i)}
                className="ml-0.5 rounded hover:text-purple-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {highlightedRows.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
              {highlightedRows.length} row(s) highlighted
              <button
                onClick={() => setHighlightedRows([])}
                className="ml-0.5 rounded hover:text-amber-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {hasActiveState && (
            <button
              onClick={() => {
                setFilters({});
                setActiveFilters([]);
                setSort(null);
                setHighlightedRows([]);
              }}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header */}
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={col.sortable !== false ? (sort?.columnKey === col.key ? (sort.direction === "asc" ? "ascending" : "descending") : "none") : undefined}
                    className={cn(
                      "px-4 py-3 text-left font-medium text-muted-foreground",
                      (col.sortable !== false) && "cursor-pointer select-none hover:text-foreground transition-colors"
                    )}
                    onClick={() => {
                      if (col.sortable !== false) handleSort(col.key);
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable !== false && (
                        <span className="text-muted-foreground/50">
                          {sort?.columnKey === col.key ? (
                            sort.direction === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5 text-blue-400" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-blue-400" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
              {/* Filter row */}
              <tr className="border-b border-border/30 bg-muted/10">
                {columns.map((col) => (
                  <th key={`filter-${col.key}`} scope="col" className="px-4 py-2">
                    {col.filterable !== false ? (
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/50" />
                        <input
                          type="text"
                          placeholder={`Filter...`}
                          aria-label={`Filter ${col.label}`}
                          value={filters[col.key] ?? ""}
                          onChange={(e) =>
                            handleFilterChange(col.key, e.target.value)
                          }
                          className="h-7 w-full rounded border border-border/30 bg-background/50 pl-7 pr-2 text-xs font-normal text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-ring focus:ring-1 focus:ring-ring/30 transition-colors"
                        />
                      </div>
                    ) : (
                      <div className="h-7" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredAndSortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No matching rows found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((row, rowIndex) => {
                  const isHighlighted = highlightedRows.includes(rowIndex);
                  return (
                    <tr
                      key={rowIndex}
                      className={cn(
                        "border-b border-border/20 transition-all duration-300",
                        isHighlighted
                          ? "bg-amber-500/10 border-amber-500/30 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.2)]"
                          : "hover:bg-muted/20"
                      )}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-4 py-3",
                            isHighlighted && "text-foreground"
                          )}
                        >
                          {col.render
                            ? col.render(row[col.key], row)
                            : String(row[col.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          Showing {filteredAndSortedData.length} of {data.length} rows
        </span>
        {highlightedRows.length > 0 && (
          <span className="text-amber-400">
            {highlightedRows.length} highlighted
          </span>
        )}
      </div>
      <div aria-live="polite" className="sr-only">
        Showing {filteredAndSortedData.length} of {data.length} rows{sort ? `, sorted by ${sort.columnKey} ${sort.direction}` : ""}
      </div>
    </div>
  );
}
