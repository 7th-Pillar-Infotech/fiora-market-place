/**
 * Mock data generation utilities for the Fiora Customer Dashboard
 */

import {
  Shop,
  Product,
  Order,
  Customer,
  Address,
  CartItem,
  ShopFilters,
  ProductFilters,
} from "./types";

// Kyiv coordinates for realistic location data
const KYIV_CENTER = { lat: 50.4501, lng: 30.5234 };

// Sample data arrays for generating realistic mock data
const SHOP_NAMES = [
  "Bloom & Blossom",
  "Petals Paradise",
  "Flower Power Kyiv",
  "Rose Garden",
  "Lily's Boutique",
  "Sunflower Studio",
  "Orchid Oasis",
  "Tulip Time",
  "Daisy Dreams",
  "Violet Visions",
  "Iris Inspirations",
  "Poppy Place",
  "Carnation Corner",
  "Jasmine Junction",
  "Lavender Lane",
  "Magnolia Manor",
  "Peony Palace",
  "Chrysanthemum Charm",
  "Daffodil Delights",
  "Hibiscus Haven",
  "Kyiv Flower Market",
  "Golden Petals",
  "Fresh Blooms Studio",
  "Elegant Arrangements",
  "Spring Garden Boutique",
];

const PRODUCT_NAMES = [
  "Classic Red Roses",
  "Spring Tulip Mix",
  "Elegant White Lilies",
  "Sunflower Bouquet",
  "Mixed Seasonal Flowers",
  "Romantic Pink Roses",
  "Orchid Arrangement",
  "Wildflower Bundle",
  "Baby's Breath Bouquet",
  "Peony Paradise",
  "Iris Garden Mix",
  "Carnation Delight",
  "Lavender Dreams",
  "Chrysanthemum Charm",
  "Daffodil Sunshine",
  "Violet Elegance",
  "Poppy Field Mix",
  "Jasmine Romance",
  "Magnolia Beauty",
  "Hibiscus Tropical",
  "Royal Blue Hydrangeas",
  "Autumn Harvest Mix",
  "Wedding White Bouquet",
  "Birthday Celebration",
  "Anniversary Special",
  "Sympathy Arrangement",
  "Get Well Soon Flowers",
  "Congratulations Bouquet",
  "Thank You Flowers",
  "Apology Roses",
  "Mother's Day Special",
  "Valentine's Romance",
  "Easter Lily Arrangement",
  "Christmas Poinsettia",
  "New Year Celebration",
  "Graduation Flowers",
  "Baby Shower Pastels",
  "Housewarming Gift",
  "Retirement Bouquet",
  "Promotion Congratulations",
  "Exotic Bird of Paradise",
  "Tropical Anthurium",
  "Delicate Freesia",
  "Fragrant Gardenias",
  "Cheerful Gerberas",
  "Majestic Gladioli",
  "Sweet Alstroemeria",
  "Elegant Calla Lilies",
  "Vibrant Ranunculus",
  "Soft Pink Peonies",
  "Purple Lisianthus",
  "Orange Marigolds",
  "Yellow Daffodils",
  "White Chrysanthemums",
  "Red Carnations",
  "Pink Tulips",
  "Blue Delphiniums",
  "Green Cymbidium Orchids",
  "Burgundy Dahlias",
  "Coral Roses",
];

const CATEGORIES = ["bouquets", "arrangements", "plants", "gifts", "seasonal"];

const KYIV_DISTRICTS = [
  "Shevchenkivskyi",
  "Pecherskyi",
  "Podilskyi",
  "Obolonskyi",
  "Solomianskyi",
  "Sviatoshynskyi",
  "Holosiivskyi",
  "Darnytskyi",
  "Dniprovskyi",
  "Desnianskyi",
];

/**
 * Generate random coordinates within Kyiv bounds
 */
