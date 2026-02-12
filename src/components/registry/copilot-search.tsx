"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Star,
  Loader2,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  inStock: boolean;
}

interface CopilotSearchProps {
  products?: Product[];
  className?: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  // Electronics
  {
    id: "e1",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 79,
    rating: 4.5,
    description:
      "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    inStock: true,
  },
  {
    id: "e2",
    name: "Smart Watch",
    category: "Electronics",
    price: 199,
    rating: 4.2,
    description:
      "Fitness-focused smartwatch with heart rate monitoring, GPS, and a vibrant AMOLED display.",
    inStock: true,
  },
  {
    id: "e3",
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 49,
    rating: 4.7,
    description:
      "Portable waterproof speaker with 360-degree sound and 12-hour playtime.",
    inStock: true,
  },
  {
    id: "e4",
    name: "USB-C Hub",
    category: "Electronics",
    price: 35,
    rating: 4.0,
    description:
      "7-in-1 USB-C hub with HDMI, USB 3.0 ports, SD card reader, and power delivery.",
    inStock: false,
  },
  // Books
  {
    id: "b1",
    name: "Clean Code",
    category: "Books",
    price: 42,
    rating: 4.8,
    description:
      "A handbook of agile software craftsmanship by Robert C. Martin, essential for every developer.",
    inStock: true,
  },
  {
    id: "b2",
    name: "Design Patterns",
    category: "Books",
    price: 55,
    rating: 4.6,
    description:
      "The classic Gang of Four guide to reusable object-oriented software design patterns.",
    inStock: true,
  },
  {
    id: "b3",
    name: "The Pragmatic Programmer",
    category: "Books",
    price: 45,
    rating: 4.9,
    description:
      "Timeless advice on becoming a better programmer, from journeyman to master craftsman.",
    inStock: true,
  },
  {
    id: "b4",
    name: "Refactoring",
    category: "Books",
    price: 48,
    rating: 4.4,
    description:
      "Martin Fowler's definitive guide to improving the design of existing code safely.",
    inStock: false,
  },
  // Clothing
  {
    id: "c1",
    name: "Tech Hoodie",
    category: "Clothing",
    price: 65,
    rating: 4.3,
    description:
      "Soft fleece hoodie with hidden cable routing and a zippered phone pocket.",
    inStock: true,
  },
  {
    id: "c2",
    name: "Running Shoes",
    category: "Clothing",
    price: 120,
    rating: 4.6,
    description:
      "Lightweight breathable running shoes with responsive cushioning for daily training.",
    inStock: true,
  },
  {
    id: "c3",
    name: "Casual Backpack",
    category: "Clothing",
    price: 85,
    rating: 4.5,
    description:
      "Water-resistant laptop backpack with ergonomic straps and multiple compartments.",
    inStock: true,
  },
  {
    id: "c4",
    name: "Wool Beanie",
    category: "Clothing",
    price: 25,
    rating: 4.1,
    description:
      "Cozy merino wool beanie that keeps you warm without overheating.",
    inStock: false,
  },
  // Home
  {
    id: "h1",
    name: "Desk Lamp",
    category: "Home",
    price: 38,
    rating: 4.4,
    description:
      "Adjustable LED desk lamp with multiple brightness levels and a warm-to-cool color range.",
    inStock: true,
  },
  {
    id: "h2",
    name: "Standing Desk Mat",
    category: "Home",
    price: 45,
    rating: 4.2,
    description:
      "Anti-fatigue standing desk mat with cushioned support for long work sessions.",
    inStock: true,
  },
  {
    id: "h3",
    name: "Mechanical Keyboard",
    category: "Home",
    price: 149,
    rating: 4.8,
    description:
      "Hot-swappable mechanical keyboard with RGB backlighting and a satisfying tactile feel.",
    inStock: true,
  },
  {
    id: "h4",
    name: "Monitor Light Bar",
    category: "Home",
    price: 55,
    rating: 4.6,
    description:
      "Screen-mounted light bar that reduces eye strain with asymmetric lighting design.",
    inStock: true,
  },
];

type SortField = "price" | "rating" | "name";
type SortDirection = "asc" | "desc";

interface SortOrder {
  field: SortField;
  direction: SortDirection;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              filled
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            )}
          />
        );
      })}
      <span className="ml-1 text-xs text-muted-foreground">{rating}</span>
    </div>
  );
}

