/**
 * Utility functions for the Fiora Customer Dashboard
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem, Customer, Order, Product, Shop } from "./types";

/**
 * Combine CSS classes with Tailwind CSS class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * localStorage utility functions with error handling
 */
export const storage = {
  /**
   * Get item from localStorage with JSON parsing
   */
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage with JSON stringification
   */
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage data
   */
  clear(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.clear();
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
    }
  },
};

/**
 * localStorage keys for the application
 */
export const STORAGE_KEYS = {
  CART: "fiora_cart",
  CUSTOMER: "fiora_customer",
  BROWSING_HISTORY: "fiora_browsing_history",
  PREFERENCES: "fiora_preferences",
  ORDERS: "fiora_orders",
  ADDRESSES: "fiora_addresses",
} as const;

/**
 * Cart management utilities
 */
export const cartUtils = {
  /**
   * Get cart items from localStorage
   */
  getCart(): CartItem[] {
    return storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  /**
   * Save cart items to localStorage
   */
  saveCart(items: CartItem[]): void {
    storage.set(STORAGE_KEYS.CART, items);
  },

  /**
   * Add item to cart
   */
  addToCart(product: Product, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        product,
        quantity,
        shopId: product.shopId,
      });
    }

    this.saveCart(cart);
    return cart;
  },

  /**
   * Remove item from cart
   */
  removeFromCart(productId: string): CartItem[] {
    const cart = this.getCart().filter((item) => item.product.id !== productId);
    this.saveCart(cart);
    return cart;
  },

  /**
   * Update item quantity in cart
   */
  updateQuantity(productId: string, quantity: number): CartItem[] {
    const cart = this.getCart();
    const itemIndex = cart.findIndex((item) => item.product.id === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }

    this.saveCart(cart);
    return cart;
  },

  /**
   * Clear entire cart
   */
  clearCart(): void {
    storage.remove(STORAGE_KEYS.CART);
  },

  /**
   * Calculate cart total
   */
  calculateTotal(cart: CartItem[]): number {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  /**
   * Get cart item count
   */
  getItemCount(cart: CartItem[]): number {
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
};

/**
 * Browsing history utilities
 */
export const historyUtils = {
  /**
   * Get browsing history
   */
  getHistory(): string[] {
    return storage.get<string[]>(STORAGE_KEYS.BROWSING_HISTORY, []);
  },

  /**
   * Add product to browsing history
   */
  addToHistory(productId: string): void {
    const history = this.getHistory();
    const filteredHistory = history.filter((id) => id !== productId);
    const newHistory = [productId, ...filteredHistory].slice(0, 50); // Keep last 50 items
    storage.set(STORAGE_KEYS.BROWSING_HISTORY, newHistory);
  },

  /**
   * Clear browsing history
   */
  clearHistory(): void {
    storage.remove(STORAGE_KEYS.BROWSING_HISTORY);
  },
};

/**
 * Customer data utilities
 */
export const customerUtils = {
  /**
   * Get customer data
   */
  getCustomer(): Customer | null {
    return storage.get<Customer | null>(STORAGE_KEYS.CUSTOMER, null);
  },

  /**
   * Save customer data
   */
  saveCustomer(customer: Customer): void {
    storage.set(STORAGE_KEYS.CUSTOMER, customer);
  },

  /**
   * Update customer preferences
   */
  updatePreferences(preferences: Partial<Customer["preferences"]>): void {
    const customer = this.getCustomer();
    if (customer) {
      customer.preferences = { ...customer.preferences, ...preferences };
      this.saveCustomer(customer);
    }
  },
};

/**
 * Order utilities
 */
export const orderUtils = {
  /**
   * Get orders from localStorage
   */
  getOrders(): Order[] {
    return storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  /**
   * Save orders to localStorage
   */
  saveOrders(orders: Order[]): void {
    storage.set(STORAGE_KEYS.ORDERS, orders);
  },

  /**
   * Add new order
   */
  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order); // Add to beginning
    this.saveOrders(orders);
  },

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: Order["status"]): void {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    if (orderIndex >= 0) {
      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date();
      this.saveOrders(orders);
    }
  },
};

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format delivery time
 */
export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Format distance
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if shop is currently open
 */
export function isShopOpen(shop: Shop): boolean {
  const now = new Date();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayName = dayNames[now.getDay()];

  const hours = shop.hours[dayName];
  if (!hours) return false;

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = hours.open.split(":").map(Number);
  const [closeHour, closeMin] = hours.close.split(":").map(Number);

  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  return currentTime >= openTime && currentTime <= closeTime;
}

/**
 * Calculate estimated delivery time based on current time and shop preparation time
 */
export function calculateDeliveryEstimate(baseDeliveryTime: number): Date {
  const now = new Date();
  const deliveryTime = new Date(now.getTime() + baseDeliveryTime * 60 * 1000);
  return deliveryTime;
}

/**
 * Filter and search utilities
 */
