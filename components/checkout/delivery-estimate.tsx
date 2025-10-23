"use client";

import React from "react";
import { CartItem, Address } from "@/lib/types";
import { useCartDeliveryEstimate } from "@/hooks/use-delivery-estimation";
import { DeliveryTime } from "@/components/ui/delivery-time";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, AlertTriangle } from "lucide-react";
import { mockShops } from "@/lib/mock-data";

interface DeliveryEstimateProps {
  cartItems: CartItem[];
  deliveryAddress?: Address;
  className?: string;
}

export function DeliveryEstimate({
  cartItems,
  deliveryAddress,
  className = "",
}: DeliveryEstimateProps) {
  const { estimate, isLoading } = useCartDeliveryEstimate(
    cartItems,
    mockShops,
    deliveryAddress
  );

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-neutral-900">
              Delivery Estimate
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-300 border-t-primary-600"></div>
              <div>
                <p className="text-sm text-neutral-600">
                  Calculating delivery time...
                </p>
                <p className="text-xs text-neutral-500">
                  Considering current traffic and shop preparation time
                </p>
              </div>
            </div>
          ) : estimate ? (
            <div className="space-y-4">
              <DeliveryTime
                estimate={estimate}
                variant="detailed"
                showConfidence={true}
                showFactors={true}
              />

              {/* Delivery Address */}
              {deliveryAddress && (
                <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-neutral-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-neutral-900">Delivery to:</p>
                    <p className="text-neutral-600">
                      {deliveryAddress.street}, {deliveryAddress.city}
                    </p>
                  </div>
                </div>
              )}

              {/* Multiple Shops Warning */}
              {(() => {
                const uniqueShops = new Set(
                  cartItems.map((item) => item.shopId)
                );
                if (uniqueShops.size > 1) {
                  return (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800">
                          Multiple Shop Order
                        </p>
                        <p className="text-amber-700">
                          Your order contains items from {uniqueShops.size}{" "}
                          different shops. Delivery time may be longer due to
                          coordination requirements.
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Estimated Arrival Time */}
              <div className="border-t border-neutral-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">
                    Estimated arrival:
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {estimate.estimatedDeliveryTime.toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-neutral-600">
                    Today,{" "}
                    {estimate.estimatedDeliveryTime.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-neutral-500">
              <p className="text-sm">Unable to calculate delivery time</p>
              <p className="text-xs">Please try again or contact support</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
