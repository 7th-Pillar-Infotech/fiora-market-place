"use client";

import React, { useRef } from "react";
import { ProductRecommendation } from "@/lib/recommendations";
import { RecommendationCard } from "./recommendation-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RefreshCw, Sparkles } from "lucide-react";

interface RecommendationsSectionProps {
  recommendations: ProductRecommendation[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  onAddToCart?: (product: ProductRecommendation["product"]) => void;
  onProductView?: (productId: string, shopId: string, category: string) => void;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  compact?: boolean;
  maxItems?: number;
}

export function RecommendationsSection({
  recommendations,
  loading = false,
  error = null,
  title = "Recommended for You",
  subtitle = "Discover flowers you'll love based on your preferences",
  onAddToCart,
  onProductView,
  onRefresh,
  showRefreshButton = true,
  compact = false,
  maxItems,
}: RecommendationsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayedRecommendations = maxItems
    ? recommendations.slice(0, maxItems)
    : recommendations;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = compact ? 280 : 320;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = compact ? 280 : 320;
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-rose-500" />
                {title}
              </CardTitle>
              <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: compact ? 6 : 4 }).map((_, index) => (
              <div
                key={index}
                className={`flex-shrink-0 ${
                  compact ? "w-64" : "w-72"
                } animate-pulse`}
              >
                <div className="bg-neutral-200 rounded-lg aspect-square mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-neutral-600 mb-4">{error}</p>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (displayedRecommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 mb-2">
              No recommendations available yet
            </p>
            <p className="text-sm text-neutral-500">
              Browse some products to get personalized recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              {title}
            </CardTitle>
            <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {showRefreshButton && onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
            )}

            {/* Scroll Controls */}
            {displayedRecommendations.length > (compact ? 4 : 3) && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollLeft}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollRight}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayedRecommendations.map((recommendation) => (
            <div
              key={recommendation.product.id}
              className={`flex-shrink-0 ${compact ? "w-64" : "w-72"}`}
            >
              <RecommendationCard
                recommendation={recommendation}
                onAddToCart={onAddToCart}
                onView={onProductView}
                compact={compact}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
