"use client";

import React from "react";
import { Order } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface OrderFiltersProps {
  filters: {
    status: "all" | Order["status"];
    dateRange: "all" | "week" | "month" | "year";
    sortBy: "newest" | "oldest" | "amount_high" | "amount_low";
  };
  onFiltersChange: (filters: OrderFiltersProps["filters"]) => void;
  orderCount: number;
}

export function OrderFilters({
  filters,
  onFiltersChange,
  orderCount,
}: OrderFiltersProps) {
  const hasActiveFilters =
    filters.status !== "all" || filters.dateRange !== "all";

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      dateRange: "all",
      sortBy: filters.sortBy,
    });
  };

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "amount_high", label: "Highest Amount" },
    { value: "amount_low", label: "Lowest Amount" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium text-neutral-700">
                Filters:
              </span>
            </div>

            {/* Status Filter */}
            <div className="min-w-[140px]">
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    status: value as typeof filters.status,
                  })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="min-w-[140px]">
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: value as typeof filters.dateRange,
                  })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="min-w-[140px]">
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    sortBy: value as typeof filters.sortBy,
                  })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2 h-9"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {orderCount} {orderCount === 1 ? "order" : "orders"}
            </Badge>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-200">
            <span className="text-sm text-neutral-600">Active filters:</span>
            {filters.status !== "all" && (
              <Badge variant="outline" className="text-xs">
                Status:{" "}
                {statusOptions.find((o) => o.value === filters.status)?.label}
              </Badge>
            )}
            {filters.dateRange !== "all" && (
              <Badge variant="outline" className="text-xs">
                Date:{" "}
                {
                  dateRangeOptions.find((o) => o.value === filters.dateRange)
                    ?.label
                }
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
