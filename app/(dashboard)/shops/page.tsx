"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Shop, ShopFilters } from "@/lib/types";
import {
  mockShops,
  mockProducts,
  sortShops,
  filterShops,
  searchShops,
} from "@/lib/mock-data";
import { ShopGrid } from "@/components/shop/shop-grid";
import { ShopSort } from "@/components/shop/shop-sort";
import { ShopSearch } from "@/components/shop/shop-search";
import { ShopFilters as ShopFiltersComponent } from "@/components/shop/shop-filters";
import {
  RecommendationsSection,
  BrowsingHistoryStats,
} from "@/components/recommendations";
import {
  useRecommendations,
  useBrowsingHistory,
} from "@/hooks/use-recommendations";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCart } from "@/contexts/cart-context";

export default function ShopsPage() {
  const [allShops] = useState<Shop[]>(mockShops);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("distance");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ShopFilters>({});

  // Debounce search query to avoid excessive filtering
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  // Recommendations hook
  const {
    recommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    refreshRecommendations,
    trackProductView,
    browsingStats,
  } = useRecommendations({
    products: mockProducts,
    shops: mockShops,
    limit: 8,
    autoRefresh: false,
  });

  // Browsing history hook
  const { clearHistory } = useBrowsingHistory();

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

  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    const success = addItem(product, 1);
    if (success) {
      console.log("Added to cart:", product.name);
    } else {
      console.log("Failed to add item to cart - validation error");
    }
  };

  const handleProductView = (
    productId: string,
    shopId: string,
    category: string
  ) => {
    trackProductView(productId, shopId, category);
  };

  const handleClearHistory = () => {
    clearHistory();
    refreshRecommendations();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Flower Shops in Kyiv
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            Discover beautiful flowers from local shops near you
          </p>
        </div>

        {/* Recommendations Section */}
        <div className="mb-6 md:mb-8 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="lg:col-span-3">
              <RecommendationsSection
                recommendations={recommendations}
                loading={recommendationsLoading}
                error={recommendationsError}
                onAddToCart={handleAddToCart}
                onProductView={handleProductView}
                onRefresh={refreshRecommendations}
                compact={true}
                maxItems={6}
              />
            </div>
            <div className="lg:col-span-1">
              <BrowsingHistoryStats
                stats={browsingStats}
                shops={mockShops}
                onClearHistory={handleClearHistory}
                compact={true}
              />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="w-full">
              <ShopSearch
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search shops..."
              />
            </div>
            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2">
              <ShopFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
              <ShopSort sortBy={sortBy} onSortChange={handleSortChange} />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="text-xs md:text-sm text-neutral-600">
            {loading ? (
              "Loading shops..."
            ) : (
              <>
                {processedShops.length} shop
                {processedShops.length !== 1 ? "s" : ""} found
                {(debouncedSearchQuery || Object.keys(filters).length > 0) && (
                  <span className="ml-1 hidden sm:inline">
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
