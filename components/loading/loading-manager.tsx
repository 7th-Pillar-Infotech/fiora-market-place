"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Skeleton, SkeletonGrid, SkeletonList } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  loadingStates: LoadingState;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
  isAnyLoading: () => boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key] || false;
    },
    [loadingStates]
  );

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  return (
    <LoadingContext.Provider
      value={{
        loadingStates,
        setLoading,
        isLoading,
        isAnyLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
// Loading spinner component
export function LoadingSpinner({
  size = "default",
  className = "",
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

// Full page loading overlay
export function LoadingOverlay({
  message = "Loading...",
  show = true,
}: {
  message?: string;
  show?: boolean;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary-600" />
        <p className="text-neutral-600">{message}</p>
      </div>
    </div>
  );
}

// Loading button component
export function LoadingButton({
  loading = false,
  children,
  loadingText = "Loading...",
  ...props
}: {
  loading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

// Loading card placeholder
export function LoadingCard({
  title = "Loading...",
  description = "Please wait while we load the content.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary-600" />
        <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-sm text-neutral-600">{description}</p>
      </CardContent>
    </Card>
  );
}
