/**
 * Application constants for the Fiora Customer Dashboard
 */

// Application metadata
export const APP_CONFIG = {
  name: "Fiora",
  description: "Hyper-local flower marketplace in Kyiv",
  version: "1.0.0",
  author: "Fiora Team",
  url: "https://fiora.ua",
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  shops: "/api/shops",
  products: "/api/products",
  orders: "/api/orders",
  customers: "/api/customers",
  recommendations: "/api/recommendations",
} as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  { id: "bouquets", name: "Bouquets", icon: "💐" },
  { id: "arrangements", name: "Arrangements", icon: "🌸" },
  { id: "plants", name: "Plants", icon: "🪴" },
  { id: "gifts", name: "Gifts", icon: "🎁" },
  { id: "seasonal", name: "Seasonal", icon: "🌺" },
] as const;

// Order statuses with display information
export const ORDER_STATUSES = {
  confirmed: {
    label: "Confirmed",
    color: "info",
    icon: "✓",
    description: "Your order has been confirmed",
  },
  preparing: {
    label: "Preparing",
    color: "warning",
    icon: "👨‍🍳",
    description: "Your order is being prepared",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "primary",
    icon: "🚚",
    description: "Your order is on the way",
  },
  delivered: {
    label: "Delivered",
    color: "success",
    icon: "📦",
    description: "Your order has been delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "error",
    icon: "❌",
    description: "Your order has been cancelled",
  },
} as const;

// Delivery time ranges
export const DELIVERY_TIME_RANGES = [
  { label: "Under 30 min", value: 30 },
  { label: "Under 1 hour", value: 60 },
  { label: "Under 2 hours", value: 120 },
  { label: "Same day", value: 480 },
] as const;

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: "Under ₴200", min: 0, max: 200 },
  { label: "₴200 - ₴500", min: 200, max: 500 },
  { label: "₴500 - ₴1000", min: 500, max: 1000 },
  { label: "Over ₴1000", min: 1000, max: Infinity },
] as const;

// Rating options
export const RATING_OPTIONS = [
  { label: "4+ stars", value: 4 },
  { label: "3+ stars", value: 3 },
  { label: "2+ stars", value: 2 },
  { label: "1+ stars", value: 1 },
] as const;

// Sort options for shops
export const SHOP_SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Rating", value: "rating" },
  { label: "Delivery Time", value: "delivery_time" },
  { label: "Distance", value: "distance" },
] as const;

// Sort options for products
export const PRODUCT_SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popularity", value: "popularity" },
  { label: "Delivery Time", value: "delivery_time" },
] as const;

// Pagination settings
export const PAGINATION = {
  shopsPerPage: 12,
  productsPerPage: 20,
  ordersPerPage: 10,
  reviewsPerPage: 5,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Map configuration
export const MAP_CONFIG = {
  defaultCenter: { lat: 50.4501, lng: 30.5234 }, // Kyiv center
  defaultZoom: 12,
  maxZoom: 18,
  minZoom: 10,
} as const;

// Form validation rules
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 50,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    pattern: /^\+380\d{9}$/,
  },
  address: {
    minLength: 5,
    maxLength: 100,
  },
  postalCode: {
    pattern: /^\d{5}$/,
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  required: "This field is required",
  invalidEmail: "Please enter a valid email address",
  invalidPhone: "Please enter a valid phone number (+380XXXXXXXXX)",
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  networkError: "Network error. Please try again.",
  serverError: "Server error. Please try again later.",
  notFound: "The requested item was not found.",
  outOfStock: "This item is currently out of stock.",
  paymentFailed: "Payment failed. Please try again.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  orderPlaced: "Your order has been placed successfully!",
  profileUpdated: "Your profile has been updated.",
  addressSaved: "Address has been saved.",
  itemAddedToCart: "Item added to cart.",
  itemRemovedFromCart: "Item removed from cart.",
} as const;

// Feature flags (for gradual rollout of features)
export const FEATURE_FLAGS = {
  enableRecommendations: true,
  enableRealTimeTracking: true,
  enablePushNotifications: false,
  enableSocialLogin: false,
  enableLoyaltyProgram: false,
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  shops: 5 * 60 * 1000, // 5 minutes
  products: 10 * 60 * 1000, // 10 minutes
  recommendations: 15 * 60 * 1000, // 15 minutes
  orders: 30 * 1000, // 30 seconds
} as const;
