"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Shop, ShopFilters } from "@/lib/types";
import {
  mockShops,
  sortShops,
  filterShops,
  searchShops,
} from "@/lib/mock-data";
import { ShopGrid } from "@/components/shop/shop-grid";
import { ShopSort } from "@/components/shop/shop-sort";
import { ShopSearch } from "@/components/shop/shop-search";
import { ShopFilters as ShopFiltersComponent } from "@/components/shop/shop-filters";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function ShopsPage() {
  const [allShops] = useState<Shop[]>(mockShops);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("distance");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ShopFilters>({});

  // Debounce search query to avoid excessive filtering
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  // Compute filtered and sorted shops
  const processedShops = useMemo(() => {
    let result = allShops;

    // Apply search
    if (debouncedSearchQuery.trim()) {
      result = searchShops(result, debouncedSearchQuery);
    }

    // Apply filters
    result = filterShops(result, filters);

    // Apply sorting
    result = sortShops(result, sortBy);

    return result;
  }, [allShops, debouncedSearchQuery, filters, sortBy]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: ShopFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Flower Shops in Kyiv
          </h1>
          <p className="text-neutral-600">
            Discover beautiful flowers from local shops near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <ShopSearch
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search shops by name, category, or description..."
              />
            </div>
            <div className="flex items-center gap-3">
              <ShopFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
              <ShopSort sortBy={sortBy} onSortChange={handleSortChange} />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-neutral-600">
            {loading ? (
              "Loading shops..."
            ) : (
              <>
                {processedShops.length} shop
                {processedShops.length !== 1 ? "s" : ""} found
                {(debouncedSearchQuery || Object.keys(filters).length > 0) && (
                  <span className="ml-1">
                    {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
                    {Object.keys(filters).length > 0 && " with filters applied"}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Shop Grid */}
        <ShopGrid shops={processedShops} loading={loading} />
      </div>
    </div>
  );
}
