"use client";

import React, { useState } from "react";
import { ProductFilters as ProductFiltersType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Tag,
  Package,
  Clock,
  Star,
} from "lucide-react";

interface ProductFiltersAdvancedProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  availableCategories: string[];
  availableTags: string[];
  priceRange: { min: number; max: number };
  deliveryTimeRange: { min: number; max: number };
}

export function ProductFiltersAdvanced({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  priceRange,
  deliveryTimeRange,
}: ProductFiltersAdvancedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceSliderValue, setPriceSliderValue] = useState([
    filters.minPrice || priceRange.min,
    filters.maxPrice || priceRange.max,
  ]);
  const [deliveryTimeSliderValue, setDeliveryTimeSliderValue] = useState([
    deliveryTimeRange.min,
    filters.maxDeliveryTime || deliveryTimeRange.max,
  ]);

  const hasActiveFilters =
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.isAvailable !== undefined ||
    (filters.tags && filters.tags.length > 0) ||
    filters.maxDeliveryTime;

  const activeFilterCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.isAvailable !== undefined,
    filters.tags && filters.tags.length > 0,
    filters.maxDeliveryTime,
  ].filter(Boolean).length;

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

  const handlePriceSliderChange = (value: number[]) => {
    setPriceSliderValue(value);
  };

  const handlePriceSliderCommit = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: value[0] === priceRange.min ? undefined : value[0],
      maxPrice: value[1] === priceRange.max ? undefined : value[1],
    });
  };

  const handleDeliveryTimeSliderChange = (value: number[]) => {
    setDeliveryTimeSliderValue(value);
  };

  const handleDeliveryTimeSliderCommit = (value: number[]) => {
    onFiltersChange({
      ...filters,
      maxDeliveryTime:
        value[1] === deliveryTimeRange.max ? undefined : value[1],
    });
  };

  const clearAllFilters = () => {
    setPriceSliderValue([priceRange.min, priceRange.max]);
    setDeliveryTimeSliderValue([deliveryTimeRange.min, deliveryTimeRange.max]);
    onFiltersChange({});
  };

  const quickFilters = [
    { label: "Under ₴500", filter: { maxPrice: 500 } },
    { label: "₴500-₴1000", filter: { minPrice: 500, maxPrice: 1000 } },
    { label: "Over ₴1000", filter: { minPrice: 1000 } },
    { label: "Fast Delivery", filter: { maxDeliveryTime: 30 } },
    { label: "In Stock", filter: { isAvailable: true } },
  ];

  const applyQuickFilter = (quickFilter: any) => {
    onFiltersChange({
      ...filters,
      ...quickFilter,
    });

    // Update sliders
    if (quickFilter.minPrice || quickFilter.maxPrice) {
      setPriceSliderValue([
        quickFilter.minPrice || priceRange.min,
        quickFilter.maxPrice || priceRange.max,
      ]);
    }
    if (quickFilter.maxDeliveryTime) {
      setDeliveryTimeSliderValue([
        deliveryTimeRange.min,
        quickFilter.maxDeliveryTime,
      ]);
    }
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
                {activeFilterCount}
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

        {/* Quick Filters */}
        <div className="mb-6">
          <div className="text-sm font-medium text-neutral-700 mb-2">
            Quick Filters
          </div>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((quick, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyQuickFilter(quick.filter)}
                className="text-xs"
              >
                {quick.label}
              </Button>
            ))}
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

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium">Price Range</span>
            </div>
            <div className="px-2">
              <Slider
                value={priceSliderValue}
                onValueChange={handlePriceSliderChange}
                onValueCommit={handlePriceSliderCommit}
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>₴{priceSliderValue[0]}</span>
                <span>₴{priceSliderValue[1]}</span>
              </div>
            </div>
          </div>

          {/* Delivery Time Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium">Max Delivery Time</span>
            </div>
            <div className="px-2">
              <Slider
                value={deliveryTimeSliderValue}
                onValueChange={handleDeliveryTimeSliderChange}
                onValueCommit={handleDeliveryTimeSliderCommit}
                min={deliveryTimeRange.min}
                max={deliveryTimeRange.max}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>{deliveryTimeSliderValue[0]}min</span>
                <span>{deliveryTimeSliderValue[1]}min</span>
              </div>
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
                {filters.tags && filters.tags.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.tags.length}
                  </Badge>
                )}
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