function generateKyivCoordinates(): { lat: number; lng: number } {
  const latOffset = (Math.random() - 0.5) * 0.2; // ~11km radius
  const lngOffset = (Math.random() - 0.5) * 0.3; // ~11km radius

  return {
    lat: KYIV_CENTER.lat + latOffset,
    lng: KYIV_CENTER.lng + lngOffset,
  };
}

/**
 * Generate a random address in Kyiv
 */
function generateAddress(): Address {
  const coordinates = generateKyivCoordinates();
  const district =
    KYIV_DISTRICTS[Math.floor(Math.random() * KYIV_DISTRICTS.length)];
  const streetNumber = Math.floor(Math.random() * 200) + 1;

  return {
    street: `${streetNumber} ${district} Street`,
    city: "Kyiv",
    postalCode: `0${Math.floor(Math.random() * 9) + 1}${
      Math.floor(Math.random() * 900) + 100
    }`,
    coordinates,
  };
}

/**
 * Calculate distance between two coordinates (simplified)
 */
function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate mock shop data
 */
export function generateMockShops(count: number = 20): Shop[] {
  const shops: Shop[] = [];
  const specialties = [
    "wedding arrangements and bridal bouquets",
    "exotic flowers and tropical arrangements",
    "seasonal decorations and holiday themes",
    "corporate events and office arrangements",
    "sympathy flowers and funeral arrangements",
    "birthday celebrations and party decorations",
    "romantic bouquets and anniversary gifts",
    "plant care and indoor gardening",
    "custom arrangements and personalized gifts",
    "same-day delivery and express service",
  ];

  for (let i = 0; i < count; i++) {
    const address = generateAddress();
    const distance = calculateDistance(KYIV_CENTER, address.coordinates);
    const shopName = SHOP_NAMES[i % SHOP_NAMES.length];
    const specialty =
      specialties[Math.floor(Math.random() * specialties.length)];
    const district = address.street.split(" ")[1];

    // Vary business hours slightly
    const openTime = Math.random() > 0.5 ? "08:00" : "09:00";
    const closeTime = Math.random() > 0.3 ? "20:00" : "19:00";
    const fridayClose = Math.random() > 0.4 ? "21:00" : "20:00";
    const weekendOpen = Math.random() > 0.3 ? "09:00" : "10:00";
    const sundayClose = Math.random() > 0.5 ? "19:00" : "18:00";

    const shop: Shop = {
      id: `shop-${i + 1}`,
      name: shopName,
      description: `${shopName} specializes in ${specialty}. Located in the heart of ${district} district, we've been serving Kyiv with fresh, beautiful flowers for over ${
        Math.floor(Math.random() * 15) + 5
      } years. Our expert florists create stunning arrangements for every occasion.`,
      rating: Math.round((Math.random() * 1.8 + 3.2) * 10) / 10, // 3.2 - 5.0 with better distribution
      reviewCount: Math.floor(Math.random() * 800) + 25, // 25-825 reviews
      estimatedDeliveryTime:
        Math.floor(distance * 8) + Math.floor(Math.random() * 25) + 20, // 20-80 minutes
      distance: Math.round(distance * 10) / 10,
      imageUrl: `https://picsum.photos/400/300?random=${i + 1}`,
      isOpen: Math.random() > 0.15, // 85% chance of being open
      categories: CATEGORIES.slice(0, Math.floor(Math.random() * 4) + 2), // 2-5 categories
      address,
      phone: `+380${Math.floor(Math.random() * 900000000) + 100000000}`,
      hours: {
        monday: { open: openTime, close: closeTime },
        tuesday: { open: openTime, close: closeTime },
        wednesday: { open: openTime, close: closeTime },
        thursday: { open: openTime, close: closeTime },
        friday: { open: openTime, close: fridayClose },
        saturday: { open: weekendOpen, close: fridayClose },
        sunday: { open: weekendOpen, close: sundayClose },
      },
    };

    shops.push(shop);
  }

  return shops.sort((a, b) => a.distance - b.distance);
}

/**
 * Generate mock product data for shops
 */
