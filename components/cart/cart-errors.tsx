"use client";

import React from "react";
import { AlertTriangle, X, Info } from "lucide-react";
import { ValidationError } from "@/lib/cart-validation";
import { Button } from "@/components/ui/button";

interface CartErrorsProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  lastError?: string | null;
  onClearError?: () => void;
  className?: string;
}

export function CartErrors({
  errors,
  warnings,
  lastError,
  onClearError,
  className = "",
}: CartErrorsProps) {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const hasLastError = lastError !== null;

  if (!hasErrors && !hasWarnings && !hasLastError) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Last Error (from failed operations) */}
      {hasLastError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-red-800">{lastError}</p>
            </div>
            {onClearError && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearError}
                className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 flex-shrink-0"
                aria-label="Clear error"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Cart Issues
              </h4>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {hasWarnings && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-amber-800 mb-2">
                Heads Up
              </h4>
              <ul className="space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-amber-700">
                    • {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
