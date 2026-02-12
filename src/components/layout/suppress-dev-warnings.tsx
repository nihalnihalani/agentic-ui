"use client";

import { useEffect } from "react";

/**
 * Suppresses known Next.js 16 dev overlay warnings caused by the component
 * inspector enumerating `params` and `searchParams` Promise props on
 * mousemove/click. These are framework-level dev-only warnings, not
 * application bugs. Safe to remove once Next.js patches the dev overlay.
 */
export function SuppressDevOverlayWarnings() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalConsoleError = console.error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error = (...args: any[]) => {
      const message = typeof args[0] === "string" ? args[0] : "";
      if (
        message.includes("are being enumerated") ||
        message.includes("were accessed directly")
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}