export function generateMockProducts(
  shops: Shop[],
  productsPerShop: number = 15
): Product[] {
  const products: Product[] = [];
  const occasions = [
    "wedding",
    "birthday",
    "anniversary",
    "sympathy",
    "congratulations",
    "romantic",
    "seasonal",
  ];
  const colors = [
    "red",
    "pink",
    "white",
    "yellow",
    "purple",
    "blue",
    "orange",
    "mixed",
  ];
  const sizes = ["small", "medium", "large", "premium"];

  shops.forEach((shop) => {
    for (let i = 0; i < productsPerShop; i++) {
      const category =
        shop.categories[Math.floor(Math.random() * shop.categories.length)];
      const occasion = occasions[Math.floor(Math.random() * occasions.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      // Price based on category and size
      let basePrice = 200;
      switch (category) {
        case "bouquets":
          basePrice =
            size === "small"
              ? 300
              : size === "medium"
              ? 500
              : size === "large"
              ? 800
              : 1200;
          break;
        case "arrangements":
          basePrice =
            size === "small"
              ? 400
              : size === "medium"
              ? 700
              : size === "large"
              ? 1100
              : 1600;
          break;
        case "plants":
          basePrice =
            size === "small"
              ? 250
              : size === "medium"
              ? 450
              : size === "large"
              ? 750
              : 1200;
          break;
        case "gifts":
          basePrice =
            size === "small"
              ? 350
              : size === "medium"
              ? 600
              : size === "large"
              ? 950
              : 1400;
          break;
        case "seasonal":
          basePrice =
            size === "small"
              ? 280
              : size === "medium"
              ? 480
              : size === "large"
              ? 780
              : 1180;
          break;
      }

      // Add some price variation
      const priceVariation = Math.floor(Math.random() * 200) - 100; // ±100 UAH
      const finalPrice = Math.max(150, basePrice + priceVariation);

      const productName =
        PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
      const sizeLabel = size.charAt(0).toUpperCase() + size.slice(1);

      const product: Product = {
        id: `product-${shop.id}-${i + 1}`,
        shopId: shop.id,
        name: `${sizeLabel} ${productName}`,
        description: `Beautiful ${color} ${category.slice(
          0,
          -1
        )} perfect for ${occasion} occasions. Expertly crafted with fresh, premium flowers by our skilled florists. Includes care instructions and complimentary message card.`,
        price: finalPrice,
        imageUrls: [
          `https://picsum.photos/400/400?random=${shop.id}-${i + 1}-1`,
          `https://picsum.photos/400/400?random=${shop.id}-${i + 1}-2`,
          `https://picsum.photos/400/400?random=${shop.id}-${i + 1}-3`,
        ],
        category,
        isAvailable: Math.random() > 0.15, // 85% availability
        estimatedDeliveryTime:
          shop.estimatedDeliveryTime + Math.floor(Math.random() * 20) + 5,
        tags: ["fresh", "handcrafted", category, occasion, color, size].filter(
          Boolean
        ),
        stock: Math.floor(Math.random() * 25) + 5, // 5-30 items in stock
      };

      products.push(product);
    }
  });

  return products;
}

/**
 * Generate mock customer data
 */
export function generateMockCustomer(): Customer {
  return {
    id: "customer-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+380501234567",
    addresses: [generateAddress(), generateAddress()],
    defaultAddressId: undefined,
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
    },
  };
}

/**
 * Generate mock order data
 */
export function generateMockOrders(
  customer: Customer,
  products: Product[],
  count: number = 5
): Order[] {
  const orders: Order[] = [];
  const statuses: Order["status"][] = [
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];

  for (let i = 0; i < count; i++) {
    const orderProducts = products.slice(0, Math.floor(Math.random() * 3) + 1);
    const items: CartItem[] = orderProducts.map((product) => ({
      product,
      quantity: Math.floor(Math.random() * 3) + 1,
      shopId: product.shopId,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const createdAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ); // Last 30 days

    const order: Order = {
      id: `order-${i + 1}`,
      customerId: customer.id,
      items,
      totalAmount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      deliveryAddress: customer.addresses[0],
      estimatedDeliveryTime: new Date(
        createdAt.getTime() + Math.random() * 2 * 60 * 60 * 1000
      ), // 0-2 hours
      createdAt,
      updatedAt: createdAt,
      paymentMethod: "card",
      deliveryInstructions: "Please ring the doorbell",
    };

    if (order.status === "delivered") {
      order.actualDeliveryTime = new Date(
        order.estimatedDeliveryTime.getTime() - Math.random() * 30 * 60 * 1000
      );
    }

    if (order.status === "out_for_delivery") {
      order.courierLocation = generateKyivCoordinates();
    }

    orders.push(order);
  }

  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * LocalStorage utilities for data persistence
 */
export const StorageKeys = {
  CART: "fiora_cart",
  USER_PREFERENCES: "fiora_user_preferences",
  BROWSING_HISTORY: "fiora_browsing_history",
  SAVED_ADDRESSES: "fiora_saved_addresses",
  ORDER_HISTORY: "fiora_order_history",
} as const;

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Failed to remove from localStorage:", error);
  }
}

/**
 * Cart management utilities
 */
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  estimatedDeliveryTime: number;
}

export function saveCart(cart: CartItem[]): void {
  saveToStorage(StorageKeys.CART, cart);
}

export function loadCart(): CartItem[] {
  return loadFromStorage<CartItem[]>(StorageKeys.CART, []);
}

export function calculateCartTotals(items: CartItem[]): CartState {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const estimatedDeliveryTime =
    items.length > 0
      ? Math.max(...items.map((item) => item.product.estimatedDeliveryTime))
      : 0;

  return {
    items,
    totalItems,
    totalAmount,
    estimatedDeliveryTime,
  };
}

/**
 * User preferences management
 */
export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  smsUpdates: boolean;
  defaultAddress?: Address;
  favoriteShops: string[];
  recentSearches: string[];
}