export const searchUtils = {
  /**
   * Filter shops based on criteria
   */
  filterShops(
    shops: Shop[],
    filters: {
      query?: string;
      rating?: number;
      maxDeliveryTime?: number;
      categories?: string[];
      isOpen?: boolean;
    }
  ): Shop[] {
    return shops.filter((shop) => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (
          !shop.name.toLowerCase().includes(query) &&
          !shop.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (filters.rating && shop.rating < filters.rating) return false;
      if (
        filters.maxDeliveryTime &&
        shop.estimatedDeliveryTime > filters.maxDeliveryTime
      )
        return false;
      if (
        filters.categories &&
        !filters.categories.some((cat) => shop.categories.includes(cat))
      )
        return false;
      if (filters.isOpen !== undefined && isShopOpen(shop) !== filters.isOpen)
        return false;

      return true;
    });
  },

  /**
   * Filter products based on criteria
   */
  filterProducts(
    products: Product[],
    filters: {
      query?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      isAvailable?: boolean;
    }
  ): Product[] {
    return products.filter((product) => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (
          !product.name.toLowerCase().includes(query) &&
          !product.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (filters.category && product.category !== filters.category)
        return false;
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      if (
        filters.isAvailable !== undefined &&
        product.isAvailable !== filters.isAvailable
      )
        return false;

      return true;
    });
  },

  /**
   * Sort shops by various criteria
   */
  sortShops(shops: Shop[], sortBy: string): Shop[] {
    const sorted = [...shops];

    switch (sortBy) {
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "delivery_time":
        return sorted.sort(
          (a, b) => a.estimatedDeliveryTime - b.estimatedDeliveryTime
        );
      case "distance":
        return sorted.sort((a, b) => a.distance - b.distance);
      case "reviews":
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  },

  /**
   * Sort products by various criteria
   */
  sortProducts(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];

    switch (sortBy) {
      case "price_asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price_desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "delivery_time":
        return sorted.sort(
          (a, b) => a.estimatedDeliveryTime - b.estimatedDeliveryTime
        );
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "availability":
        return sorted.sort(
          (a, b) => (b.isAvailable ? 1 : 0) - (a.isAvailable ? 1 : 0)
        );
      default:
        return sorted;
    }
  },
};

/**
 * Mock API simulation utilities with loading states
 */
export interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export const apiUtils = {
  /**
   * Simulate API call with loading states and potential errors
   */
  simulateApiCall<T>(
    data: T,
    delay: number = 800,
    errorRate: number = 0.05
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < errorRate) {
          reject(new Error("Network error: Failed to fetch data"));
        } else {
          resolve(data);
        }
      }, delay + Math.random() * 400); // Add some randomness to delay
    });
  },

  /**
   * Create loading state for API calls
   */
  createLoadingState<T>(initialData: T): ApiResponse<T> {
    return {
      data: initialData,
      loading: true,
      error: null,
    };
  },

  /**
   * Create success state for API calls
   */
  createSuccessState<T>(data: T): ApiResponse<T> {
    return {
      data,
      loading: false,
      error: null,
    };
  },

  /**
   * Create error state for API calls
   */
  createErrorState<T>(error: string, fallbackData: T): ApiResponse<T> {
    return {
      data: fallbackData,
      loading: false,
      error,
    };
  },
};

/**
 * User preferences management utilities
 */
export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  smsUpdates: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  currency: string;
  defaultAddress?: string;
  favoriteShops: string[];
  recentSearches: string[];
  maxDeliveryTime?: number;
  priceRange?: { min: number; max: number };
}

export const preferencesUtils = {
  /**
   * Get user preferences with defaults
   */
  getPreferences(): UserPreferences {
    return storage.get<UserPreferences>(STORAGE_KEYS.PREFERENCES, {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
      theme: "system",
      language: "uk",
      currency: "UAH",
      favoriteShops: [],
      recentSearches: [],
    });
  },

  /**
   * Save user preferences
   */
  savePreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    storage.set(STORAGE_KEYS.PREFERENCES, updated);
  },

  /**
   * Add shop to favorites
   */
  addFavoriteShop(shopId: string): void {
    const prefs = this.getPreferences();
    if (!prefs.favoriteShops.includes(shopId)) {
      prefs.favoriteShops.push(shopId);
      this.savePreferences(prefs);
    }
  },

  /**
   * Remove shop from favorites
   */
  removeFavoriteShop(shopId: string): void {
    const prefs = this.getPreferences();
    prefs.favoriteShops = prefs.favoriteShops.filter((id) => id !== shopId);
    this.savePreferences(prefs);
  },

  /**
   * Add search term to recent searches
   */
  addRecentSearch(query: string): void {
    const prefs = this.getPreferences();
    const filtered = prefs.recentSearches.filter((q) => q !== query);
    prefs.recentSearches = [query, ...filtered].slice(0, 10); // Keep last 10 searches
    this.savePreferences(prefs);
  },

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    const prefs = this.getPreferences();
    prefs.recentSearches = [];
    this.savePreferences(prefs);
  },
};
