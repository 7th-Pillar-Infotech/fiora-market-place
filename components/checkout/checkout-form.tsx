"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Address, Order } from "@/lib/types";
import { AddressForm } from "./address-form";
import { PaymentForm } from "./payment-form";
import { OrderSummary } from "./order-summary";
import { generateId, orderUtils } from "@/lib/utils";
import {
  processPayment,
  validatePaymentAmount,
  PaymentRequest,
} from "@/lib/payment-service";

interface CheckoutFormProps {
  onOrderComplete: (orderId: string) => void;
}

export interface CheckoutData {
  deliveryAddress: Address;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryInstructions?: string;
  paymentMethod: string;
}

export function CheckoutForm({ onOrderComplete }: CheckoutFormProps) {
  const { state: cartState, clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState<Partial<CheckoutData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddressSubmit = (addressData: {
    deliveryAddress: Address;
    contactInfo: CheckoutData["contactInfo"];
    deliveryInstructions?: string;
  }) => {
    setCheckoutData((prev) => ({
      ...prev,
      ...addressData,
    }));
    setErrors({});
  };

  const handlePaymentSubmit = async (paymentData: {
    paymentMethod: string;
    cardData?: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardholderName: string;
    };
  }) => {
    setIsProcessing(true);
    setErrors({});

    try {
      // Validate all required data
      if (
        !checkoutData.deliveryAddress ||
        !checkoutData.contactInfo ||
        !paymentData.paymentMethod
      ) {
        throw new Error("Missing required checkout information");
      }

      // Validate payment amount
      const amountValidationError = validatePaymentAmount(
        cartState.totalAmount
      );
      if (amountValidationError) {
        throw new Error(amountValidationError);
      }

      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        amount: cartState.totalAmount,
        paymentMethod: paymentData.paymentMethod,
        cardData: paymentData.cardData,
        customerInfo: checkoutData.contactInfo,
      };

      // Process payment
      const paymentResponse = await processPayment(paymentRequest);

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || "Payment processing failed");
      }

      // Create order
      const orderId = `order-${generateId()}`;
      const order: Order = {
        id: orderId,
        customerId: "customer-1", // Mock customer ID
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        status: "confirmed",
        deliveryAddress: checkoutData.deliveryAddress,
        estimatedDeliveryTime: new Date(
          Date.now() + cartState.estimatedDeliveryTime * 60 * 1000
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentMethod: paymentData.paymentMethod,
        deliveryInstructions: checkoutData.deliveryInstructions,
      };

      // Save order
      orderUtils.addOrder(order);

      // Clear cart
      clearCart();

      // Complete checkout
      onOrderComplete(orderId);
    } catch (error) {
      setErrors({
        payment: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isAddressComplete = Boolean(
    checkoutData.deliveryAddress && checkoutData.contactInfo
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-8">
        {/* Address Section */}
        <AddressForm
          onSubmit={handleAddressSubmit}
          initialData={{
            deliveryAddress: checkoutData.deliveryAddress,
            contactInfo: checkoutData.contactInfo,
            deliveryInstructions: checkoutData.deliveryInstructions,
          }}
          errors={errors}
        />

        {/* Payment Section */}
        {isAddressComplete && (
          <PaymentForm
            onSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
            errors={errors}
            totalAmount={cartState.totalAmount}
          />
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <OrderSummary
            items={cartState.items}
            totalAmount={cartState.totalAmount}
            estimatedDeliveryTime={cartState.estimatedDeliveryTime}
            deliveryAddress={checkoutData.deliveryAddress}
          />
        </div>
      </div>
    </div>
  );
}