export function saveUserPreferences(preferences: UserPreferences): void {
  saveToStorage(StorageKeys.USER_PREFERENCES, preferences);
}

export function loadUserPreferences(): UserPreferences {
  return loadFromStorage<UserPreferences>(StorageKeys.USER_PREFERENCES, {
    notifications: true,
    emailUpdates: true,
    smsUpdates: false,
    favoriteShops: [],
    recentSearches: [],
  });
}

/**
 * Browsing history management
 */
export interface BrowsingHistoryItem {
  productId: string;
  shopId: string;
  timestamp: Date;
  category: string;
}

export function addToBrowsingHistory(
  item: Omit<BrowsingHistoryItem, "timestamp">
): void {
  const history = loadFromStorage<BrowsingHistoryItem[]>(
    StorageKeys.BROWSING_HISTORY,
    []
  );
  const newItem: BrowsingHistoryItem = {
    ...item,
    timestamp: new Date(),
  };

  // Remove existing entry for same product and add new one at the beginning
  const filteredHistory = history.filter((h) => h.productId !== item.productId);
  const updatedHistory = [newItem, ...filteredHistory].slice(0, 50); // Keep last 50 items

  saveToStorage(StorageKeys.BROWSING_HISTORY, updatedHistory);
}

export function getBrowsingHistory(): BrowsingHistoryItem[] {
  return loadFromStorage<BrowsingHistoryItem[]>(
    StorageKeys.BROWSING_HISTORY,
    []
  );
}

/**
 * Data filtering and sorting utilities
 */
export function filterShops(shops: Shop[], filters: ShopFilters): Shop[] {
  return shops.filter((shop) => {
    if (filters.rating && shop.rating < filters.rating) return false;
    if (
      filters.maxDeliveryTime &&
      shop.estimatedDeliveryTime > filters.maxDeliveryTime
    )
      return false;
    if (filters.categories && filters.categories.length > 0) {
      const hasMatchingCategory = filters.categories.some((cat) =>
        shop.categories.includes(cat)
      );
      if (!hasMatchingCategory) return false;
    }
    if (filters.isOpen !== undefined && shop.isOpen !== filters.isOpen)
      return false;
    return true;
  });
}

