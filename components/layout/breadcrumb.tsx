import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { clsx } from "clsx";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx("flex items-center space-x-1 text-sm", className)}
    >
      {/* Home link */}
      <Link
        href="/"
        className="flex items-center text-neutral-500 hover:text-neutral-700 transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.length > 0 && (
        <ChevronRight className="h-4 w-4 text-neutral-400" />
      )}

      {/* Breadcrumb items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-neutral-500 hover:text-neutral-700 transition-colors truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={clsx(
                  "truncate",
                  isLast ? "text-neutral-900 font-medium" : "text-neutral-500"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
