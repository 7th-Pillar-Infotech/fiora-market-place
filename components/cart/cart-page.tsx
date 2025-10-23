"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { CartErrors } from "./cart-errors";

export function CartPage() {
  const {
    state,
    updateQuantity,
    removeItem,
    clearCart,
    clearError,
    isReadyForCheckout,
  } = useCart();
  const { items, totalItems, isLoading, validation, lastError } = state;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-neutral-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shops">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Shopping Cart
            </h1>
            {totalItems > 0 && (
              <p className="text-neutral-600">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-neutral-400" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Discover beautiful flowers from local shops in Kyiv and add them
              to your cart.
            </p>
            <Link href="/shops">
              <Button size="lg">Browse Shops</Button>
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Cart Items
                  </h2>
                  {items.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="space-y-0">
                  {items.map((item) => (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Validation Errors */}
                <CartErrors
                  errors={validation.errors}
                  warnings={validation.warnings}
                  lastError={lastError}
                  onClearError={clearError}
                />

                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <CartSummary
                    cartState={state}
                    className="bg-transparent p-0"
                  />

                  <div className="mt-6 space-y-3">
                    <Link href="/checkout">
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={!isReadyForCheckout()}
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>

                    <Link href="/shops">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">
                    Delivery Information
                  </h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Free delivery on orders over ₴500</li>
                    <li>• Same-day delivery available</li>
                    <li>• Fresh flowers guaranteed</li>
                    <li>• Contact-free delivery option</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
