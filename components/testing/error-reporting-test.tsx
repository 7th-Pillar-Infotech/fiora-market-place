"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, RefreshCw, Trash2, Download, Eye, EyeOff } from "lucide-react";
import {
  useErrorHandler,
  ErrorCodes,
  createNetworkError,
  createValidationError,
  createNotFoundError,
  createCartError,
  AppError,
} from "@/lib/error-handling";

export function ErrorReportingTest() {
  const { handleError, getRecentErrors, clearErrors } = useErrorHandler();
  const [errors, setErrors] = useState<AppError[]>([]);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load initial errors
    setErrors(getRecentErrors(20));
  }, [getRecentErrors]);

  const refreshErrors = () => {
    setErrors(getRecentErrors(20));
  };

  const handleClearErrors = () => {
    clearErrors();
    setErrors([]);
    setShowDetails({});
  };

  const toggleDetails = (errorId: string) => {
    setShowDetails((prev) => ({
      ...prev,
      [errorId]: !prev[errorId],
    }));
  };

  const exportErrors = () => {
    const errorData = JSON.stringify(errors, null, 2);
    const blob = new Blob([errorData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fiora-errors-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Test error generators
  const testErrors = [
    {
      name: "Network Error",
      description: "Simulate a network connection failure",
      generate: () => {
        const error = createNetworkError({ url: "/api/shops", method: "GET" });
        handleError(error, "test-network");
        refreshErrors();
      },
    },
    {
      name: "Validation Error",
      description: "Simulate form validation failure",
      generate: () => {
        const error = createValidationError("email", "Invalid email format");
        handleError(error, "test-validation");
        refreshErrors();
      },
    },
    {
      name: "Not Found Error",
      description: "Simulate resource not found",
      generate: () => {
        const error = createNotFoundError("Product");
        handleError(error, "test-not-found");
        refreshErrors();
      },
    },
    {
      name: "Cart Error",
      description: "Simulate shopping cart issue",
      generate: () => {
        const error = createCartError("Product out of stock", {
          productId: "test-123",
        });
        handleError(error, "test-cart");
        refreshErrors();
      },
    },
    {
      name: "Generic JavaScript Error",
      description: "Simulate unexpected JavaScript error",
      generate: () => {
        const error = new Error("Cannot read property 'name' of undefined");
        handleError(error, "test-generic");
        refreshErrors();
      },
    },
    {
      name: "Async Error",
      description: "Simulate promise rejection",
      generate: async () => {
        try {
          await Promise.reject(new Error("Async operation failed"));
        } catch (error) {
          handleError(error as Error, "test-async");
          refreshErrors();
        }
      },
    },
  ];

  const getErrorBadgeVariant = (code: string) => {
    switch (code) {
      case ErrorCodes.NETWORK_ERROR:
      case ErrorCodes.TIMEOUT_ERROR:
        return "destructive";
      case ErrorCodes.VALIDATION_ERROR:
      case ErrorCodes.REQUIRED_FIELD:
        return "warning";
      case ErrorCodes.NOT_FOUND:
        return "secondary";
      case ErrorCodes.CART_ERROR:
      case ErrorCodes.PAYMENT_ERROR:
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Error Handling & Reporting
          </CardTitle>
          <p className="text-sm text-neutral-600">
            Test error handling, logging, and user feedback mechanisms.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">{errors.length}</span> errors
                logged
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportErrors}
                disabled={errors.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshErrors}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearErrors}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Test Error Generators */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Generate Test Errors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {testErrors.map((test, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={test.generate}
                  className="h-auto p-3 text-left justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">{test.name}</div>
                    <div className="text-xs text-neutral-600 mt-1">
                      {test.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Error List */}
          <div className="space-y-3">
            <h3 className="font-semibold">Recent Errors</h3>
            {errors.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No errors logged yet. Generate some test errors above.
              </div>
            ) : (
              errors.map((error, index) => {
                const errorId = `${error.timestamp}-${index}`;
                const showDetail = showDetails[errorId];

                return (
                  <div
                    key={errorId}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getErrorBadgeVariant(error.code)}>
                            {error.code}
                          </Badge>
                          <span className="text-sm text-neutral-500">
                            {formatTimestamp(error.timestamp)}
                          </span>
                          {error.recoverable && (
                            <Badge variant="outline" className="text-xs">
                              Recoverable
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium text-sm mb-1">
                          {error.userMessage}
                        </div>
                        <div className="text-xs text-neutral-600">
                          {error.message}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(errorId)}
                        className="flex items-center gap-1"
                      >
                        {showDetail ? (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3" />
                            Details
                          </>
                        )}
                      </Button>
                    </div>

                    {showDetail && error.details && (
                      <div className="border-t pt-3">
                        <div className="text-xs font-medium text-neutral-700 mb-2">
                          Error Details:
                        </div>
                        <pre className="text-xs bg-neutral-100 p-3 rounded overflow-auto max-h-40">
                          {JSON.stringify(error.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Error Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(ErrorCodes).map((code) => {
              const count = errors.filter((e) => e.code === code).length;
              return (
                <div
                  key={code}
                  className="text-center p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="text-lg font-bold text-neutral-900">
                    {count}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {code.replace(/_/g, " ")}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
