"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface ProductSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "delivery_time", label: "Delivery Time" },
  { value: "name", label: "Name A-Z" },
];

export function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  const currentSort = sortOptions.find((option) => option.value === sortBy);

  const getSortIcon = (value: string) => {
    if (value === sortBy) {
      if (
        value.includes("_asc") ||
        value === "delivery_time" ||
        value === "name"
      ) {
        return <ArrowUp className="h-3 w-3" />;
      } else if (value.includes("_desc")) {
        return <ArrowDown className="h-3 w-3" />;
      }
    }
    return <ArrowUpDown className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-600 hidden sm:inline">
        Sort by:
      </span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange(option.value)}
            className="flex items-center gap-1 text-xs"
          >
            {getSortIcon(option.value)}
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">
              {option.label.split(":")[0] || option.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
