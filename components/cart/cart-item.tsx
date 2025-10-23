"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDeliveryTime } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  compact?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: CartItemProps) {
  const { product, quantity } = item;
  const totalPrice = product.price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      onRemove(product.id);
    } else {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-200 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link href={`/shops/${product.shopId}/products/${product.id}`}>
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <Link
              href={`/shops/${product.shopId}/products/${product.id}`}
              className="block"
            >
              <h3 className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {!compact && (
              <p className="text-xs text-neutral-500 mt-1">
                Delivery: {formatDeliveryTime(product.estimatedDeliveryTime)}
              </p>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">
                  {formatCurrency(product.price)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-neutral-500">× {quantity}</span>
                )}
              </div>

              {quantity > 1 && (
                <span className="text-sm font-semibold text-primary-600">
                  {formatCurrency(totalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(product.id)}
            className="h-8 w-8 text-neutral-400 hover:text-red-500 flex-shrink-0 ml-2"
            aria-label={`Remove ${product.name} from cart`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-neutral-200 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              className="h-8 w-8 rounded-r-none border-r border-neutral-200"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="h-8 w-8 rounded-l-none border-l border-neutral-200"
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Stock Warning */}
          {quantity >= product.stock && (
            <span className="text-xs text-amber-600">Max stock reached</span>
          )}
        </div>

        {/* Availability Warning */}
        {!product.isAvailable && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            Currently unavailable
          </div>
        )}
      </div>
    </div>
  );
}
