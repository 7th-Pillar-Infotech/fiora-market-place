"use client";

import React from "react";
import { useCart } from "@/contexts/cart-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";

export function CartDebug() {
  const { state, addItem, clearCart } = useCart();
  const { items, totalItems, totalAmount, isLoading, validation, lastError } =
    state;

  const addTestProduct = () => {
    const testProduct = mockProducts[0];
    if (testProduct) {
      const success = addItem(testProduct, 1);
      console.log("Add test product result:", success);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cart Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cart State */}
          <div>
            <h3 className="font-semibold mb-2">Cart State</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-neutral-50 rounded">
                <div className="font-medium">Total Items</div>
                <div className="text-lg font-bold">{totalItems}</div>
              </div>
              <div className="p-3 bg-neutral-50 rounded">
                <div className="font-medium">Total Amount</div>
                <div className="text-lg font-bold">₴{totalAmount}</div>
              </div>
              <div className="p-3 bg-neutral-50 rounded">
                <div className="font-medium">Loading</div>
                <Badge variant={isLoading ? "destructive" : "success"}>
                  {isLoading ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="p-3 bg-neutral-50 rounded">
                <div className="font-medium">Valid</div>
                <Badge variant={validation.isValid ? "success" : "destructive"}>
                  {validation.isValid ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Last Error */}
          {lastError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-medium text-red-800">Last Error:</div>
              <div className="text-red-700">{lastError}</div>
            </div>
          )}

          {/* Validation Errors */}
          {validation.errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-medium text-red-800">Validation Errors:</div>
              <ul className="text-red-700 text-sm mt-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cart Items */}
          <div>
            <h3 className="font-semibold mb-2">Cart Items ({items.length})</h3>
            {items.length === 0 ? (
              <div className="p-4 bg-neutral-50 rounded text-center text-neutral-600">
                No items in cart
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={item.product.id} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-neutral-600">
                          ID: {item.product.id} | Shop: {item.shopId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ₴{item.product.price} × {item.quantity}
                        </div>
                        <div className="text-sm text-neutral-600">
                          Total: ₴{item.product.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={addTestProduct}>Add Test Product</Button>
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                console.log("Current cart state:", state);
                console.log(
                  "LocalStorage cart:",
                  localStorage.getItem("fiora_cart")
                );
              }}
            >
              Log State
            </Button>
          </div>

          {/* LocalStorage Info */}
          <div>
            <h3 className="font-semibold mb-2">LocalStorage</h3>
            <div className="p-3 bg-neutral-50 rounded">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(
                  JSON.parse(localStorage.getItem("fiora_cart") || "[]"),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
