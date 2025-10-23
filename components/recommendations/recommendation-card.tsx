"use client";

import React from "react";
import Link from "next/link";
import { ProductRecommendation } from "@/lib/recommendations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Clock, ShoppingCart, Star, Sparkles } from "lucide-react";
import { formatCurrency, formatDeliveryTime } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: ProductRecommendation;
  onAddToCart?: (product: ProductRecommendation["product"]) => void;
  onView?: (productId: string, shopId: string, category: string) => void;
  compact?: boolean;
}

const reasonIcons = {
  browsing_history: Sparkles,
  popular: Star,
  seasonal: Clock,
  similar_customers: Star,
  category_match: Sparkles,
  shop_favorite: Star,
};

const reasonColors = {
  browsing_history: "bg-purple-100 text-purple-700 border-purple-200",
  popular: "bg-yellow-100 text-yellow-700 border-yellow-200",
  seasonal: "bg-green-100 text-green-700 border-green-200",
  similar_customers: "bg-blue-100 text-blue-700 border-blue-200",
  category_match: "bg-indigo-100 text-indigo-700 border-indigo-200",
  shop_favorite: "bg-rose-100 text-rose-700 border-rose-200",
};

export function RecommendationCard({
  recommendation,
  onAddToCart,
  onView,
  compact = false,
}: RecommendationCardProps) {
  const { product, shop, reason, explanation } = recommendation;
  const ReasonIcon = reasonIcons[reason];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleView = () => {
    onView?.(product.id, product.shopId, product.category);
  };

  return (
    <Link
      href={`/shops/${product.shopId}/products/${product.id}`}
      onClick={handleView}
      className="tap-target"
    >
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full active:scale-95 md:active:scale-100">
        <CardContent className="p-0">
          {/* Product Image */}
          <div
            className={`relative overflow-hidden rounded-t-lg ${
              compact ? "aspect-[4/3]" : "aspect-square"
            }`}
          >
            <OptimizedImage
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="group-hover:scale-105 transition-transform duration-200"
              sizes={
                compact
                  ? "(max-width: 640px) 50vw, 25vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              aspectRatio={compact ? "landscape" : "square"}
              priority={false}
            />

            {/* Availability Badge */}
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="bg-white text-neutral-900 text-xs"
                >
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Recommendation Reason Badge */}
            <div className="absolute top-1 md:top-2 left-1 md:left-2">
              <Badge
                variant="outline"
                className={`${reasonColors[reason]} border text-xs flex items-center gap-1`}
              >
                <ReasonIcon className="h-2 md:h-3 w-2 md:w-3" />
                <span className="hidden sm:inline">
                  {reason === "browsing_history"
                    ? "For You"
                    : reason === "popular"
                    ? "Popular"
                    : reason === "seasonal"
                    ? "Seasonal"
                    : reason === "category_match"
                    ? "Similar"
                    : reason === "shop_favorite"
                    ? "Favorite Shop"
                    : "Recommended"}
                </span>
              </Badge>
            </div>

            {/* Category Badge */}
            <div className="absolute top-1 md:top-2 right-1 md:right-2">
              <Badge variant="secondary" className="capitalize text-xs">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className={`space-y-2 ${compact ? "p-3" : "p-4"}`}>
            <div>
              <h3
                className={`font-semibold text-neutral-900 line-clamp-2 group-hover:text-rose-600 transition-colors ${
                  compact ? "text-sm" : ""
                }`}
              >
                {product.name}
              </h3>
              {!compact && (
                <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                  {product.description}
                </p>
              )}
            </div>

            {/* Shop Info */}
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-medium">{shop.name}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{shop.rating}</span>
              </div>
            </div>

            {/* Recommendation Explanation */}
            {!compact && (
              <p className="text-xs text-neutral-500 italic">{explanation}</p>
            )}

            {/* Price and Delivery */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div
                  className={`font-bold text-neutral-900 ${
                    compact ? "text-base" : "text-lg"
                  }`}
                >
                  {formatCurrency(product.price)}
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Clock className="h-3 w-3" />
                  {formatDeliveryTime(product.estimatedDeliveryTime)}
                </div>
              </div>

              {/* Add to Cart Button */}
              {product.isAvailable && (
                <Button
                  size={compact ? "sm" : "default"}
                  onClick={handleAddToCart}
                  className="flex items-center gap-1 tap-target"
                >
                  <ShoppingCart className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {compact ? "Add" : "Add to Cart"}
                  </span>
                  <span className="sm:hidden">+</span>
                </Button>
              )}
            </div>

            {/* Stock Info */}
            {product.isAvailable && product.stock <= 5 && (
              <div className="text-xs text-amber-600">
                Only {product.stock} left in stock
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
