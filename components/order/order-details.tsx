"use client";

import React, { useState } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import {
  Package,
  MapPin,
  CreditCard,
  FileText,
  Phone,
  Mail,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const { addItem } = useCart();
  const [reorderLoading, setReorderLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const createdDate = new Date(order.createdAt);

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

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("Failed to copy order ID:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-500" />
              Order Items ({itemCount})
            </CardTitle>
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items List */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
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
                  <p className="text-xs text-neutral-600 mt-1">
                    Qty: {item.quantity} • {formatCurrency(item.product.price)}{" "}
                    each
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-neutral-100 rounded text-neutral-600">
                      {item.product.category}
                    </span>
                    {item.product.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-primary-50 rounded text-primary-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-neutral-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span className="text-neutral-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Delivery fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-neutral-200">
                <span className="text-neutral-900">Total Paid</span>
                <span className="text-neutral-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Information */}
      <div className="space-y-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-500" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order ID */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <div className="text-sm text-neutral-600">Order ID</div>
                <div className="font-mono text-sm font-medium text-neutral-900">
                  {order.id}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyOrderId}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Order Date */}
            <div className="space-y-1">
              <div className="text-sm text-neutral-600">Order Date</div>
              <div className="text-sm font-medium text-neutral-900">
                {createdDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {createdDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-1">
              <div className="text-sm text-neutral-600">Payment Method</div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-900">
                  {order.paymentMethod === "card" && "Credit/Debit Card"}
                  {order.paymentMethod === "apple_pay" && "Apple Pay"}
                  {order.paymentMethod === "google_pay" && "Google Pay"}
                  {order.paymentMethod === "cash" && "Cash on Delivery"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-500" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Delivery Address */}
            <div className="space-y-1">
              <div className="text-sm text-neutral-600">Delivery Address</div>
              <div className="text-sm font-medium text-neutral-900">
                {order.deliveryAddress.street}
                <br />
                {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
              </div>
            </div>

            {/* Delivery Instructions */}
            {order.deliveryInstructions && (
              <div className="space-y-1">
                <div className="text-sm text-neutral-600">
                  Delivery Instructions
                </div>
                <div className="text-sm text-neutral-900 p-3 bg-neutral-50 rounded-lg">
                  {order.deliveryInstructions}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-neutral-600">
                If you have any questions about your order, our customer support
                team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Phone className="h-4 w-4" />
                  <span>+380 44 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Mail className="h-4 w-4" />
                  <span>support@fiora.ua</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
