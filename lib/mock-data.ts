/**
 * Mock data generation utilities for the Fiora Customer Dashboard
 */

import { Shop, Product, Order, Customer, Address, CartItem } from "./types";

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

  for (let i = 0; i < count; i++) {
    const address = generateAddress();
    const distance = calculateDistance(KYIV_CENTER, address.coordinates);

    const shop: Shop = {
      id: `shop-${i + 1}`,
      name: SHOP_NAMES[i % SHOP_NAMES.length],
      description: `Beautiful flower arrangements and fresh blooms in ${
        address.street.split(" ")[1]
      } district`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
      reviewCount: Math.floor(Math.random() * 500) + 10,
      estimatedDeliveryTime:
        Math.floor(distance * 10) + Math.floor(Math.random() * 30) + 15, // 15-75 minutes
      distance: Math.round(distance * 10) / 10,
      imageUrl: `/api/placeholder/400/300?shop=${i + 1}`,
      isOpen: Math.random() > 0.2, // 80% chance of being open
      categories: CATEGORIES.slice(0, Math.floor(Math.random() * 3) + 2),
      address,
      phone: `+380${Math.floor(Math.random() * 900000000) + 100000000}`,
      hours: {
        monday: { open: "09:00", close: "20:00" },
        tuesday: { open: "09:00", close: "20:00" },
        wednesday: { open: "09:00", close: "20:00" },
        thursday: { open: "09:00", close: "20:00" },
        friday: { open: "09:00", close: "21:00" },
        saturday: { open: "10:00", close: "21:00" },
        sunday: { open: "10:00", close: "19:00" },
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

  shops.forEach((shop) => {
    for (let i = 0; i < productsPerShop; i++) {
      const basePrice = Math.floor(Math.random() * 800) + 200; // 200-1000 UAH
      const category =
        shop.categories[Math.floor(Math.random() * shop.categories.length)];

      const product: Product = {
        id: `product-${shop.id}-${i + 1}`,
        shopId: shop.id,
        name: PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)],
        description: `Fresh ${category} arrangement crafted with care by our expert florists`,
        price: basePrice,
        imageUrls: [
          `/api/placeholder/400/400?product=${shop.id}-${i + 1}-1`,
          `/api/placeholder/400/400?product=${shop.id}-${i + 1}-2`,
          `/api/placeholder/400/400?product=${shop.id}-${i + 1}-3`,
        ],
        category,
        isAvailable: Math.random() > 0.1, // 90% availability
        estimatedDeliveryTime:
          shop.estimatedDeliveryTime + Math.floor(Math.random() * 15),
        tags: ["fresh", "handcrafted", category],
        stock: Math.floor(Math.random() * 20) + 1,
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

// Initialize and export mock data
export const mockShops = generateMockShops(20);
export const mockProducts = generateMockProducts(mockShops, 15);
export const mockCustomer = generateMockCustomer();
export const mockOrders = generateMockOrders(mockCustomer, mockProducts, 8);
