"use client";

import React from "react";
import { clsx } from "clsx";

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  centerContent?: boolean;
}

export function MobileContainer({
  children,
  className,
  padding = "md",
  maxWidth = "2xl",
  centerContent = false,
}: MobileContainerProps) {
  const paddingClasses = {
    none: "",
    sm: "px-2 md:px-4",
    md: "px-4 md:px-6 lg:px-8",
    lg: "px-6 md:px-8 lg:px-12",
  };

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={clsx(
        "w-full mx-auto",
        paddingClasses[padding],
        maxWidthClasses[maxWidth],
        centerContent && "flex flex-col items-center",
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobileSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
  background?: "transparent" | "white" | "gray";
}

export function MobileSection({
  children,
  className,
  spacing = "md",
  background = "transparent",
}: MobileSectionProps) {
  const spacingClasses = {
    none: "",
    sm: "py-4 md:py-6",
    md: "py-6 md:py-8",
    lg: "py-8 md:py-12",
  };

  const backgroundClasses = {
    transparent: "",
    white: "bg-white",
    gray: "bg-neutral-50",
  };

  return (
    <section
      className={clsx(
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
}

interface MobileGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
  };
  gap?: "sm" | "md" | "lg";
}

export function MobileGrid({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
}: MobileGridProps) {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4 md:gap-6",
    lg: "gap-6 md:gap-8",
  };

  const getColumnClasses = () => {
    const { mobile = 1, tablet = 2, desktop = 3 } = columns;
    return clsx(
      `grid-cols-${mobile}`,
      `sm:grid-cols-${tablet}`,
      `lg:grid-cols-${desktop}`
    );
  };

  return (
    <div
      className={clsx("grid", getColumnClasses(), gapClasses[gap], className)}
    >
      {children}
    </div>
  );
}
