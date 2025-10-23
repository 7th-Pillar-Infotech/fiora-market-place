/**
 * Core TypeScript interfaces for the Fiora Customer Dashboard
 */

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  coordinates: { lat: number; lng: number };
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  estimatedDeliveryTime: number; // minutes
  distance: number; // kilometers
  imageUrl: string;
  isOpen: boolean;
  categories: string[];
  address: Address;
  phone: string;
  hours: {
    [key: string]: { open: string; close: string } | null;
  };
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  isAvailable: boolean;
  estimatedDeliveryTime: number; // minutes
  tags: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  shopId: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  status:
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  deliveryAddress: Address;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  courierLocation?: { lat: number; lng: number };
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: string;
  deliveryInstructions?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  defaultAddressId?: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    smsUpdates: boolean;
  };
}

export interface Recommendation {
  id: string;
  productId: string;
  reason: "popular" | "browsing_history" | "seasonal" | "similar_customers";
  score: number;
}

// Utility types for API responses and state management
export type OrderStatus = Order["status"];
export type ProductCategory =
  | "bouquets"
  | "arrangements"
  | "plants"
  | "gifts"
  | "seasonal";

// Filter and search types
export interface ShopFilters {
  rating?: number;
  maxDeliveryTime?: number;
  categories?: string[];
  isOpen?: boolean;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  tags?: string[];
}

export interface SearchParams {
  query?: string;
  sortBy?:
    | "relevance"
    | "price_asc"
    | "price_desc"
    | "rating"
    | "delivery_time";
  filters?: ShopFilters | ProductFilters;
}
