"use client";

import React from "react";
import { CartState } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/utils";
import { useCartDeliveryEstimate } from "@/hooks/use-delivery-estimation";
import { DeliveryTime } from "@/components/ui/delivery-time";
import { Package } from "lucide-react";
import { mockShops } from "@/lib/mock-data";

interface CartSummaryProps {
  cartState: CartState;
  showDeliveryEstimate?: boolean;
  className?: string;
  customerAddress?: any; // Address type from lib/types
}

export function CartSummary({
  cartState,
  showDeliveryEstimate = true,
  className = "",
  customerAddress,
}: CartSummaryProps) {
  const { totalItems, totalAmount, items } = cartState;

  // Get enhanced delivery estimate
  const { estimate, isLoading } = useCartDeliveryEstimate(
    items,
    mockShops,
    customerAddress
  );

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
        {showDeliveryEstimate && (
          <div className="text-sm">
            {isLoading ? (
              <div className="flex items-center gap-2 text-neutral-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-neutral-300 border-t-neutral-600"></div>
                <span>Calculating delivery time...</span>
              </div>
            ) : estimate ? (
              <DeliveryTime
                estimate={estimate}
                variant="simple"
                showConfidence={true}
              />
            ) : null}
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
