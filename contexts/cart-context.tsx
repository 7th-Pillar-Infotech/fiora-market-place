"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product } from "@/lib/types";
import { STORAGE_KEYS, storage } from "@/lib/utils";
import {
  validateAddToCart,
  validateCart,
  isCartReadyForCheckout,
  ValidationError,
  CartValidationResult,
} from "@/lib/cart-validation";

// Cart state interface
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  estimatedDeliveryTime: number;
  isLoading: boolean;
  validation: CartValidationResult;
  lastError: string | null;
}

// Cart actions
export type CartAction =
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string } // productId
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "VALIDATE_CART"; payload?: Product[] };

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  estimatedDeliveryTime: 0,
  isLoading: true,
  validation: { isValid: true, errors: [], warnings: [] },
  lastError: null,
};

// Helper function to calculate cart totals and validation
function calculateTotalsAndValidation(
  items: CartItem[],
  currentProducts?: Product[]
): Omit<CartState, "items" | "isLoading" | "lastError"> {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const estimatedDeliveryTime =
    items.length > 0
      ? Math.max(...items.map((item) => item.product.estimatedDeliveryTime))
      : 0;

  const validation = validateCart(items, currentProducts);

  return {
    totalItems,
    totalAmount,
    estimatedDeliveryTime,
    validation,
  };
}

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART": {
      const totalsAndValidation = calculateTotalsAndValidation(action.payload);
      return {
        ...state,
        items: action.payload,
        ...totalsAndValidation,
        isLoading: false,
        lastError: null,
      };
    }

    case "ADD_ITEM": {
      const { product, quantity } = action.payload;

      // Validate before adding
      const validationErrors = validateAddToCart(
        product,
        quantity,
        state.items
      );
      if (validationErrors.length > 0) {
        return {
          ...state,
          lastError: validationErrors[0].message,
        };
      }

      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          shopId: product.shopId,
        };
        newItems = [...state.items, newItem];
      }

      const totalsAndValidation = calculateTotalsAndValidation(newItems);
      return {
        ...state,
        items: newItems,
        ...totalsAndValidation,
        lastError: null,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      const totalsAndValidation = calculateTotalsAndValidation(newItems);
      return {
        ...state,
        items: newItems,
        ...totalsAndValidation,
        lastError: null,
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter(
          (item) => item.product.id !== productId
        );
        const totalsAndValidation = calculateTotalsAndValidation(newItems);
        return {
          ...state,
          items: newItems,
          ...totalsAndValidation,
          lastError: null,
        };
      }

      const newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      const totalsAndValidation = calculateTotalsAndValidation(newItems);
      return {
        ...state,
        items: newItems,
        ...totalsAndValidation,
        lastError: null,
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
        estimatedDeliveryTime: 0,
        validation: { isValid: true, errors: [], warnings: [] },
        lastError: null,
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        lastError: action.payload,
      };
    }

    case "VALIDATE_CART": {
      const totalsAndValidation = calculateTotalsAndValidation(
        state.items,
        action.payload
      );
      return {
        ...state,
        ...totalsAndValidation,
      };
    }

    default:
      return state;
  }
}

// Context interface
interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  validateCart: (currentProducts?: Product[]) => void;
  clearError: () => void;
  isReadyForCheckout: () => boolean;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
    dispatch({ type: "LOAD_CART", payload: savedCart });
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!state.isLoading) {
      storage.set(STORAGE_KEYS.CART, state.items);
    }
  }, [state.items, state.isLoading]);

  // Cart actions
  const addItem = (product: Product, quantity: number = 1): boolean => {
    const currentState = state;
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    // Return false if there was an error (will be set in the reducer)
    return currentState.lastError === null;
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some((item) => item.product.id === productId);
  };

  const validateCartItems = (currentProducts?: Product[]) => {
    dispatch({ type: "VALIDATE_CART", payload: currentProducts });
  };

  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null });
  };

  const isReadyForCheckout = (): boolean => {
    const checkoutValidation = isCartReadyForCheckout(state.items);
    return checkoutValidation.ready;
  };

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    validateCart: validateCartItems,
    clearError,
    isReadyForCheckout,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