export function CopilotSearch({
  products = DEFAULT_PRODUCTS,
  className,
}: CopilotSearchProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredResults = useMemo(() => {
    let result = [...products];

    // Apply text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Apply category filters
    if (filters.length > 0) {
      result = result.filter((p) =>
        filters.some(
          (f) =>
            p.category.toLowerCase() === f.toLowerCase() ||
            p.name.toLowerCase().includes(f.toLowerCase())
        )
      );
    }

    // Apply sort
    if (sortOrder) {
      result.sort((a, b) => {
        let cmp = 0;
        if (sortOrder.field === "price") {
          cmp = a.price - b.price;
        } else if (sortOrder.field === "rating") {
          cmp = a.rating - b.rating;
        } else {
          cmp = a.name.localeCompare(b.name);
        }
        return sortOrder.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [products, query, filters, sortOrder]);

  const triggerHighlight = useCallback((productId: string) => {
    setHighlightedId(productId);
    if (highlightTimeout.current) {
      clearTimeout(highlightTimeout.current);
    }
    highlightTimeout.current = setTimeout(() => {
      setHighlightedId(null);
    }, 1500);
  }, []);

  // Expose search state to AI
  useCopilotReadable({
    description:
      "Current search interface state including results, active filters, and sort order",
    value: {
      query,
      totalProducts: products.length,
      visibleResults: filteredResults.length,
      activeFilters: filters,
      sortOrder,
      results: filteredResults.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        rating: p.rating,
        inStock: p.inStock,
      })),
      availableCategories: [
        ...new Set(products.map((p) => p.category)),
      ],
    },
  });

  // AI action: search products
  useCopilotAction({
    name: "search",
    description:
      "Search for products by name, category, or description. Sets the search query text.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The search query to filter products",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Searching...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Searched for <strong>&quot;{args.query}&quot;</strong>
          </span>
        </div>
      );
    },
    handler: ({ query: searchQuery }) => {
      setQuery(searchQuery);
      return `Search updated to "${searchQuery}"`;
    },
  });

  // AI action: add filter
  useCopilotAction({
    name: "addFilter",
    description:
      "Add a filter chip to narrow down results by category or keyword. Available categories: Electronics, Books, Clothing, Home.",
    parameters: [
      {
        name: "filter",
        type: "string",
        description: "The filter value to add (e.g., a category name)",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Adding filter...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Added filter <strong>&quot;{args.filter}&quot;</strong>
          </span>
        </div>
      );
    },
    handler: ({ filter }) => {
      setFilters((prev) => {
        if (prev.some((f) => f.toLowerCase() === filter.toLowerCase())) {
          return prev;
        }
        return [...prev, filter];
      });
      return `Filter "${filter}" added`;
    },
  });

  // AI action: remove filter
  useCopilotAction({
    name: "removeFilter",
    description: "Remove an active filter chip from the search results",
    parameters: [
      {
        name: "filter",
        type: "string",
        description: "The filter value to remove",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
            <span>Removing filter...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Removed filter <strong>&quot;{args.filter}&quot;</strong>
          </span>
        </div>
      );
    },
    handler: ({ filter }) => {
      setFilters((prev) =>
        prev.filter((f) => f.toLowerCase() !== filter.toLowerCase())
      );
      return `Filter "${filter}" removed`;
    },
  });

  // AI action: sort results
  useCopilotAction({
    name: "sortResults",
    description:
      "Sort search results by a specific field in ascending or descending order",
    parameters: [
      {
        name: "field",
        type: "string",
        description:
          "The field to sort by: 'price', 'rating', or 'name'",
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
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>Sorting results...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Sorted by <strong>{args.field}</strong>{" "}
            {args.direction === "asc" ? "ascending" : "descending"}
          </span>
        </div>
      );
    },
    handler: ({ field, direction }) => {
      const validFields: SortField[] = ["price", "rating", "name"];
      if (!validFields.includes(field as SortField)) {
        return `Invalid sort field "${field}". Use price, rating, or name.`;
      }
      setSortOrder({
        field: field as SortField,
        direction: direction as SortDirection,
      });
      return `Results sorted by ${field} ${direction}ending`;
    },
  });

  // AI action: highlight result
  useCopilotAction({
    name: "highlightResult",
    description:
      "Highlight a specific product result to draw attention to it. The highlight will glow briefly.",
    parameters: [
      {
        name: "productId",
        type: "string",
        description:
          "The product ID to highlight (e.g., 'e1', 'b2', 'c3', 'h4')",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Highlighting result...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Highlighted product <strong>{args.productId}</strong>
          </span>
        </div>
      );
    },
    handler: ({ productId }) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return `Product with ID "${productId}" not found`;
      triggerHighlight(productId);
      return `Highlighted "${product.name}"`;
    },
  });

  const removeFilter = (filter: string) => {
    setFilters((prev) => prev.filter((f) => f !== filter));
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active filter chips */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="gap-1.5 bg-violet-500/10 text-violet-400 border border-violet-500/30 pr-1.5"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-violet-500/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button
            onClick={() => {
              setFilters([]);
              setSortOrder(null);
              setQuery("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Result count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredResults.length} of {products.length} products
        </span>
        {sortOrder && (
          <span className="flex items-center gap-1 text-xs">
            <Sparkles className="h-3 w-3 text-blue-400" />
            Sorted by {sortOrder.field}{" "}
            {sortOrder.direction === "asc" ? "ascending" : "descending"}
          </span>
        )}
      </div>

      {/* Results grid */}
      {filteredResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 py-12 text-muted-foreground">
          <Search className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm">No products found.</p>
          <p className="text-xs text-muted-foreground/60">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredResults.map((product) => {
            const isHighlighted = highlightedId === product.id;
            return (
              <div
                key={product.id}
                className={cn(
                  "rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-300",
                  isHighlighted &&
                    "border-violet-500/60 shadow-[0_0_0_1px_rgba(139,92,246,0.3),0_0_16px_rgba(139,92,246,0.25)] animate-[highlight-glow_1.5s_ease-in-out]",
                  !isHighlighted && "hover:border-border hover:bg-card/80"
                )}
              >
                {/* Header: name and category */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground">
                    {product.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[10px] px-2 py-0.5"
                  >
                    {product.category}
                  </Badge>
                </div>

                {/* Price and rating */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    ${product.price}
                  </span>
                  <StarRating rating={product.rating} />
                </div>

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>

                {/* Stock indicator */}
                <div className="mt-3 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      product.inStock ? "bg-emerald-400" : "bg-red-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs",
                      product.inStock
                        ? "text-emerald-400"
                        : "text-red-400"
                    )}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
