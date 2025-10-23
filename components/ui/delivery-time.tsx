"use client";

import React from "react";
import { Clock, AlertCircle, CheckCircle, Info } from "lucide-react";
import {
  DeliveryEstimate,
  formatDeliveryTime,
  formatDeliveryTimeRange,
  getDeliveryTimeColor,
} from "@/lib/delivery-estimation";
import { Badge } from "./badge";

interface DeliveryTimeProps {
  estimate: DeliveryEstimate;
  variant?: "simple" | "detailed" | "compact";
  showConfidence?: boolean;
  showFactors?: boolean;
  className?: string;
}

export function DeliveryTime({
  estimate,
  variant = "simple",
  showConfidence = false,
  showFactors = false,
  className = "",
}: DeliveryTimeProps) {
  const timeColor = getDeliveryTimeColor(estimate.estimatedMinutes);

  const getConfidenceIcon = () => {
    switch (estimate.confidence) {
      case "high":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "medium":
        return <Info className="h-3 w-3 text-yellow-500" />;
      case "low":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
  };

  const getConfidenceColor = () => {
    switch (estimate.confidence) {
      case "high":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-red-600 bg-red-50";
    }
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1 text-sm ${className}`}>
        <Clock className="h-3 w-3 text-neutral-500" />
        <span className={timeColor}>
          {formatDeliveryTime(estimate.estimatedMinutes)}
        </span>
        {showConfidence && (
          <div className="flex items-center gap-1">{getConfidenceIcon()}</div>
        )}
      </div>
    );
  }

  if (variant === "simple") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="h-4 w-4 text-neutral-500" />
        <span className={`font-medium ${timeColor}`}>
          {formatDeliveryTimeRange(estimate)}
        </span>
        {showConfidence && (
          <Badge
            variant="outline"
            className={`text-xs ${getConfidenceColor()}`}
          >
            {estimate.confidence} confidence
          </Badge>
        )}
      </div>
    );
  }

  // Detailed variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-600">Estimated delivery</span>
        </div>
        <span className={`font-semibold ${timeColor}`}>
          {formatDeliveryTimeRange(estimate)}
        </span>
      </div>

      {showConfidence && (
        <div className="flex items-center gap-2">
          {getConfidenceIcon()}
          <span className="text-xs text-neutral-500">
            {estimate.confidence} confidence estimate
          </span>
        </div>
      )}

      {showFactors && estimate.factors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-neutral-700">
            Factors affecting delivery time:
          </h4>
          <ul className="space-y-1">
            {estimate.factors.slice(0, 3).map((factor, index) => (
              <li
                key={index}
                className="text-xs text-neutral-600 flex items-start gap-2"
              >
                <span className="text-neutral-400 mt-0.5">•</span>
                <span>{factor}</span>
              </li>
            ))}
            {estimate.factors.length > 3 && (
              <li className="text-xs text-neutral-500">
                +{estimate.factors.length - 3} more factors
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="text-xs text-neutral-500 bg-neutral-50 rounded p-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Preparation:</span>{" "}
            {formatDeliveryTime(estimate.breakdown.preparationTime)}
          </div>
          <div>
            <span className="font-medium">Travel:</span>{" "}
            {formatDeliveryTime(estimate.breakdown.travelTime)}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SimpleDeliveryTimeProps {
  minutes: number;
  className?: string;
  showIcon?: boolean;
}

export function SimpleDeliveryTime({
  minutes,
  className = "",
  showIcon = true,
}: SimpleDeliveryTimeProps) {
  const timeColor = getDeliveryTimeColor(minutes);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showIcon && <Clock className="h-4 w-4 text-neutral-500" />}
      <span className={timeColor}>{formatDeliveryTime(minutes)}</span>
    </div>
  );
}
