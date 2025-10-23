"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Database,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { storage, STORAGE_KEYS } from "@/lib/utils";
import { mockProducts, mockOrders } from "@/lib/mock-data";

interface PersistenceTest {
  id: string;
  name: string;
  description: string;
  storageKey: string;
  status: "pending" | "running" | "passed" | "failed";
  error?: string;
  testData?: any;
}

const persistenceTests: PersistenceTest[] = [
  {
    id: "cart-persistence",
    name: "Cart Persistence",
    description: "Test cart items persist across browser sessions",
    storageKey: STORAGE_KEYS.CART,
    status: "pending",
  },
  {
    id: "browsing-history",
    name: "Browsing History",
    description: "Test browsing history is maintained",
    storageKey: STORAGE_KEYS.BROWSING_HISTORY,
    status: "pending",
  },
  {
    id: "user-preferences",
    name: "User Preferences",
    description: "Test user preferences are saved",
    storageKey: STORAGE_KEYS.PREFERENCES,
    status: "pending",
  },
  {
    id: "order-history",
    name: "Order History",
    description: "Test order history persistence",
    storageKey: STORAGE_KEYS.ORDERS,
    status: "pending",
  },
  {
    id: "customer-data",
    name: "Customer Data",
    description: "Test customer profile data persistence",
    storageKey: STORAGE_KEYS.CUSTOMER,
    status: "pending",
  },
  {
    id: "saved-addresses",
    name: "Saved Addresses",
    description: "Test saved addresses persistence",
    storageKey: STORAGE_KEYS.ADDRESSES,
    status: "pending",
  },
];

export function DataPersistenceTest() {
  const [tests, setTests] = useState<PersistenceTest[]>(persistenceTests);
  const [isRunning, setIsRunning] = useState(false);
  const { addItem, clearCart } = useCart();

  const generateTestData = (storageKey: string) => {
    switch (storageKey) {
      case STORAGE_KEYS.CART:
        return [
          {
            product: mockProducts[0],
            quantity: 2,
            shopId: mockProducts[0]?.shopId,
          },
        ];
      case STORAGE_KEYS.BROWSING_HISTORY:
        return [mockProducts[0]?.id, mockProducts[1]?.id];
      case STORAGE_KEYS.PREFERENCES:
        return {
          notifications: true,
          emailUpdates: false,
          theme: "light",
          language: "uk",
        };
      case STORAGE_KEYS.ORDERS:
        return [mockOrders[0]];
      case STORAGE_KEYS.CUSTOMER:
        return {
          id: "test-customer",
          name: "Test User",
          email: "test@example.com",
          phone: "+380123456789",
        };
      case STORAGE_KEYS.ADDRESSES:
        return [
          {
            id: "addr-1",
            street: "Khreshchatyk Street 1",
            city: "Kyiv",
            postalCode: "01001",
            isDefault: true,
          },
        ];
      default:
        return { test: true };
    }
  };

  const runSingleTest = async (testIndex: number) => {
    const test = tests[testIndex];

    setTests((prev) =>
      prev.map((t, i) => (i === testIndex ? { ...t, status: "running" } : t))
    );

    try {
      // Generate test data
      const testData = generateTestData(test.storageKey);

      // Clear existing data
      storage.remove(test.storageKey);

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Set test data
      storage.set(test.storageKey, testData);

      // Wait a bit more
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Retrieve and verify data
      const retrievedData = storage.get(test.storageKey, null);

      if (JSON.stringify(retrievedData) === JSON.stringify(testData)) {
        setTests((prev) =>
          prev.map((t, i) =>
            i === testIndex
              ? {
                  ...t,
                  status: "passed",
                  testData: retrievedData,
                }
              : t
          )
        );
      } else {
        setTests((prev) =>
          prev.map((t, i) =>
            i === testIndex
              ? {
                  ...t,
                  status: "failed",
                  error: "Data mismatch after retrieval",
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
      prev.map((t) => ({
        ...t,
        status: "pending",
        error: undefined,
        testData: undefined,
      }))
    );

    for (let i = 0; i < tests.length; i++) {
      await runSingleTest(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setIsRunning(false);
  };

  const clearAllData = () => {
    tests.forEach((test) => {
      storage.remove(test.storageKey);
    });
    clearCart();
    setTests((prev) =>
      prev.map((t) => ({
        ...t,
        status: "pending",
        error: undefined,
        testData: undefined,
      }))
    );
  };

  const getStatusIcon = (status: PersistenceTest["status"]) => {
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

  const getStatusBadge = (status: PersistenceTest["status"]) => {
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
            <Database className="h-5 w-5" />
            Data Persistence Testing
          </CardTitle>
          <p className="text-sm text-neutral-600">
            Test data persistence across browser sessions using localStorage.
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearAllData}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
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
                    <RefreshCw className="h-4 w-4" />
                    Run All Tests
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-4 rounded-lg border border-neutral-200"
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
                    {test.testData && (
                      <details className="mt-2">
                        <summary className="text-xs text-neutral-500 cursor-pointer">
                          View test data
                        </summary>
                        <pre className="text-xs bg-neutral-100 p-2 rounded mt-1 overflow-auto max-h-32">
                          {JSON.stringify(test.testData, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                    {test.storageKey}
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

      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Storage State</CardTitle>
          <p className="text-sm text-neutral-600">
            View current localStorage data for debugging.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(STORAGE_KEYS).map(([key, storageKey]) => {
              const data = storage.get(storageKey, null);
              const hasData = data !== null && data !== undefined;

              return (
                <div key={key} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{key}</div>
                    <Badge variant={hasData ? "secondary" : "outline"}>
                      {hasData ? "Has Data" : "Empty"}
                    </Badge>
                  </div>
                  <code className="text-xs text-neutral-600 block mb-2">
                    {storageKey}
                  </code>
                  {hasData && (
                    <details>
                      <summary className="text-xs text-neutral-500 cursor-pointer">
                        View data
                      </summary>
                      <pre className="text-xs bg-neutral-50 p-2 rounded mt-1 overflow-auto max-h-24">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
