"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "./checkout-form";
import { OrderConfirmation } from "./order-confirmation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export type CheckoutStep = "form" | "confirmation";

export function CheckoutPage() {
  const { state: cartState } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("form");
  const [orderId, setOrderId] = useState<string | null>(null);

  // Redirect if cart is empty
  if (cartState.items.length === 0 && currentStep === "form") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <ShoppingCart className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-neutral-600">
              Add some beautiful flowers to your cart before checking out.
            </p>
          </div>
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const handleOrderComplete = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentStep("confirmation");
  };

  const handleBackToShopping = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                {currentStep === "form" ? "Checkout" : "Order Confirmed"}
              </h1>
              {currentStep === "form" && (
                <p className="text-neutral-600 mt-1">
                  Complete your order in just a few steps
                </p>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          {currentStep === "form" && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <span>Delivery & Payment</span>
              </div>
              <div className="w-8 h-px bg-neutral-300" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <span>Confirmation</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {currentStep === "form" && (
          <CheckoutForm onOrderComplete={handleOrderComplete} />
        )}

        {currentStep === "confirmation" && orderId && (
          <OrderConfirmation
            orderId={orderId}
            onBackToShopping={handleBackToShopping}
          />
        )}
      </div>
    </div>
  );
}
