"use client";

import * as React from "react";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Star,
  AlertCircle,
  Home,
  Building,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadFromStorage, saveToStorage } from "@/lib/mock-data";
import type { Address } from "@/lib/types";

interface ExtendedAddress extends Address {
  id: string;
  label: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
}

interface AddressFormData {
  label: string;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  postalCode: string;
}

interface AddressFormErrors {
  label?: string;
  type?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}

export function AddressBook() {
  const [addresses, setAddresses] = React.useState<ExtendedAddress[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] =
    React.useState<ExtendedAddress | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<AddressFormData>({
    label: "",
    type: "home",
    street: "",
    city: "Kyiv",
    postalCode: "",
  });
  const [errors, setErrors] = React.useState<AddressFormErrors>({});

  // Load addresses on mount
  React.useEffect(() => {
    const savedAddresses = loadFromStorage<ExtendedAddress[]>(
      "fiora_addresses",
      []
    );
    if (savedAddresses.length === 0) {
      // Initialize with mock data if no saved addresses
      const mockAddresses: ExtendedAddress[] = [
        {
          id: "addr-1",
          label: "Home",
          type: "home",
          street: "15 Khreshchatyk Street",
          city: "Kyiv",
          postalCode: "01001",
          coordinates: { lat: 50.4501, lng: 30.5234 },
          isDefault: true,
        },
        {
          id: "addr-2",
          label: "Office",
          type: "work",
          street: "42 Velyka Vasylkivska Street",
          city: "Kyiv",
          postalCode: "03150",
          coordinates: { lat: 50.4021, lng: 30.524 },
          isDefault: false,
        },
      ];
      setAddresses(mockAddresses);
      saveToStorage("fiora_addresses", mockAddresses);
    } else {
      setAddresses(savedAddresses);
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: AddressFormErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = "Address label is required";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    } else if (formData.street.trim().length < 5) {
      newErrors.street = "Street address must be at least 5 characters";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    const postalCodeRegex = /^\d{5}$/;
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!postalCodeRegex.test(formData.postalCode)) {
      newErrors.postalCode = "Postal code must be 5 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCoordinates = (
    street: string
  ): { lat: number; lng: number } => {
    // Simple mock coordinate generation based on street hash
    const hash = street.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const latOffset = (Math.abs(hash) % 1000) / 10000; // 0-0.1 degree offset
    const lngOffset = (Math.abs(hash * 2) % 1000) / 10000;

    return {
      lat: 50.4501 + (latOffset - 0.05), // Kyiv center ± 0.05 degrees
      lng: 30.5234 + (lngOffset - 0.05),
    };
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      label: "",
      type: "home",
      street: "",
      city: "Kyiv",
      postalCode: "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (address: ExtendedAddress) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      type: address.type,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const coordinates = generateCoordinates(formData.street);

      if (editingAddress) {
        // Update existing address
        const updatedAddresses = addresses.map((addr) =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                label: formData.label.trim(),
                type: formData.type,
                street: formData.street.trim(),
                city: formData.city.trim(),
                postalCode: formData.postalCode.trim(),
                coordinates,
              }
            : addr
        );
        setAddresses(updatedAddresses);
        saveToStorage("fiora_addresses", updatedAddresses);
      } else {
        // Add new address
        const newAddress: ExtendedAddress = {
          id: `addr-${Date.now()}`,
          label: formData.label.trim(),
          type: formData.type,
          street: formData.street.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          coordinates,
          isDefault: addresses.length === 0, // First address is default
        };
        const updatedAddresses = [...addresses, newAddress];
        setAddresses(updatedAddresses);
        saveToStorage("fiora_addresses", updatedAddresses);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    const addressToDelete = addresses.find((addr) => addr.id === addressId);
    if (!addressToDelete) return;

    const updatedAddresses = addresses.filter((addr) => addr.id !== addressId);

    // If we are deleting the default address and there are other addresses, make the first one default
    if (addressToDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    setAddresses(updatedAddresses);
    saveToStorage("fiora_addresses", updatedAddresses);
  };

  const handleSetDefault = async (addressId: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);
    saveToStorage("fiora_addresses", updatedAddresses);
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Briefcase;
      default:
        return Building;
    }
  };

  const addressTypeOptions = [
    { value: "home", label: "Home" },
    { value: "work", label: "Work" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
            Address Book
          </h2>
          <p className="text-neutral-600">
            Manage your delivery addresses for faster checkout
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="p-8 text-center">
          <MapPin className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No addresses saved
          </h3>
          <p className="text-neutral-600 mb-4">
            Add your first delivery address to get started
          </p>
          <Button onClick={openAddModal}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const TypeIcon = getAddressTypeIcon(address.type);
            return (
              <Card key={address.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TypeIcon className="h-4 w-4 text-neutral-500" />
                    <h3 className="font-medium text-neutral-900">
                      {address.label}
                    </h3>
                    {address.isDefault && (
                      <Badge variant="default" size="sm">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(address)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(address.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-neutral-600 mb-3">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.postalCode}
                  </p>
                </div>

                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="w-full"
                  >
                    Set as Default
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Label */}
          <div className="space-y-2">
            <label
              htmlFor="label"
              className="text-sm font-medium text-neutral-700"
            >
              Address Label
            </label>
            <Input
              id="label"
              type="text"
              value={formData.label}
              onChange={(e) => handleInputChange("label", e.target.value)}
              className={errors.label ? "border-red-500" : ""}
              placeholder="e.g., Home, Office, Mom's House"
            />
            {errors.label && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.label}
              </div>
            )}
          </div>

          {/* Address Type */}
          <div className="space-y-2">
            <label
              htmlFor="type"
              className="text-sm font-medium text-neutral-700"
            >
              Address Type
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                handleInputChange("type", value as "home" | "work" | "other")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                {addressTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <label
              htmlFor="street"
              className="text-sm font-medium text-neutral-700"
            >
              Street Address
            </label>
            <Input
              id="street"
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              className={errors.street ? "border-red-500" : ""}
              placeholder="e.g., 15 Khreshchatyk Street, Apt 4B"
            />
            {errors.street && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.street}
              </div>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="text-sm font-medium text-neutral-700"
            >
              City
            </label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={errors.city ? "border-red-500" : ""}
              placeholder="Kyiv"
            />
            {errors.city && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.city}
              </div>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <label
              htmlFor="postalCode"
              className="text-sm font-medium text-neutral-700"
            >
              Postal Code
            </label>
            <Input
              id="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className={errors.postalCode ? "border-red-500" : ""}
              placeholder="01001"
              maxLength={5}
            />
            {errors.postalCode && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.postalCode}
              </div>
            )}
          </div>

          {/* Map Integration Note */}
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-900 font-medium">Address Validation</p>
                <p className="text-blue-800">
                  We&apos;ll validate this address and show it on the map during
                  checkout.
                </p>
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingAddress ? "Update" : "Add"} Address
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
