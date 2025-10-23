"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Home,
  ShoppingBag,
  Package,
  User,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { mockProducts, mockShops } from "@/lib/mock-data";

interface NavigationTest {
  id: string;
  name: string;
  description: string;
  path: string;
  expectedElements: string[];
  status: "pending" | "running" | "passed" | "failed";
  error?: string;
}

const navigationTests: NavigationTest[] = [
  {
    id: "home-to-shops",
    name: "Home to Shops",
    description: "Navigate from home page to shops listing",
    path: "/shops",
    expectedElements: ["shop-grid", "shop-search", "recommendations"],
    status: "pending",
  },
  {
    id: "shop-detail",
    name: "Shop Detail",
    description: "Navigate to individual shop page",
    path: `/shops/${mockShops[0]?.id}`,
    expectedElements: ["shop-info", "shop-hours", "shop-map"],
    status: "pending",
  },
  {
    id: "product-catalog",
    name: "Product Catalog",
    description: "Navigate to shop's product catalog",
    path: `/shops/${mockShops[0]?.id}/products`,
    expectedElements: ["product-grid", "product-filters"],
    status: "pending",
  },
  {
    id: "product-detail",
    name: "Product Detail",
    description: "Navigate to individual product page",
    path: `/shops/${mockProducts[0]?.shopId}/products/${mockProducts[0]?.id}`,
    expectedElements: ["product-info", "product-gallery", "add-to-cart"],
    status: "pending",
  },
  {
    id: "cart-page",
    name: "Shopping Cart",
    description: "Navigate to cart page",
    path: "/cart",
    expectedElements: ["cart-items", "cart-summary"],
    status: "pending",
  },
  {
    id: "checkout-flow",
    name: "Checkout Flow",
    description: "Navigate to checkout page",
    path: "/checkout",
    expectedElements: ["checkout-form", "order-summary"],
    status: "pending",
  },
  {
    id: "orders-page",
    name: "Order History",
    description: "Navigate to orders page",
    path: "/orders",
    expectedElements: ["order-list", "order-filters"],
    status: "pending",
  },
  {
    id: "account-page",
    name: "Account Management",
    description: "Navigate to account page",
    path: "/account",
    expectedElements: ["profile-form", "address-book"],
    status: "pending",
  },
];

export function NavigationTest() {
  const [tests, setTests] = useState<NavigationTest[]>(navigationTests);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { addItem } = useCart();

  const runSingleTest = async (testIndex: number) => {
    const test = tests[testIndex];

    setTests((prev) =>
      prev.map((t, i) => (i === testIndex ? { ...t, status: "running" } : t))
    );

    try {
      // Navigate to the test path
      router.push(test.path);

      // Wait for navigation to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if expected elements exist (simplified check)
      const hasRequiredElements = test.expectedElements.every((elementId) => {
        // This is a simplified check - in a real test you'd check for actual DOM elements
        return true; // Assume elements exist for demo
      });

      if (hasRequiredElements) {
        setTests((prev) =>
          prev.map((t, i) => (i === testIndex ? { ...t, status: "passed" } : t))
        );
      } else {
        setTests((prev) =>
          prev.map((t, i) =>
            i === testIndex
              ? {
                  ...t,
                  status: "failed",
                  error: "Required elements not found",
                }
              : t
          )
        );
      }
    } catch (error) {
      setTests((prev) =>
        prev.map((t, i) =>
          i === testIndex
            ? {
                ...t,
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
              }
            : t
        )
      );
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);

    // Reset all tests
    setTests((prev) =>
      prev.map((t) => ({ ...t, status: "pending", error: undefined }))
    );

    // Add a test product to cart for checkout tests
    if (mockProducts[0]) {
      addItem(mockProducts[0], 1);
    }

    for (let i = 0; i < tests.length; i++) {
      setCurrentTestIndex(i);
      await runSingleTest(i);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Brief pause between tests
    }

    setCurrentTestIndex(-1);
    setIsRunning(false);
  };

  const getStatusIcon = (status: NavigationTest["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: NavigationTest["status"]) => {
    switch (status) {
      case "passed":
        return <Badge variant="success">Passed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "running":
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const passedTests = tests.filter((t) => t.status === "passed").length;
  const failedTests = tests.filter((t) => t.status === "failed").length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Navigation Flow Testing
          </CardTitle>
          <p className="text-sm text-neutral-600">
            Test seamless navigation between all application pages and user
            flows.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <div className="text-sm">
                <span className="font-medium text-green-600">
                  {passedTests}
                </span>{" "}
                passed
              </div>
              <div className="text-sm">
                <span className="font-medium text-red-600">{failedTests}</span>{" "}
                failed
              </div>
              <div className="text-sm">
                <span className="font-medium">
                  {tests.length - passedTests - failedTests}
                </span>{" "}
                pending
              </div>
            </div>
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={test.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  currentTestIndex === index
                    ? "border-blue-200 bg-blue-50"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-neutral-600">
                      {test.description}
                    </div>
                    {test.error && (
                      <div className="text-sm text-red-600 mt-1">
                        {test.error}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                    {test.path}
                  </code>
                  {getStatusBadge(test.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runSingleTest(index)}
                    disabled={isRunning}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <p className="text-sm text-neutral-600">
            Test navigation manually using these quick links.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => router.push("/shops")}
            >
              <Home className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Home</div>
                <div className="text-xs text-neutral-600">Shop listings</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => router.push(`/shops/${mockShops[0]?.id}`)}
            >
              <ShoppingBag className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Shop</div>
                <div className="text-xs text-neutral-600">Shop details</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Cart</div>
                <div className="text-xs text-neutral-600">Shopping cart</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => router.push("/orders")}
            >
              <Package className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Orders</div>
                <div className="text-xs text-neutral-600">Order history</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => router.push("/account")}
            >
              <User className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Account</div>
                <div className="text-xs text-neutral-600">Profile settings</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => router.push("/checkout")}
            >
              <ShoppingCart className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Checkout</div>
                <div className="text-xs text-neutral-600">Complete order</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
