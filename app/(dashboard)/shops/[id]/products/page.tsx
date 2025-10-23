"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product, Shop } from "@/lib/types";
import { mockShops, mockProducts } from "@/lib/mock-data";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductSort } from "@/components/product/product-sort";
import { ProductSearch } from "@/components/product/product-search";
// Simple category filter component
const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

export default function ShopProductsPage() {
  const params = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { addItem } = useCart();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      console.log("Products page loading data for shop:", params.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundShop = mockShops.find((s) => s.id === params.id);
      const shopProducts = mockProducts.filter((p) => p.shopId === params.id);

      console.log("Found shop:", foundShop?.name);
      console.log("Found products:", shopProducts.length);

      setShop(foundShop || null);
      setAllProducts(shopProducts);
      setLoading(false);
    };

    if (params.id) {
      loadData();
    }
  }, [params.id]);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let result = allProducts;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = result.sort((a, b) => b.price - a.price);
        break;
      case "delivery_time":
        result = result.sort(
          (a, b) => a.estimatedDeliveryTime - b.estimatedDeliveryTime
        );
        break;
      case "availability":
        result = result.sort(
          (a, b) => (b.isAvailable ? 1 : 0) - (a.isAvailable ? 1 : 0)
        );
        break;
      case "name":
      default:
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allProducts.map((p) => p.category)));
    return cats.sort();
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
            <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
            <div className="space-y-6">
              <div className="h-12 bg-neutral-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-neutral-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
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
              <ShoppingBag className="w-12 h-12 text-neutral-400" />
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            {shop.name} - Products
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            Browse beautiful flowers and arrangements from {shop.name}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <ProductSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search products..."
              />
            </div>
            <div className="flex items-center gap-3">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-neutral-600">
            {processedProducts.length} product
            {processedProducts.length !== 1 ? "s" : ""} found
            {(searchQuery || selectedCategory) && (
              <span className="ml-1">
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {processedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No products found
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filters"
                : "This shop doesn't have any products available right now"}
            </p>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <ProductGrid
            products={processedProducts}
            loading={loading}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
}
