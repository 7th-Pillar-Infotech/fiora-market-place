"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Shield,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PaymentFormProps {
  onSubmit: (data: {
    paymentMethod: string;
    cardData?: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardholderName: string;
    };
  }) => void;
  isProcessing: boolean;
  errors?: Record<string, string>;
  totalAmount: number;
}

type PaymentMethod = "card" | "apple_pay" | "google_pay" | "cash";

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  icon: React.ReactNode;
  description: string;
  requiresCardDetails: boolean;
}

const paymentMethods: PaymentMethodOption[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Visa, Mastercard, American Express",
    requiresCardDetails: true,
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Pay with Touch ID or Face ID",
    requiresCardDetails: false,
  },
  {
    id: "google_pay",
    name: "Google Pay",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Pay with your Google account",
    requiresCardDetails: false,
  },
  {
    id: "cash",
    name: "Cash on Delivery",
    icon: <Banknote className="h-5 w-5" />,
    description: "Pay when your order arrives",
    requiresCardDetails: false,
  },
];

export function PaymentForm({
  onSubmit,
  isProcessing,
  errors = {},
  totalAmount,
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const validateCardData = () => {
    if (selectedMethod !== "card") return true;

    const newErrors: Record<string, string> = {};

    if (!cardData.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!cardData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }

    if (!cardData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    setCardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCardData()) {
      return;
    }

    onSubmit({
      paymentMethod: selectedMethod,
      cardData: selectedMethod === "card" ? cardData : undefined,
    });
  };

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19); // 16 digits + 3 spaces

    setCardData((prev) => ({ ...prev, cardNumber: formatted }));

    if (cardErrors.cardNumber) {
      setCardErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const handleExpiryDateChange = (value: string) => {
    // Format expiry date as MM/YY
    let formatted = value.replace(/\D/g, "");
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
    }

    setCardData((prev) => ({ ...prev, expiryDate: formatted }));

    if (cardErrors.expiryDate) {
      setCardErrors((prev) => ({ ...prev, expiryDate: "" }));
    }
  };

  const handleCvvChange = (value: string) => {
    const formatted = value.replace(/\D/g, "").slice(0, 4);
    setCardData((prev) => ({ ...prev, cvv: formatted }));

    if (cardErrors.cvv) {
      setCardErrors((prev) => ({ ...prev, cvv: "" }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-500" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) =>
                    setSelectedMethod(e.target.value as PaymentMethod)
                  }
                  className="sr-only"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedMethod === method.id
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">
                      {method.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {method.description}
                    </div>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="h-5 w-5 text-primary-500" />
                )}
              </label>
            ))}
          </div>

          {/* Card Details Form */}
          {selectedMethod === "card" && (
            <div className="space-y-4 p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-900">Card Details</h3>

              <Input
                label="Cardholder Name"
                value={cardData.cardholderName}
                onChange={(e) => {
                  setCardData((prev) => ({
                    ...prev,
                    cardholderName: e.target.value,
                  }));
                  if (cardErrors.cardholderName) {
                    setCardErrors((prev) => ({ ...prev, cardholderName: "" }));
                  }
                }}
                error={cardErrors.cardholderName}
                placeholder="John Doe"
                required
              />

              <Input
                label="Card Number"
                value={cardData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                error={cardErrors.cardNumber}
                placeholder="1234 5678 9012 3456"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  value={cardData.expiryDate}
                  onChange={(e) => handleExpiryDateChange(e.target.value)}
                  error={cardErrors.expiryDate}
                  placeholder="MM/YY"
                  required
                />

                <Input
                  label="CVV"
                  value={cardData.cvv}
                  onChange={(e) => handleCvvChange(e.target.value)}
                  error={cardErrors.cvv}
                  placeholder="123"
                  required
                />
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-green-900">Secure Payment</div>
              <div className="text-green-700">
                Your payment information is encrypted and secure. We never store
                your card details.
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors.payment && (
            <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-700">{errors.payment}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <Button
              type="submit"
              size="lg"
              disabled={isProcessing}
              className="min-w-[200px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>Complete Order • {formatCurrency(totalAmount)}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
