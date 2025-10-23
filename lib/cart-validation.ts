/**
 * Cart validation utilities for the Fiora Customer Dashboard
 */

import { CartItem, Product } from "./types";

export interface ValidationError {
  type: "availability" | "stock" | "quantity" | "general";
  message: string;
  productId?: string;
}

export interface CartValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate a single cart item
 */
export function validateCartItem(
  item: CartItem,
  currentProduct?: Product
): ValidationError[] {
  const errors: ValidationError[] = [];
  const product = currentProduct || item.product;

  // Check if product is available
  if (!product.isAvailable) {
    errors.push({
      type: "availability",
      message: `${product.name} is currently unavailable`,
      productId: product.id,
    });
  }

  // Check stock constraints
  if (item.quantity > product.stock) {
    errors.push({
      type: "stock",
      message: `Only ${product.stock} ${
        product.stock === 1 ? "item" : "items"
      } of ${product.name} available in stock`,
      productId: product.id,
    });
  }

  // Check minimum quantity (should be at least 1)
  if (item.quantity < 1) {
    errors.push({
      type: "quantity",
      message: `Quantity must be at least 1 for ${product.name}`,
      productId: product.id,
    });
  }

  // Check maximum quantity per order (business rule: max 10 of any item)
  if (item.quantity > 10) {
    errors.push({
      type: "quantity",
      message: `Maximum 10 items allowed per order for ${product.name}`,
      productId: product.id,
    });
  }

  return errors;
}

/**
 * Validate entire cart
 */
export function validateCart(
  cartItems: CartItem[],
  currentProducts?: Product[]
): CartValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Create a map of current products for quick lookup
  const productMap = new Map<string, Product>();
  if (currentProducts) {
    currentProducts.forEach((product) => {
      productMap.set(product.id, product);
    });
  }

  // Validate each cart item
  cartItems.forEach((item) => {
    const currentProduct = productMap.get(item.product.id);
    const itemErrors = validateCartItem(item, currentProduct);
    errors.push(...itemErrors);
  });

  // Check for duplicate products (shouldn't happen with proper cart management)
  const productIds = cartItems.map((item) => item.product.id);
  const duplicateIds = productIds.filter(
    (id, index) => productIds.indexOf(id) !== index
  );

  if (duplicateIds.length > 0) {
    errors.push({
      type: "general",
      message: "Duplicate products found in cart",
    });
  }

  // Check cart size limits (business rule: max 50 items total)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 50) {
    errors.push({
      type: "quantity",
      message: "Maximum 50 items allowed in cart",
    });
  }

  // Add warnings for low stock items
  cartItems.forEach((item) => {
    const currentProduct = productMap.get(item.product.id) || item.product;

    if (
      currentProduct.isAvailable &&
      currentProduct.stock <= 5 &&
      currentProduct.stock >= item.quantity
    ) {
      warnings.push({
        type: "stock",
        message: `Only ${currentProduct.stock} ${
          currentProduct.stock === 1 ? "item" : "items"
        } left in stock for ${currentProduct.name}`,
        productId: currentProduct.id,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate adding a product to cart
 */
export function validateAddToCart(
  product: Product,
  quantity: number,
  currentCartItems: CartItem[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if product is available
  if (!product.isAvailable) {
    errors.push({
      type: "availability",
      message: `${product.name} is currently unavailable`,
      productId: product.id,
    });
    return errors; // Return early if unavailable
  }

  // Check if adding this quantity would exceed stock
  const existingItem = currentCartItems.find(
    (item) => item.product.id === product.id
  );
  const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
  const totalQuantityAfterAdd = currentQuantityInCart + quantity;

  if (totalQuantityAfterAdd > product.stock) {
    const availableToAdd = product.stock - currentQuantityInCart;
    if (availableToAdd <= 0) {
      errors.push({
        type: "stock",
        message: `${product.name} is already at maximum quantity in your cart`,
        productId: product.id,
      });
    } else {
      errors.push({
        type: "stock",
        message: `Only ${availableToAdd} more ${
          availableToAdd === 1 ? "item" : "items"
        } of ${product.name} can be added to cart`,
        productId: product.id,
      });
    }
  }

  // Check quantity limits
  if (quantity < 1) {
    errors.push({
      type: "quantity",
      message: "Quantity must be at least 1",
      productId: product.id,
    });
  }

  if (totalQuantityAfterAdd > 10) {
    errors.push({
      type: "quantity",
      message: `Maximum 10 items allowed per product. You can add ${
        10 - currentQuantityInCart
      } more.`,
      productId: product.id,
    });
  }

  // Check total cart size after adding
  const currentTotalItems = currentCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  if (currentTotalItems + quantity > 50) {
    const availableSlots = 50 - currentTotalItems;
    if (availableSlots <= 0) {
      errors.push({
        type: "quantity",
        message: "Cart is full. Maximum 50 items allowed.",
      });
    } else {
      errors.push({
        type: "quantity",
        message: `Only ${availableSlots} more ${
          availableSlots === 1 ? "item" : "items"
        } can be added to cart`,
      });
    }
  }

  return errors;
}

/**
 * Get user-friendly error message for display
 */
export function getErrorMessage(error: ValidationError): string {
  return error.message;
}

/**
 * Group errors by type for better UX
 */
export function groupErrorsByType(
  errors: ValidationError[]
): Record<string, ValidationError[]> {
  return errors.reduce((groups, error) => {
    const type = error.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(error);
    return groups;
  }, {} as Record<string, ValidationError[]>);
}

/**
 * Check if cart is ready for checkout
 */
export function isCartReadyForCheckout(
  cartItems: CartItem[],
  currentProducts?: Product[]
): { ready: boolean; errors: ValidationError[] } {
  if (cartItems.length === 0) {
    return {
      ready: false,
      errors: [
        {
          type: "general",
          message: "Cart is empty",
        },
      ],
    };
  }

  const validation = validateCart(cartItems, currentProducts);

  // For checkout, we only care about errors, not warnings
  return {
    ready: validation.isValid,
    errors: validation.errors,
  };
}
