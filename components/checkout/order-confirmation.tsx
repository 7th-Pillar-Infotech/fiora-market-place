"use client";

import React, { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orderUtils, formatCurrency, formatDeliveryTime } from "@/lib/utils";
import {
  CheckCircle,
  Package,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

interface OrderConfirmationProps {
  orderId: string;
  onBackToShopping: () => void;
}

export function OrderConfirmation({
  orderId,
  onBackToShopping,
}: OrderConfirmationProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const orders = orderUtils.getOrders();
    const foundOrder = orders.find((o) => o.id === orderId);
    setOrder(foundOrder || null);
  }, [orderId]);

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("Failed to copy order ID:", error);
    }
  };

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600">Order not found</p>
        <Button onClick={onBackToShopping} className="mt-4">
          Back to Shopping
        </Button>
      </div>
    );
  }

  const estimatedDeliveryDate = new Date(order.estimatedDeliveryTime);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-neutral-600 max-w-md mx-auto">
          Thank you for your order. We've received your payment and your flowers
          are being prepared for delivery.
        </p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-500" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order ID */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <div className="text-sm text-neutral-600">Order ID</div>
                <div className="font-mono text-sm font-medium text-neutral-900">
                  {orderId}
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

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">
                Items ({itemCount})
              </h4>
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

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
              <span className="font-medium text-neutral-900">Total Paid</span>
              <span className="text-lg font-bold text-neutral-900">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-500" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estimated Delivery */}
            <div className="p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-900">
                  Estimated Delivery
                </span>
              </div>
              <div className="text-primary-900">
                {estimatedDeliveryDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-sm text-primary-700">
                {estimatedDeliveryDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-900">
                  Delivery Address
                </span>
              </div>
              <div className="text-sm text-neutral-600 ml-6">
                {order.deliveryAddress.street}
                <br />
                {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
              </div>
            </div>

            {/* Delivery Instructions */}
            {order.deliveryInstructions && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-neutral-900">
                  Delivery Instructions
                </div>
                <div className="text-sm text-neutral-600 p-3 bg-neutral-50 rounded-lg">
                  {order.deliveryInstructions}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-neutral-900">
                Payment Method
              </div>
              <div className="text-sm text-neutral-600">
                {order.paymentMethod === "card" && "Credit/Debit Card"}
                {order.paymentMethod === "apple_pay" && "Apple Pay"}
                {order.paymentMethod === "google_pay" && "Google Pay"}
                {order.paymentMethod === "cash" && "Cash on Delivery"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">
                Order Preparation
              </h3>
              <p className="text-sm text-neutral-600">
                Our florists are carefully preparing your fresh flowers
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">
                Quality Check
              </h3>
              <p className="text-sm text-neutral-600">
                We ensure every flower meets our quality standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Delivery</h3>
              <p className="text-sm text-neutral-600">
                Your flowers will be delivered fresh to your door
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-medium text-neutral-900">
              Need help with your order?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => window.open(`/orders/${orderId}`, "_blank")}
          className="flex items-center gap-2"
        >
          Track Order
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button onClick={onBackToShopping} className="flex items-center gap-2">
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
