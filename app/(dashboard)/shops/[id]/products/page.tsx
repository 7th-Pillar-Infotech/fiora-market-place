"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shop, Product, ProductFilters } from "@/lib/types";
import {
  mockShops,
  mockProducts,
  filterProducts,
  sortProducts,
  searchProducts,
} from "@/lib/mock-data";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFiltersAdvanced as ProductFiltersComponent } from "@/components/product/product-filters-advanced";
import { ProductSearchAdvanced as ProductSearch } from "@/components/product/product-search-advanced";
import { ProductSort } from "@/components/product/product-sort";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

export default function ShopProductsPage() {
  const params = useParams();

  const [shop, setShop] = useState<Shop | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState("relevance");

  const { addItem } = useCart();

  // Load shop and products
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      const foundShop = mockShops.find((s) => s.id === params.id);
      const shopProducts = mockProducts.filter((p) => p.shopId === params.id);

      setShop(foundShop || null);
      setAllProducts(shopProducts);
      setLoading(false);
    };

    if (params.id) {
      loadData();
    }
  }, [params.id]);

  // Process products with search, filters, and sorting
  const processedProducts = useMemo(() => {
    let products = [...allProducts];

    // Apply search
    if (searchQuery.trim()) {
      products = searchProducts(products, searchQuery);
    }

    // Apply filters
    products = filterProducts(products, filters);

    // Apply sorting
    products = sortProducts(products, sortBy);

    return products;
  }, [allProducts, searchQuery, filters, sortBy]);

  // Get available filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(allProducts.map((p) => p.category))];
    const tags = [...new Set(allProducts.flatMap((p) => p.tags))];
    const prices = allProducts.map((p) => p.price);
    const deliveryTimes = allProducts.map((p) => p.estimatedDeliveryTime);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
    const deliveryTimeRange = {
      min: Math.min(...deliveryTimes),
      max: Math.max(...deliveryTimes),
    };

    return { categories, tags, priceRange, deliveryTimeRange };
  }, [allProducts]);

  const handleAddToCart = (product: Product) => {
    const success = addItem(product, 1);
    if (success) {
      console.log("Added to cart:", product.name);
    } else {
      console.log("Failed to add item to cart - validation error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-96 bg-neutral-200 rounded-xl"></div>
              </div>
              <div className="lg:col-span-3 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1 h-10 bg-neutral-200 rounded"></div>
                  <div className="h-10 bg-neutral-200 rounded w-32"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="aspect-square bg-neutral-200 rounded"></div>
                      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/shops">
            <Button variant="ghost" className="mb-8 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Shops
            </Button>
          </Link>

          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-neutral-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Shop not found
            </h1>
            <p className="text-neutral-600 mb-6">
              The shop you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/shops">
              <Button>Browse All Shops</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Link href={`/shops/${shop.id}`}>
          <Button variant="ghost" className="mb-8 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {shop.name}
          </Button>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {shop.name} Products
          </h1>
          <p className="text-neutral-600">
            Browse our collection of fresh flowers and arrangements
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <ProductFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={filterOptions.categories}
              availableTags={filterOptions.tags}
              priceRange={filterOptions.priceRange}
              deliveryTimeRange={filterOptions.deliveryTimeRange}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <ProductSearch
                      value={searchQuery}
                      onChange={setSearchQuery}
                      products={allProducts}
                      placeholder={`Search products in ${shop.name}...`}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                {processedProducts.length} of {allProducts.length} products
                {searchQuery && (
                  <span> matching &quot;{searchQuery}&quot;</span>
                )}
              </div>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({});
                    setSortBy("relevance");
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={processedProducts}
              onAddToCart={handleAddToCart}
              loading={false}
            />

            {/* Empty State for No Results */}
            {!loading &&
              processedProducts.length === 0 &&
              allProducts.length > 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No products match your criteria
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Try adjusting your search terms or filters to find what
                    you&apos;re looking for.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({});
                      setSortBy("relevance");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
