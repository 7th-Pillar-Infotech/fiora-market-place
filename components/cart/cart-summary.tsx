"use client";

import React from "react";
import { CartState } from "@/contexts/cart-context";
import { formatCurrency, formatDeliveryTime } from "@/lib/utils";
import { Clock, Package } from "lucide-react";

interface CartSummaryProps {
  cartState: CartState;
  showDeliveryEstimate?: boolean;
  className?: string;
}

export function CartSummary({
  cartState,
  showDeliveryEstimate = true,
  className = "",
}: CartSummaryProps) {
  const { totalItems, totalAmount, estimatedDeliveryTime } = cartState;

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={`bg-neutral-50 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">
        Order Summary
      </h3>

      <div className="space-y-2">
        {/* Item Count */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-neutral-600">
            <Package className="h-4 w-4" />
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {/* Delivery Time */}
        {showDeliveryEstimate && estimatedDeliveryTime > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery</span>
            </div>
            <span className="font-medium text-neutral-900">
              {formatDeliveryTime(estimatedDeliveryTime)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-neutral-200 my-3" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-neutral-900">
            Total
          </span>
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