export function sortShops(shops: Shop[], sortBy: string): Shop[] {
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
    default:
      return sorted;
  }
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (
      filters.isAvailable !== undefined &&
      product.isAvailable !== filters.isAvailable
    )
      return false;
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        product.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
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
    default:
      return sorted;
  }
}

export function searchShops(shops: Shop[], query: string): Shop[] {
  if (!query.trim()) return shops;

  const searchTerm = query.toLowerCase();
  return shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm) ||
      shop.description.toLowerCase().includes(searchTerm) ||
      shop.categories.some((cat) => cat.toLowerCase().includes(searchTerm))
  );
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const searchTerm = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
}

/**
 * Mock API simulation with loading states
 */
export interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export function simulateApiCall<T>(
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
}

export async function fetchShops(
  filters?: ShopFilters,
  sortBy?: string
): Promise<Shop[]> {
  let shops = mockShops;

  if (filters) {
    shops = filterShops(shops, filters);
  }

  if (sortBy) {
    shops = sortShops(shops, sortBy);
  }

  return simulateApiCall(shops);
}

export async function fetchProducts(
  shopId?: string,
  filters?: ProductFilters,
  sortBy?: string
): Promise<Product[]> {
  let products = shopId
    ? mockProducts.filter((p) => p.shopId === shopId)
    : mockProducts;

  if (filters) {
    products = filterProducts(products, filters);
  }

  if (sortBy) {
    products = sortProducts(products, sortBy);
  }

  return simulateApiCall(products);
}

export async function fetchShopById(id: string): Promise<Shop | null> {
  const shop = mockShops.find((s) => s.id === id) || null;
  return simulateApiCall(shop);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const product = mockProducts.find((p) => p.id === id) || null;
  return simulateApiCall(product);
}

export async function searchShopsAndProducts(
  query: string
): Promise<{ shops: Shop[]; products: Product[] }> {
  const shops = searchShops(mockShops, query);
  const products = searchProducts(mockProducts, query);

  return simulateApiCall({ shops, products });
}

/**
 * Recommendation engine utilities
 */
export function generateRecommendations(
  customerId: string,
  limit: number = 10
): Product[] {
  const history = getBrowsingHistory();
  const preferences = loadUserPreferences();

  // Get products from browsing history categories
  const historyCategories = [...new Set(history.map((h) => h.category))];
  const categoryProducts = mockProducts.filter(
    (p) => historyCategories.includes(p.category) && p.isAvailable
  );

  // Get products from favorite shops if available
  const favoriteShopProducts =
    preferences.favoriteShops.length > 0
      ? mockProducts.filter(
          (p) => preferences.favoriteShops.includes(p.shopId) && p.isAvailable
        )
      : [];

  // Get popular products (high rating shops)
  const popularProducts = mockProducts
    .filter((p) => p.isAvailable)
    .map((p) => ({
      ...p,
      shopRating: mockShops.find((s) => s.id === p.shopId)?.rating || 0,
    }))
    .filter((p) => p.shopRating >= 4.0)
    .sort((a, b) => b.shopRating - a.shopRating);

  // Combine and deduplicate
  const combined = [
    ...categoryProducts,
    ...favoriteShopProducts,
    ...popularProducts,
  ];
  const unique = combined.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );

  // Shuffle and limit
  const shuffled = unique.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

// Initialize and export mock data
export const mockShops = generateMockShops(18); // 18 shops as specified
export const mockProducts = generateMockProducts(mockShops, 12); // 18 * 12 = 216 products (200+ as required)
export const mockCustomer = generateMockCustomer();
export const mockOrders = generateMockOrders(mockCustomer, mockProducts, 8);
