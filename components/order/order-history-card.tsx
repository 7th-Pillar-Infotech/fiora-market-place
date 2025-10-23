"use client";

import React, { useState } from "react";
import { Order, CartItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import {
  Clock,
  MapPin,
  Package,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface OrderHistoryCardProps {
  order: Order;
}

export function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addItem } = useCart();
  const [reorderLoading, setReorderLoading] = useState(false);

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const createdDate = new Date(order.createdAt);
  const estimatedDate = new Date(order.estimatedDeliveryTime);

  // Get status configuration
  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Confirmed",
          color: "bg-blue-100 text-blue-800",
          icon: CheckCircle,
          iconColor: "text-blue-600",
        };
      case "preparing":
        return {
          label: "Preparing",
          color: "bg-yellow-100 text-yellow-800",
          icon: Package,
          iconColor: "text-yellow-600",
        };
      case "out_for_delivery":
        return {
          label: "Out for Delivery",
          color: "bg-purple-100 text-purple-800",
          icon: Truck,
          iconColor: "text-purple-600",
        };
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          iconColor: "text-green-600",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          iconColor: "text-red-600",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-neutral-100 text-neutral-800",
          icon: AlertCircle,
          iconColor: "text-neutral-600",
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  // Handle reorder functionality
  const handleReorder = async () => {
    setReorderLoading(true);
    try {
      // Add all items from the order to cart
      for (const item of order.items) {
        addItem(item.product, item.quantity);
      }

      // Show success feedback (you could add a toast notification here)
      console.log("Items added to cart successfully");
    } catch (error) {
      console.error("Failed to reorder:", error);
    } finally {
      setReorderLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-neutral-900">
                Order #{order.id}
              </h3>
              <Badge className={statusConfig.color}>
                <StatusIcon
                  className={`h-3 w-3 mr-1 ${statusConfig.iconColor}`}
                />
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {createdDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="font-medium text-neutral-900">
                {formatCurrency(order.totalAmount)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReorder}
              disabled={reorderLoading}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {reorderLoading ? "Adding..." : "Reorder"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex items-center gap-2"
            >
              <Link href={`/orders/${order.id}`}>
                <Eye className="h-4 w-4" />
                Track
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Order Preview (always visible) */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div
                key={item.product.id}
                className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-neutral-100"
                style={{ zIndex: 3 - index }}
              >
                <img
                  src={item.product.imageUrls[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-10 h-10 rounded-lg bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-600">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-neutral-900 truncate">
              {order.items[0].product.name}
              {order.items.length > 1 && ` and ${order.items.length - 1} more`}
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-600">
              <MapPin className="h-3 w-3" />
              <span className="truncate">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            {/* All Items */}
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Order Items</h4>
              {order.items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-neutral-900 text-sm truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-xs text-neutral-600">
                      Qty: {item.quantity} •{" "}
                      {formatCurrency(item.product.price)} each
                    </p>
                  </div>
                  <div className="text-sm font-medium text-neutral-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-neutral-900">
                  Delivery Address
                </h4>
                <div className="text-sm text-neutral-600">
                  {order.deliveryAddress.street}
                  <br />
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.postalCode}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-neutral-900">Delivery Time</h4>
                <div className="text-sm text-neutral-600">
                  <div>
                    Estimated:{" "}
                    {estimatedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {estimatedDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {order.actualDeliveryTime && (
                    <div className="text-green-600">
                      Delivered:{" "}
                      {new Date(order.actualDeliveryTime).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}{" "}
                      at{" "}
                      {new Date(order.actualDeliveryTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-2">
              <h4 className="font-medium text-neutral-900">Payment</h4>
              <div className="text-sm text-neutral-600">
                {order.paymentMethod === "card" && "Credit/Debit Card"}
                {order.paymentMethod === "apple_pay" && "Apple Pay"}
                {order.paymentMethod === "google_pay" && "Google Pay"}
                {order.paymentMethod === "cash" && "Cash on Delivery"}
              </div>
            </div>

            {/* Delivery Instructions */}
            {order.deliveryInstructions && (
              <div className="space-y-2">
                <h4 className="font-medium text-neutral-900">
                  Delivery Instructions
                </h4>
                <div className="text-sm text-neutral-600 p-3 bg-neutral-50 rounded-lg">
                  {order.deliveryInstructions}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
