"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ShopSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const sortOptions = [
  { value: "distance", label: "Distance" },
  { value: "rating", label: "Rating" },
  { value: "delivery_time", label: "Delivery Time" },
  { value: "reviews", label: "Most Reviews" },
];

export function ShopSort({ sortBy, onSortChange }: ShopSortProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentSort =
    sortOptions.find((option) => option.value === sortBy) || sortOptions[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[140px] justify-between"
      >
        <span className="text-sm">Sort by: {currentSort.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-medium z-20">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  sortBy === option.value
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
