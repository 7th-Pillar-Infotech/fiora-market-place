/**
 * Enhanced Error Handling Utilities
 * Provides comprehensive error handling, logging, and user feedback
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userMessage?: string;
  recoverable?: boolean;
}

export class FioraError extends Error {
  public code: string;
  public details?: any;
  public userMessage?: string;
  public recoverable: boolean;
  public timestamp: Date;

  constructor(
    code: string,
    message: string,
    options: {
      details?: any;
      userMessage?: string;
      recoverable?: boolean;
    } = {}
  ) {
    super(message);
    this.name = "FioraError";
    this.code = code;
    this.details = options.details;
    this.userMessage = options.userMessage || this.getDefaultUserMessage(code);
    this.recoverable = options.recoverable ?? true;
    this.timestamp = new Date();
  }

  private getDefaultUserMessage(code: string): string {
    const messages: Record<string, string> = {
      NETWORK_ERROR:
        "Unable to connect. Please check your internet connection.",
      VALIDATION_ERROR: "Please check your input and try again.",
      NOT_FOUND: "The requested item could not be found.",
      PERMISSION_DENIED: "You don't have permission to perform this action.",
      SERVER_ERROR: "Something went wrong on our end. Please try again later.",
      CART_ERROR:
        "There was an issue with your cart. Please refresh and try again.",
      PAYMENT_ERROR: "Payment processing failed. Please try again.",
      ORDER_ERROR: "There was an issue processing your order.",
    };

    return messages[code] || "An unexpected error occurred. Please try again.";
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      userMessage: this.userMessage,
      recoverable: this.recoverable,
    };
  }
}

// Error types for different scenarios
export const ErrorCodes = {
  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  OFFLINE_ERROR: "OFFLINE_ERROR",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  REQUIRED_FIELD: "REQUIRED_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  RESOURCE_UNAVAILABLE: "RESOURCE_UNAVAILABLE",

  // Business logic errors
  CART_ERROR: "CART_ERROR",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  ORDER_ERROR: "ORDER_ERROR",
  INVENTORY_ERROR: "INVENTORY_ERROR",

  // System errors
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle and log errors
  handle(error: Error | FioraError, context?: string): AppError {
    let appError: AppError;

    if (error instanceof FioraError) {
      appError = error.toJSON();
    } else {
      // Convert generic error to AppError
      appError = {
        code: this.categorizeError(error),
        message: error.message,
        details: { originalError: error.name, context },
        timestamp: new Date(),
        userMessage: this.getUserMessage(error),
        recoverable: true,
      };
    }

    // Log error
    this.log(appError);

    // Report to external service in production
    if (process.env.NODE_ENV === "production") {
      this.reportError(appError);
    }

    return appError;
  }

  private categorizeError(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return ErrorCodes.NETWORK_ERROR;
    }
    if (message.includes("timeout")) {
      return ErrorCodes.TIMEOUT_ERROR;
    }
    if (message.includes("not found") || message.includes("404")) {
      return ErrorCodes.NOT_FOUND;
    }
    if (message.includes("permission") || message.includes("unauthorized")) {
      return ErrorCodes.PERMISSION_DENIED;
    }
    if (message.includes("validation") || message.includes("invalid")) {
      return ErrorCodes.VALIDATION_ERROR;
    }

    return ErrorCodes.UNKNOWN_ERROR;
  }

  private getUserMessage(error: Error): string {
    const code = this.categorizeError(error);
    return (
      new FioraError(code, error.message).userMessage || "An error occurred"
    );
  }

  private log(error: AppError): void {
    console.error("Error logged:", error);

    // Keep last 100 errors in memory
    this.errorLog.push(error);
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }

    // Store in localStorage for debugging
    try {
      const storedErrors = JSON.parse(
        localStorage.getItem("fiora_errors") || "[]"
      );
      storedErrors.push(error);
      // Keep last 50 errors in storage
      if (storedErrors.length > 50) {
        storedErrors.shift();
      }
      localStorage.setItem("fiora_errors", JSON.stringify(storedErrors));
    } catch (e) {
      console.warn("Failed to store error in localStorage:", e);
    }
  }

  private reportError(error: AppError): void {
    // In a real app, send to error reporting service
    // Example: Sentry, LogRocket, etc.
    console.log("Would report error to external service:", error);
  }

  // Get recent errors for debugging
  getRecentErrors(count: number = 10): AppError[] {
    return this.errorLog.slice(-count);
  }

  // Clear error log
  clearErrors(): void {
    this.errorLog = [];
    try {
      localStorage.removeItem("fiora_errors");
    } catch (e) {
      console.warn("Failed to clear errors from localStorage:", e);
    }
  }
}

// Utility functions for common error scenarios
export function createNetworkError(details?: any): FioraError {
  return new FioraError(ErrorCodes.NETWORK_ERROR, "Network request failed", {
    details,
    userMessage:
      "Unable to connect. Please check your internet connection and try again.",
    recoverable: true,
  });
}

export function createValidationError(
  field: string,
  message: string
): FioraError {
  return new FioraError(
    ErrorCodes.VALIDATION_ERROR,
    `Validation failed for ${field}: ${message}`,
    {
      details: { field, validationMessage: message },
      userMessage: `Please check the ${field} field and try again.`,
      recoverable: true,
    }
  );
}

export function createNotFoundError(resource: string): FioraError {
  return new FioraError(ErrorCodes.NOT_FOUND, `${resource} not found`, {
    details: { resource },
    userMessage: `The ${resource.toLowerCase()} you're looking for could not be found.`,
    recoverable: false,
  });
}

export function createCartError(message: string, details?: any): FioraError {
  return new FioraError(ErrorCodes.CART_ERROR, message, {
    details,
    userMessage:
      "There was an issue with your cart. Please refresh and try again.",
    recoverable: true,
  });
}

// React hook for error handling
export function useErrorHandler() {
  const errorHandler = ErrorHandler.getInstance();

  const handleError = React.useCallback(
    (error: Error | FioraError, context?: string) => {
      return errorHandler.handle(error, context);
    },
    [errorHandler]
  );

  const getRecentErrors = React.useCallback(
    (count?: number) => {
      return errorHandler.getRecentErrors(count);
    },
    [errorHandler]
  );

  const clearErrors = React.useCallback(() => {
    errorHandler.clearErrors();
  }, [errorHandler]);

  return {
    handleError,
    getRecentErrors,
    clearErrors,
  };
}

// Global error handler setup
export function setupGlobalErrorHandling(): void {
  const errorHandler = ErrorHandler.getInstance();

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    errorHandler.handle(
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason)),
      "unhandledrejection"
    );
  });

  // Handle global errors
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
    errorHandler.handle(event.error || new Error(event.message), "global");
  });
}

import React from "react";
