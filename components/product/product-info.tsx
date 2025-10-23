"use client";

import React from "react";
import { Product, Shop } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Package, Tag, Star } from "lucide-react";

interface ProductInfoProps {
  product: Product;
  shop?: Shop;
}

export function ProductInfo({ product, shop }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
            {product.name}
          </h1>
          <Badge
            variant={product.isAvailable ? "default" : "secondary"}
            className="ml-4"
          >
            {product.isAvailable ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        {shop && (
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
            <span>by</span>
            <span className="font-medium text-rose-600">{shop.name}</span>
            {shop.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{shop.rating}</span>
              </div>
            )}
          </div>
        )}

        <p className="text-neutral-600 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Price */}
      <div className="border-t border-b border-neutral-200 py-4">
        <div className="text-3xl font-bold text-neutral-900">
          ₴{product.price.toLocaleString()}
        </div>
        <div className="text-sm text-neutral-500 mt-1">
          Price includes all taxes and fees
        </div>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Clock className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <div className="font-medium text-neutral-900">
                  Delivery Time
                </div>
                <div className="text-sm text-neutral-600">
                  {product.estimatedDeliveryTime} minutes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-neutral-900">Stock Level</div>
                <div className="text-sm text-neutral-600">
                  {product.isAvailable
                    ? `${product.stock} items available`
                    : "Currently unavailable"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category and Tags */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-neutral-500" />
            <span className="font-medium text-neutral-900">Category</span>
          </div>
          <Badge variant="outline" className="capitalize">
            {product.category}
          </Badge>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-neutral-500" />
              <span className="font-medium text-neutral-900">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="capitalize text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stock Warning */}
      {product.isAvailable && product.stock <= 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Limited Stock
            </span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            Only {product.stock} items left. Order soon to avoid disappointment!
          </p>
        </div>
      )}
    </div>
  );
}
