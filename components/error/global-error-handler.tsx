"use client";

import React, { useEffect } from "react";
import { setupGlobalErrorHandling } from "@/lib/error-handling";

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  useEffect(() => {
    // Setup global error handling when component mounts
    setupGlobalErrorHandling();
  }, []);

  return <>{children}</>;
}
