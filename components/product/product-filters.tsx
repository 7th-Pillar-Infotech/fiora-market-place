"use client";

import React, { useState } from "react";
import { ProductFilters as ProductFiltersType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Tag,
  Package,
} from "lucide-react";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  availableCategories: string[];
  availableTags: string[];
  priceRange: { min: number; max: number };
}

export function ProductFilters({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  priceRange,
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localMinPrice, setLocalMinPrice] = useState(
    filters.minPrice?.toString() || ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    filters.maxPrice?.toString() || ""
  );

  const hasActiveFilters =
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.isAvailable !== undefined ||
    (filters.tags && filters.tags.length > 0);

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined,
    });
  };

  const handleAvailabilityChange = (available: boolean | undefined) => {
    onFiltersChange({
      ...filters,
      isAvailable: filters.isAvailable === available ? undefined : available,
    });
  };

  const handlePriceChange = () => {
    const minPrice = localMinPrice ? parseInt(localMinPrice) : undefined;
    const maxPrice = localMaxPrice ? parseInt(localMaxPrice) : undefined;

    onFiltersChange({
      ...filters,
      minPrice,
      maxPrice,
    });
  };

  const clearAllFilters = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onFiltersChange({});
  };

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Filters Content */}
        <div className={`space-y-6 ${!isExpanded ? "hidden lg:block" : ""}`}>
          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium">Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <Button
                  key={category}
                  variant={
                    filters.category === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className="capitalize text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium">Price Range</span>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder={`Min (₴${priceRange.min})`}
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                onBlur={handlePriceChange}
                className="text-xs"
              />
              <span className="text-neutral-400">-</span>
              <Input
                type="number"
                placeholder={`Max (₴${priceRange.max})`}
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                onBlur={handlePriceChange}
                className="text-xs"
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium">Availability</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filters.isAvailable === true ? "default" : "outline"}
                size="sm"
                onClick={() => handleAvailabilityChange(true)}
                className="text-xs"
              >
                In Stock
              </Button>
              <Button
                variant={filters.isAvailable === false ? "default" : "outline"}
                size="sm"
                onClick={() => handleAvailabilityChange(false)}
                className="text-xs"
              >
                Out of Stock
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-neutral-500" />
                <span className="text-sm font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.slice(0, 20).map((tag) => (
                  <Button
                    key={tag}
                    variant={
                      filters.tags?.includes(tag) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                    className="capitalize text-xs"
                  >
                    {tag}
                    {filters.tags?.includes(tag) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
