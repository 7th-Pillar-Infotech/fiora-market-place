"use client";

import React, { useState, useEffect } from "react";
import { Address } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, User, Phone, Mail, MessageSquare } from "lucide-react";
import { CheckoutData } from "./checkout-form";

interface AddressFormProps {
  onSubmit: (data: {
    deliveryAddress: Address;
    contactInfo: CheckoutData["contactInfo"];
    deliveryInstructions?: string;
  }) => void;
  initialData?: {
    deliveryAddress?: Address;
    contactInfo?: CheckoutData["contactInfo"];
    deliveryInstructions?: string;
  };
  errors?: Record<string, string>;
}

export function AddressForm({
  onSubmit,
  initialData,
  errors = {},
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    // Contact info
    name: initialData?.contactInfo?.name || "",
    email: initialData?.contactInfo?.email || "",
    phone: initialData?.contactInfo?.phone || "",
    // Address
    street: initialData?.deliveryAddress?.street || "",
    city: initialData?.deliveryAddress?.city || "Kyiv",
    postalCode: initialData?.deliveryAddress?.postalCode || "",
    // Additional
    deliveryInstructions: initialData?.deliveryInstructions || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load saved customer data on mount
  useEffect(() => {
    const savedCustomer = localStorage.getItem("fiora_customer");
    if (savedCustomer && !initialData?.contactInfo) {
      try {
        const customer = JSON.parse(savedCustomer);
        setFormData((prev) => ({
          ...prev,
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
        }));
      } catch (error) {
        console.warn("Failed to load saved customer data:", error);
      }
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Contact validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Address validation
    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Please enter a valid 5-digit postal code";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      return;
    }

    // Generate mock coordinates for Kyiv
    const generateKyivCoordinates = () => ({
      lat: 50.4501 + (Math.random() - 0.5) * 0.2,
      lng: 30.5234 + (Math.random() - 0.5) * 0.3,
    });

    const deliveryAddress: Address = {
      street: formData.street,
      city: formData.city,
      postalCode: formData.postalCode,
      coordinates: generateKyivCoordinates(),
    };

    const contactInfo: CheckoutData["contactInfo"] = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    // Save customer data for future use
    const customerData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      addresses: [deliveryAddress],
    };
    localStorage.setItem("fiora_customer", JSON.stringify(customerData));

    onSubmit({
      deliveryAddress,
      contactInfo,
      deliveryInstructions: formData.deliveryInstructions || undefined,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const isComplete = Boolean(
    formData.name &&
      formData.email &&
      formData.phone &&
      formData.street &&
      formData.city &&
      formData.postalCode &&
      Object.keys(formErrors).length === 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-500" />
          Delivery Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={formErrors.name || errors.name}
                required
                placeholder="Enter your full name"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={formErrors.phone || errors.phone}
                required
                placeholder="+380 XX XXX XXXX"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={formErrors.email || errors.email}
              required
              placeholder="your.email@example.com"
            />
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </h3>

            <Input
              label="Street Address"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              error={formErrors.street || errors.street}
              required
              placeholder="Street name and number"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                error={formErrors.city || errors.city}
                required
                placeholder="Kyiv"
              />

              <Input
                label="Postal Code"
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                error={formErrors.postalCode || errors.postalCode}
                required
                placeholder="01001"
                maxLength={5}
              />
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Delivery Instructions (Optional)
            </h3>

            <div className="space-y-2">
              <textarea
                value={formData.deliveryInstructions}
                onChange={(e) =>
                  handleInputChange("deliveryInstructions", e.target.value)
                }
                placeholder="Any special instructions for delivery (e.g., apartment number, gate code, preferred delivery time)"
                className="flex min-h-[80px] w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-neutral-500">
                {formData.deliveryInstructions.length}/500 characters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <Button
              type="submit"
              size="lg"
              disabled={!isComplete && isSubmitted}
              className="min-w-[200px]"
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
