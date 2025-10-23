"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SimpleDeliveryTime } from "@/components/ui/delivery-time";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <Link
      href={`/shops/${product.shopId}/products/${product.id}`}
      className="tap-target"
    >
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full active:scale-95 md:active:scale-100">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <OptimizedImage
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              aspectRatio="square"
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

            {/* Category Badge */}
            <div className="absolute top-2 md:top-3 left-2 md:left-3">
              <Badge variant="secondary" className="capitalize text-xs">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3 md:p-4 space-y-2 md:space-y-3">
            <div>
              <h3 className="font-semibold text-sm md:text-base text-neutral-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 line-clamp-2 mt-1 hidden sm:block">
                {product.description}
              </p>
            </div>

            {/* Price and Delivery */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-base md:text-lg font-bold text-neutral-900">
                  ₴{product.price}
                </div>
                <SimpleDeliveryTime
                  minutes={product.estimatedDeliveryTime}
                  className="text-xs text-neutral-500"
                />
              </div>

              {/* Add to Cart Button */}
              {product.isAvailable && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="flex items-center gap-1 tap-target min-h-[36px]"
                >
                  <ShoppingCart className="h-3 w-3" />
                  <span className="hidden sm:inline">Add</span>
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
