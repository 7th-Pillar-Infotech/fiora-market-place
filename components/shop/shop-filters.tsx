"use client";

import React from "react";
import { ShopFilters as ShopFiltersType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Star, Clock } from "lucide-react";

interface ShopFiltersProps {
  filters: ShopFiltersType;
  onFiltersChange: (filters: ShopFiltersType) => void;
}

const categories = ["bouquets", "arrangements", "plants", "gifts", "seasonal"];
const ratingOptions = [4.5, 4.0, 3.5, 3.0];
const deliveryTimeOptions = [30, 45, 60, 90]; // minutes

export function ShopFilters({ filters, onFiltersChange }: ShopFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateFilters = (updates: Partial<ShopFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setIsOpen(false);
  };

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof ShopFiltersType];
    return (
      value !== undefined &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : true)
    );
  });

  const activeFilterCount = [
    filters.rating ? 1 : 0,
    filters.maxDeliveryTime ? 1 : 0,
    filters.categories?.length || 0,
    filters.isOpen !== undefined ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="default" size="sm" className="ml-1">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-lg shadow-strong z-20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-900">Filters</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {/* Open/Closed Filter */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Availability
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.isOpen === true ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateFilters({
                        isOpen: filters.isOpen === true ? undefined : true,
                      })
                    }
                  >
                    Open now
                  </Button>
                  <Button
                    variant={filters.isOpen === false ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateFilters({
                        isOpen: filters.isOpen === false ? undefined : false,
                      })
                    }
                  >
                    All shops
                  </Button>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  <Star className="h-4 w-4 inline mr-1" />
                  Minimum Rating
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ratingOptions.map((rating) => (
                    <Button
                      key={rating}
                      variant={
                        filters.rating === rating ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateFilters({
                          rating:
                            filters.rating === rating ? undefined : rating,
                        })
                      }
                      className="justify-start"
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {rating}+
                    </Button>
                  ))}
                </div>
              </div>

              {/* Delivery Time Filter */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Max Delivery Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {deliveryTimeOptions.map((time) => (
                    <Button
                      key={time}
                      variant={
                        filters.maxDeliveryTime === time ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateFilters({
                          maxDeliveryTime:
                            filters.maxDeliveryTime === time ? undefined : time,
                        })
                      }
                      className="justify-start"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {time}min
                    </Button>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isSelected =
                      filters.categories?.includes(category) || false;
                    return (
                      <Button
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const currentCategories = filters.categories || [];
                          const newCategories = isSelected
                            ? currentCategories.filter((c) => c !== category)
                            : [...currentCategories, category];
                          updateFilters({
                            categories:
                              newCategories.length > 0
                                ? newCategories
                                : undefined,
                          });
                        }}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <Button onClick={() => setIsOpen(false)} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
