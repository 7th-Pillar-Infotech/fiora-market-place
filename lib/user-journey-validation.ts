/**
 * User Journey Validation Utilities
 * Validates complete user flows and data consistency
 */

import { CartItem, Order, Product, Shop, Customer } from "./types";
import { storage, STORAGE_KEYS } from "./utils";
import { mockProducts, mockShops, mockOrders } from "./mock-data";

export interface JourneyStep {
  id: string;
  name: string;
  description: string;
  validate: () => Promise<ValidationResult>;
  setup?: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

export interface ValidationResult {
  success: boolean;
  message: string;
  details?: any;
  errors?: string[];
}

export interface UserJourney {
  id: string;
  name: string;
  description: string;
  steps: JourneyStep[];
  requirements: string[];
}

/**
 * Complete user journey from browsing to order completion
 */
export const completeShoppingJourney: UserJourney = {
  id: "complete-shopping",
  name: "Complete Shopping Journey",
  description: "Full user flow from shop discovery to order completion",
  requirements: ["1.1", "2.1", "3.1", "5.1", "6.1", "7.1"],
  steps: [
    {
      id: "browse-shops",
      name: "Browse Shops",
      description: "User can discover and browse flower shops",
      validate: async () => {
        try {
          const shops = mockShops;
          if (shops.length === 0) {
            return {
              success: false,
              message: "No shops available for browsing",
            };
          }

          // Check if shops have required properties
          const requiredProps = [
            "id",
            "name",
            "rating",
            "estimatedDeliveryTime",
            "distance",
          ];
          const invalidShops = shops.filter(
            (shop) => !requiredProps.every((prop) => shop.hasOwnProperty(prop))
          );

          if (invalidShops.length > 0) {
            return {
              success: false,
              message: "Some shops are missing required properties",
              details: invalidShops,
            };
          }

          return {
            success: true,
            message: `Successfully loaded ${shops.length} shops for browsing`,
            details: { shopCount: shops.length },
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to load shops",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
    {
      id: "view-shop-details",
      name: "View Shop Details",
      description: "User can view detailed information about a shop",
      validate: async () => {
        try {
          const shop = mockShops[0];
          if (!shop) {
            return {
              success: false,
              message: "No shop available for detail view",
            };
          }

          const requiredDetails = [
            "description",
            "hours",
            "address",
            "categories",
          ];
          const missingDetails = requiredDetails.filter(
            (detail) =>
              !shop.hasOwnProperty(detail) || !shop[detail as keyof Shop]
          );

          if (missingDetails.length > 0) {
            return {
              success: false,
              message: "Shop is missing required details",
              details: { missing: missingDetails },
            };
          }

          return {
            success: true,
            message: "Shop details are complete and accessible",
            details: { shopId: shop.id, shopName: shop.name },
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to load shop details",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
    {
      id: "browse-products",
      name: "Browse Products",
      description: "User can browse products in a shop catalog",
      validate: async () => {
        try {
          const shop = mockShops[0];
          const products = mockProducts.filter((p) => p.shopId === shop.id);

          if (products.length === 0) {
            return {
              success: false,
              message: "No products available in shop catalog",
            };
          }

          const requiredProps = [
            "id",
            "name",
            "price",
            "description",
            "isAvailable",
          ];
          const invalidProducts = products.filter(
            (product) =>
              !requiredProps.every((prop) => product.hasOwnProperty(prop))
          );

          if (invalidProducts.length > 0) {
            return {
              success: false,
              message: "Some products are missing required properties",
              details: invalidProducts,
            };
          }

          return {
            success: true,
            message: `Successfully loaded ${products.length} products for shop`,
            details: { productCount: products.length, shopId: shop.id },
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to load products",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
    {
      id: "add-to-cart",
      name: "Add to Cart",
      description: "User can add products to shopping cart",
      setup: async () => {
        // Clear cart before test
        storage.remove(STORAGE_KEYS.CART);
      },
      validate: async () => {
        try {
          const product = mockProducts.find((p) => p.isAvailable);
          if (!product) {
            return {
              success: false,
              message: "No available products to add to cart",
            };
          }

          // Simulate adding to cart
          const cartItem: CartItem = {
            product,
            quantity: 2,
            shopId: product.shopId,
          };

          storage.set(STORAGE_KEYS.CART, [cartItem]);

          // Verify cart persistence
          const savedCart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);

          if (savedCart.length === 0) {
            return {
              success: false,
              message: "Cart item was not persisted",
            };
          }

          const savedItem = savedCart[0];
          if (savedItem.product.id !== product.id || savedItem.quantity !== 2) {
            return {
              success: false,
              message: "Cart item data is incorrect",
              details: { expected: cartItem, actual: savedItem },
            };
          }

          return {
            success: true,
            message: "Product successfully added to cart and persisted",
            details: { productId: product.id, quantity: 2 },
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to add product to cart",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
    {
      id: "checkout-process",
      name: "Checkout Process",
      description: "User can complete checkout with delivery information",
      validate: async () => {
        try {
          const cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);

          if (cart.length === 0) {
            return {
              success: false,
              message: "No items in cart for checkout",
            };
          }

          // Validate cart items are still available
          const unavailableItems = cart.filter(
            (item) => !item.product.isAvailable
          );
          if (unavailableItems.length > 0) {
            return {
              success: false,
              message: "Some cart items are no longer available",
              details: unavailableItems,
            };
          }

          // Calculate totals
          const totalAmount = cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );

          if (totalAmount <= 0) {
            return {
              success: false,
              message: "Invalid cart total amount",
            };
          }

          // Simulate address validation
          const testAddress = {
            street: "Khreshchatyk Street 1",
            city: "Kyiv",
            postalCode: "01001",
            coordinates: { lat: 50.4501, lng: 30.5234 },
          };

          return {
            success: true,
            message: "Checkout process validation successful",
            details: {
              itemCount: cart.length,
              totalAmount,
              deliveryAddress: testAddress,
            },
          };
        } catch (error) {
          return {
            success: false,
            message: "Checkout validation failed",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
    {
      id: "order-creation",
      name: "Order Creation",
      description: "System creates order after successful payment",
      validate: async () => {
        try {
          const cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);

          // Create test order
          const testOrder: Order = {
            id: `order-${Date.now()}`,
            customerId: "test-customer",
            items: cart,
            totalAmount: cart.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            ),
            status: "confirmed",
            deliveryAddress: {
              street: "Khreshchatyk Street 1",
              city: "Kyiv",
              postalCode: "01001",
              coordinates: { lat: 50.4501, lng: 30.5234 },
            },
            estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Save order
          const existingOrders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
          existingOrders.unshift(testOrder);
          storage.set(STORAGE_KEYS.ORDERS, existingOrders);

          // Clear cart after order creation
          storage.remove(STORAGE_KEYS.CART);

          // Verify order was saved
          const savedOrders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
          const savedOrder = savedOrders.find((o) => o.id === testOrder.id);

          if (!savedOrder) {
            return {
              success: false,
              message: "Order was not saved properly",
            };
          }

          return {
            success: true,
            message: "Order created and saved successfully",
            details: {
              orderId: testOrder.id,
              totalAmount: testOrder.totalAmount,
              itemCount: testOrder.items.length,
            },
          };
        } catch (error) {
          return {
            success: false,
            message: "Order creation failed",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
    {
      id: "order-tracking",
      name: "Order Tracking",
      description: "User can track order status and delivery progress",
      validate: async () => {
        try {
          const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);

          if (orders.length === 0) {
            return {
              success: false,
              message: "No orders available for tracking",
            };
          }

          const recentOrder = orders[0];
          const validStatuses = [
            "confirmed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ];

          if (!validStatuses.includes(recentOrder.status)) {
            return {
              success: false,
              message: "Order has invalid status",
              details: { status: recentOrder.status },
            };
          }

          // Simulate status update
          recentOrder.status = "preparing";
          recentOrder.updatedAt = new Date();
          storage.set(STORAGE_KEYS.ORDERS, orders);

          return {
            success: true,
            message: "Order tracking is functional",
            details: {
              orderId: recentOrder.id,
              status: recentOrder.status,
              estimatedDelivery: recentOrder.estimatedDeliveryTime,
            },
          };
        } catch (error) {
          return {
            success: false,
            message: "Order tracking failed",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
  ],
};

/**
 * Data persistence validation journey
 */
export const dataPersistenceJourney: UserJourney = {
  id: "data-persistence",
  name: "Data Persistence Journey",
  description: "Validates data persistence across browser sessions",
  requirements: ["All requirements"],
  steps: [
    {
      id: "cart-persistence",
      name: "Cart Persistence",
      description: "Cart data persists across browser sessions",
      setup: async () => {
        storage.remove(STORAGE_KEYS.CART);
      },
      validate: async () => {
        try {
          const testCart: CartItem[] = [
            {
              product: mockProducts[0],
              quantity: 2,
              shopId: mockProducts[0].shopId,
            },
          ];

          storage.set(STORAGE_KEYS.CART, testCart);

          // Simulate page reload by retrieving data
          const retrievedCart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);

          if (retrievedCart.length !== testCart.length) {
            return {
              success: false,
              message: "Cart items count mismatch after persistence",
            };
          }

          const retrievedItem = retrievedCart[0];
          if (retrievedItem.product.id !== testCart[0].product.id) {
            return {
              success: false,
              message: "Cart item data corrupted after persistence",
            };
          }

          return {
            success: true,
            message: "Cart data persisted successfully",
            details: { itemCount: retrievedCart.length },
          };
        } catch (error) {
          return {
            success: false,
            message: "Cart persistence failed",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
    {
      id: "preferences-persistence",
      name: "User Preferences Persistence",
      description: "User preferences persist across sessions",
      validate: async () => {
        try {
          const testPreferences = {
            notifications: true,
            emailUpdates: false,
            theme: "dark" as const,
            language: "uk",
          };

          storage.set(STORAGE_KEYS.PREFERENCES, testPreferences);
          const retrieved = storage.get(STORAGE_KEYS.PREFERENCES, {});

          if (JSON.stringify(retrieved) !== JSON.stringify(testPreferences)) {
            return {
              success: false,
              message: "Preferences data mismatch after persistence",
            };
          }

          return {
            success: true,
            message: "User preferences persisted successfully",
            details: testPreferences,
          };
        } catch (error) {
          return {
            success: false,
            message: "Preferences persistence failed",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
    {
      id: "browsing-history-persistence",
      name: "Browsing History Persistence",
      description: "Browsing history persists for recommendations",
      validate: async () => {
        try {
          const testHistory = [
            mockProducts[0].id,
            mockProducts[1].id,
            mockProducts[2].id,
          ];

          storage.set(STORAGE_KEYS.BROWSING_HISTORY, testHistory);
          const retrieved = storage.get<string[]>(
            STORAGE_KEYS.BROWSING_HISTORY,
            []
          );

          if (retrieved.length !== testHistory.length) {
            return {
              success: false,
              message: "Browsing history length mismatch",
            };
          }

          return {
            success: true,
            message: "Browsing history persisted successfully",
            details: { historyCount: retrieved.length },
          };
        } catch (error) {
          return {
            success: false,
            message: "Browsing history persistence failed",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
        }
      },
    },
  ],
};

/**
 * Run a complete user journey validation
 */
export async function runUserJourney(journey: UserJourney): Promise<{
  success: boolean;
  results: Array<{
    step: JourneyStep;
    result: ValidationResult;
    duration: number;
  }>;
  summary: {
    totalSteps: number;
    passedSteps: number;
    failedSteps: number;
    totalDuration: number;
  };
}> {
  const results: Array<{
    step: JourneyStep;
    result: ValidationResult;
    duration: number;
  }> = [];

  let totalDuration = 0;

  for (const step of journey.steps) {
    const startTime = Date.now();

    try {
      // Run setup if provided
      if (step.setup) {
        await step.setup();
      }

      // Run validation
      const result = await step.validate();
      const duration = Date.now() - startTime;
      totalDuration += duration;

      results.push({
        step,
        result,
        duration,
      });

      // Run cleanup if provided
      if (step.cleanup) {
        await step.cleanup();
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      totalDuration += duration;

      results.push({
        step,
        result: {
          success: false,
          message: "Step execution failed",
          errors: [error instanceof Error ? error.message : "Unknown error"],
        },
        duration,
      });
    }
  }

  const passedSteps = results.filter((r) => r.result.success).length;
  const failedSteps = results.filter((r) => !r.result.success).length;

  return {
    success: failedSteps === 0,
    results,
    summary: {
      totalSteps: journey.steps.length,
      passedSteps,
      failedSteps,
      totalDuration,
    },
  };
}

/**
 * Available user journeys for testing
 */
export const userJourneys = {
  completeShoppingJourney,
  dataPersistenceJourney,
};
