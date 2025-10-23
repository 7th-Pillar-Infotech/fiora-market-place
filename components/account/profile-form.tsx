"use client";

import * as React from "react";
import { User, Mail, Phone, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCustomer, saveToStorage, loadFromStorage } from "@/lib/mock-data";
import type { Customer } from "@/lib/types";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function ProfileForm() {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  // Load customer data on mount
  React.useEffect(() => {
    const savedCustomer = loadFromStorage<Customer>(
      "fiora_customer",
      mockCustomer
    );
    setFormData({
      name: savedCustomer.name,
      email: savedCustomer.email,
      phone: savedCustomer.phone,
    });
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\+380\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone =
        "Please enter a valid Ukrainian phone number (+380XXXXXXXXX)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear saved state when user makes changes
    if (isSaved) {
      setIsSaved(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      const currentCustomer = loadFromStorage<Customer>(
        "fiora_customer",
        mockCustomer
      );
      const updatedCustomer: Customer = {
        ...currentCustomer,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      saveToStorage("fiora_customer", updatedCustomer);
      setIsSaved(true);

      // Clear saved state after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Profile Information
        </h2>
        <p className="text-neutral-600">
          Update your personal information and contact details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-neutral-700"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-neutral-700"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email}
            </div>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-neutral-700"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
              placeholder="+380501234567"
            />
          </div>
          {errors.phone && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.phone}
            </div>
          )}
          <p className="text-xs text-neutral-500">
            Ukrainian phone number format: +380XXXXXXXXX
          </p>
        </div>

        {/* Account Status */}
        <Card className="p-4 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-900">Account Status</h3>
              <p className="text-sm text-neutral-600">
                Your account is active and verified
              </p>
            </div>
            <Badge variant="success">Verified</Badge>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            {isSaved && (
              <div className="flex items-center text-sm text-green-600">
                <Save className="h-4 w-4 mr-1" />
                Profile saved successfully
              </div>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
