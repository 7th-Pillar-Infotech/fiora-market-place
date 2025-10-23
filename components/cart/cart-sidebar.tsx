"use client";

import React from "react";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { CartErrors } from "./cart-errors";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    state,
    updateQuantity,
    removeItem,
    clearCart,
    clearError,
    isReadyForCheckout,
  } = useCart();
  const { items, totalItems, validation, lastError } = state;

  // Close sidebar when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:max-w-md max-w-full`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-4 p-3 border-b border-neutral-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg md:text-lg text-base font-semibold text-neutral-900">
              Shopping Cart
              {totalItems > 0 && (
                <span className="ml-2 text-sm text-neutral-500 hidden sm:inline">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 tap-target"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {items.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-neutral-500 mb-6">
                  Add some beautiful flowers to get started
                </p>
                <Button onClick={onClose} className="w-full">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              /* Cart Items */
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 md:p-4 p-3 scroll-smooth">
                  <div className="space-y-0">
                    {items.map((item) => (
                      <CartItem
                        key={item.product.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                        compact
                      />
                    ))}
                  </div>
                </div>

                {/* Summary and Actions */}
                <div className="border-t border-neutral-200 p-4 md:p-4 p-3 space-y-4 bg-white">
                  {/* Validation Errors */}
                  <CartErrors
                    errors={validation.errors}
                    warnings={validation.warnings}
                    lastError={lastError}
                    onClearError={clearError}
                  />

                  <CartSummary cartState={state} />

                  <div className="space-y-3">
                    <Link href="/checkout" onClick={onClose}>
                      <Button
                        className="w-full tap-target"
                        size="lg"
                        disabled={!isReadyForCheckout()}
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>

                    <div className="flex gap-2">
                      <Link href="/cart" onClick={onClose} className="flex-1">
                        <Button variant="outline" className="w-full tap-target">
                          View Cart
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 tap-target px-3"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
