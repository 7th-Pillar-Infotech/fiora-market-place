"use client";

import React from "react";
import { CartItem, Address } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useCartDeliveryEstimate } from "@/hooks/use-delivery-estimation";
import { DeliveryTime } from "@/components/ui/delivery-time";
import { ShoppingBag, MapPin, Truck } from "lucide-react";
import { mockShops } from "@/lib/mock-data";

interface OrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
  estimatedDeliveryTime: number;
  deliveryAddress?: Address;
}

export function OrderSummary({
  items,
  totalAmount,
  estimatedDeliveryTime,
  deliveryAddress,
}: OrderSummaryProps) {
  const deliveryFee = 0; // Free delivery for now
  const finalTotal = totalAmount + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Get enhanced delivery estimate
  const { estimate, isLoading } = useCartDeliveryEstimate(
    items,
    mockShops,
    deliveryAddress
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary-500" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                <img
                  src={item.product.imageUrls[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-neutral-900 text-sm truncate">
                  {item.product.name}
                </h4>
                <p className="text-xs text-neutral-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium text-neutral-900">
                {formatCurrency(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2 pt-4 border-t border-neutral-200">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span className="text-neutral-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Delivery fee</span>
            <span className="text-green-600">
              {deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}
            </span>
          </div>

          <div className="flex justify-between text-base font-semibold pt-2 border-t border-neutral-200">
            <span className="text-neutral-900">Total</span>
            <span className="text-neutral-900">
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-neutral-300 border-t-neutral-600"></div>
              <span>Calculating delivery time...</span>
            </div>
          ) : estimate ? (
            <DeliveryTime
              estimate={estimate}
              variant="simple"
              showConfidence={true}
            />
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-600">Estimated delivery:</span>
              <span className="font-medium text-neutral-900">
                {estimatedDeliveryTime} min
              </span>
            </div>
          )}

          {deliveryAddress && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-neutral-500 mt-0.5" />
              <div className="text-neutral-600">
                <div className="font-medium text-neutral-900">Delivery to:</div>
                <div>
                  {deliveryAddress.street}
                  <br />
                  {deliveryAddress.city}, {deliveryAddress.postalCode}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Promise */}
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <Truck className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-green-900">
              Fresh Delivery Promise
            </div>
            <div className="text-green-700">
              Your flowers will be hand-picked and delivered fresh from our
              partner florists.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
