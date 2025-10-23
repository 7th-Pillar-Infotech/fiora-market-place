/**
 * Delivery time estimation utilities for the Fiora Customer Dashboard
 * Implements algorithms for calculating realistic delivery times based on various factors
 */

import { Shop, Product, CartItem, Address } from "./types";

/**
 * Configuration constants for delivery time calculations
 */
export const DELIVERY_CONFIG = {
  // Base travel time per kilometer (minutes)
  TRAVEL_TIME_PER_KM: 3,

  // Shop preparation time ranges (minutes)
  PREPARATION_TIME: {
    MIN: 15,
    MAX: 45,
    PEAK_MULTIPLIER: 1.5, // During peak hours
  },

  // Peak hours configuration
  PEAK_HOURS: [
    { start: 8, end: 10 }, // Morning rush
    { start: 12, end: 14 }, // Lunch time
    { start: 17, end: 19 }, // Evening rush
  ],

  // Weekend multiplier
  WEEKEND_MULTIPLIER: 1.2,

  // Order volume impact
  VOLUME_IMPACT: {
    LOW: 1.0, // 0-5 orders
    MEDIUM: 1.2, // 6-15 orders
    HIGH: 1.5, // 16+ orders
  },

  // Weather impact (simulated)
  WEATHER_IMPACT: {
    CLEAR: 1.0,
    RAIN: 1.3,
    SNOW: 1.6,
  },

  // Maximum delivery time cap (minutes)
  MAX_DELIVERY_TIME: 180, // 3 hours

  // Minimum delivery time (minutes)
  MIN_DELIVERY_TIME: 20,
} as const;

/**
 * Interface for delivery estimation parameters
 */
export interface DeliveryEstimationParams {
  shop: Shop;
  customerAddress?: Address;
  orderTime?: Date;
  items?: CartItem[];
  currentOrderVolume?: number;
}

/**
 * Interface for delivery estimation result
 */
export interface DeliveryEstimate {
  estimatedMinutes: number;
  estimatedDeliveryTime: Date;
  breakdown: {
    preparationTime: number;
    travelTime: number;
    volumeDelay: number;
    peakHourDelay: number;
    weatherDelay: number;
  };
  confidence: "high" | "medium" | "low";
  factors: string[];
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if current time is during peak hours
 */
function isPeakHour(date: Date): boolean {
  const hour = date.getHours();
  return DELIVERY_CONFIG.PEAK_HOURS.some(
    (peak) => hour >= peak.start && hour < peak.end
  );
}

/**
 * Check if current day is weekend
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Get simulated weather impact
 */
function getWeatherImpact(): number {
  // Simulate weather conditions with probabilities
  const random = Math.random();
  if (random < 0.7) return DELIVERY_CONFIG.WEATHER_IMPACT.CLEAR; // 70% clear
  if (random < 0.9) return DELIVERY_CONFIG.WEATHER_IMPACT.RAIN; // 20% rain
  return DELIVERY_CONFIG.WEATHER_IMPACT.SNOW; // 10% snow
}

/**
 * Calculate shop preparation time based on order complexity and current load
 */
function calculatePreparationTime(
  shop: Shop,
  items: CartItem[] = [],
  currentOrderVolume: number = 0,
  orderTime: Date = new Date()
): { time: number; factors: string[] } {
  const factors: string[] = [];
  let baseTime = DELIVERY_CONFIG.PREPARATION_TIME.MIN;

  // Base preparation time varies by shop rating (higher rated shops are more efficient)
  const ratingMultiplier = Math.max(0.8, 2 - shop.rating / 5);
  baseTime *= ratingMultiplier;

  if (shop.rating < 4.0) {
    factors.push("Lower rated shop may need more preparation time");
  }

  // Add time based on order complexity
  if (items.length > 0) {
    const complexityBonus = Math.min(20, items.length * 2); // 2 min per item, max 20 min
    baseTime += complexityBonus;

    if (items.length > 5) {
      factors.push(
        `Large order (${items.length} items) requires additional preparation`
      );
    }

    // Check for complex categories that take longer
    const hasComplexItems = items.some(
      (item) =>
        item.product.category === "arrangements" ||
        item.product.category === "gifts"
    );

    if (hasComplexItems) {
      baseTime += 10;
      factors.push("Custom arrangements require additional preparation time");
    }
  }

  // Peak hour impact
  if (isPeakHour(orderTime)) {
    baseTime *= DELIVERY_CONFIG.PREPARATION_TIME.PEAK_MULTIPLIER;
    factors.push("Peak hour ordering may increase preparation time");
  }

  // Weekend impact
  if (isWeekend(orderTime)) {
    baseTime *= DELIVERY_CONFIG.WEEKEND_MULTIPLIER;
    factors.push("Weekend orders may take longer due to higher demand");
  }

  // Current order volume impact
  let volumeMultiplier: number = DELIVERY_CONFIG.VOLUME_IMPACT.LOW;
  if (currentOrderVolume > 15) {
    volumeMultiplier = DELIVERY_CONFIG.VOLUME_IMPACT.HIGH;
    factors.push("High order volume may cause delays");
  } else if (currentOrderVolume > 5) {
    volumeMultiplier = DELIVERY_CONFIG.VOLUME_IMPACT.MEDIUM;
    factors.push("Moderate order volume may cause slight delays");
  }

  baseTime *= volumeMultiplier;

  // Ensure within reasonable bounds
  const finalTime = Math.min(
    Math.max(baseTime, DELIVERY_CONFIG.PREPARATION_TIME.MIN),
    DELIVERY_CONFIG.PREPARATION_TIME.MAX * 2 // Allow up to 90 minutes in extreme cases
  );

  return { time: Math.round(finalTime), factors };
}

/**
 * Calculate travel time based on distance and current conditions
 */
function calculateTravelTime(
  distance: number,
  orderTime: Date = new Date()
): { time: number; factors: string[] } {
  const factors: string[] = [];
  let travelTime = distance * DELIVERY_CONFIG.TRAVEL_TIME_PER_KM;

  // Peak hour traffic impact
  if (isPeakHour(orderTime)) {
    travelTime *= 1.4; // 40% longer during peak hours
    factors.push("Peak hour traffic may increase delivery time");
  }

  // Weekend traffic (usually lighter, but some areas busier)
  if (isWeekend(orderTime)) {
    travelTime *= 0.9; // 10% faster on weekends
    factors.push("Weekend traffic is typically lighter");
  }

  // Weather impact
  const weatherMultiplier = getWeatherImpact();
  if (weatherMultiplier > 1.0) {
    travelTime *= weatherMultiplier;
    if (weatherMultiplier === DELIVERY_CONFIG.WEATHER_IMPACT.RAIN) {
      factors.push("Rainy weather may slow down delivery");
    } else if (weatherMultiplier === DELIVERY_CONFIG.WEATHER_IMPACT.SNOW) {
      factors.push("Snowy conditions may significantly delay delivery");
    }
  }

  // Minimum travel time for very close distances
  travelTime = Math.max(travelTime, 5); // At least 5 minutes travel time

  return { time: Math.round(travelTime), factors };
}

/**
 * Determine confidence level based on various factors
 */
function calculateConfidence(
  shop: Shop,
  distance: number,
  orderTime: Date,
  factors: string[]
): "high" | "medium" | "low" {
  let confidenceScore = 100;

  // Distance factor
  if (distance > 10) confidenceScore -= 20;
  else if (distance > 5) confidenceScore -= 10;

  // Shop rating factor
  if (shop.rating < 3.5) confidenceScore -= 20;
  else if (shop.rating < 4.0) confidenceScore -= 10;

  // Time factors
  if (isPeakHour(orderTime)) confidenceScore -= 15;
  if (isWeekend(orderTime)) confidenceScore -= 5;

  // Weather factor
  const weatherImpact = getWeatherImpact();
  if (weatherImpact > 1.3) confidenceScore -= 20;
  else if (weatherImpact > 1.0) confidenceScore -= 10;

  // Number of complicating factors
  confidenceScore -= factors.length * 3;

  if (confidenceScore >= 80) return "high";
  if (confidenceScore >= 60) return "medium";
  return "low";
}

/**
 * Main function to estimate delivery time
 */
export function estimateDeliveryTime(
  params: DeliveryEstimationParams
): DeliveryEstimate {
  const {
    shop,
    customerAddress,
    orderTime = new Date(),
    items = [],
    currentOrderVolume = Math.floor(Math.random() * 20), // Simulate current order volume
  } = params;

  // Calculate distance
  const distance = customerAddress
    ? calculateDistance(shop.address.coordinates, customerAddress.coordinates)
    : shop.distance; // Use shop's default distance if no customer address

  // Calculate preparation time
  const preparation = calculatePreparationTime(
    shop,
    items,
    currentOrderVolume,
    orderTime
  );

  // Calculate travel time
  const travel = calculateTravelTime(distance, orderTime);

  // Combine all factors
  const allFactors = [...preparation.factors, ...travel.factors];

  // Calculate total time
  let totalMinutes = preparation.time + travel.time;

  // Apply caps
  totalMinutes = Math.min(
    Math.max(totalMinutes, DELIVERY_CONFIG.MIN_DELIVERY_TIME),
    DELIVERY_CONFIG.MAX_DELIVERY_TIME
  );

  // Calculate estimated delivery time
  const estimatedDeliveryTime = new Date(
    orderTime.getTime() + totalMinutes * 60 * 1000
  );

  // Determine confidence
  const confidence = calculateConfidence(shop, distance, orderTime, allFactors);

  return {
    estimatedMinutes: Math.round(totalMinutes),
    estimatedDeliveryTime,
    breakdown: {
      preparationTime: preparation.time,
      travelTime: travel.time,
      volumeDelay:
        currentOrderVolume > 5 ? Math.round((currentOrderVolume - 5) * 2) : 0,
      peakHourDelay: isPeakHour(orderTime)
        ? Math.round(preparation.time * 0.3)
        : 0,
      weatherDelay: Math.round(travel.time * (getWeatherImpact() - 1)),
    },
    confidence,
    factors: allFactors,
  };
}

/**
 * Estimate delivery time for multiple items from different shops
 */
export function estimateCartDeliveryTime(
  cartItems: CartItem[],
  shops: Shop[],
  customerAddress?: Address,
  orderTime: Date = new Date()
): DeliveryEstimate {
  if (cartItems.length === 0) {
    return {
      estimatedMinutes: 0,
      estimatedDeliveryTime: orderTime,
      breakdown: {
        preparationTime: 0,
        travelTime: 0,
        volumeDelay: 0,
        peakHourDelay: 0,
        weatherDelay: 0,
      },
      confidence: "high",
      factors: [],
    };
  }

  // Group items by shop
  const itemsByShop = cartItems.reduce((acc, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = [];
    }
    acc[item.shopId].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  // Calculate delivery time for each shop
  const shopEstimates = Object.entries(itemsByShop).map(([shopId, items]) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop) {
      throw new Error(`Shop not found: ${shopId}`);
    }

    return estimateDeliveryTime({
      shop,
      customerAddress,
      orderTime,
      items,
    });
  });

  // For multiple shops, take the longest delivery time
  const longestEstimate = shopEstimates.reduce((longest, current) =>
    current.estimatedMinutes > longest.estimatedMinutes ? current : longest
  );

  // Combine factors from all shops
  const allFactors = shopEstimates.flatMap((estimate) => estimate.factors);
  const uniqueFactors = [...new Set(allFactors)];

  // If multiple shops, add coordination delay
  if (shopEstimates.length > 1) {
    longestEstimate.estimatedMinutes += 10; // 10 minute coordination delay
    longestEstimate.estimatedDeliveryTime = new Date(
      orderTime.getTime() + longestEstimate.estimatedMinutes * 60 * 1000
    );
    uniqueFactors.push(
      `Multiple shops require coordination (${shopEstimates.length} shops)`
    );

    // Lower confidence for multi-shop orders
    if (longestEstimate.confidence === "high")
      longestEstimate.confidence = "medium";
    else if (longestEstimate.confidence === "medium")
      longestEstimate.confidence = "low";
  }

  return {
    ...longestEstimate,
    factors: uniqueFactors,
  };
}

/**
 * Format delivery time for display
 */
export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Format delivery time range for display (with confidence interval)
 */
export function formatDeliveryTimeRange(estimate: DeliveryEstimate): string {
  const baseTime = estimate.estimatedMinutes;
  let variance = 0;

  // Add variance based on confidence
  switch (estimate.confidence) {
    case "high":
      variance = 5; // ±5 minutes
      break;
    case "medium":
      variance = 10; // ±10 minutes
      break;
    case "low":
      variance = 15; // ±15 minutes
      break;
  }

  const minTime = Math.max(
    DELIVERY_CONFIG.MIN_DELIVERY_TIME,
    baseTime - variance
  );
  const maxTime = Math.min(
    DELIVERY_CONFIG.MAX_DELIVERY_TIME,
    baseTime + variance
  );

  if (minTime === maxTime) {
    return formatDeliveryTime(baseTime);
  }

  return `${formatDeliveryTime(minTime)} - ${formatDeliveryTime(maxTime)}`;
}

/**
 * Get delivery time color class based on duration
 */
export function getDeliveryTimeColor(minutes: number): string {
  if (minutes <= 30) return "text-green-600";
  if (minutes <= 60) return "text-yellow-600";
  if (minutes <= 90) return "text-orange-600";
  return "text-red-600";
}

/**
 * Update shop delivery times with current conditions
 */
export function updateShopDeliveryTimes(
  shops: Shop[],
  customerAddress?: Address,
  orderTime: Date = new Date()
): Shop[] {
  return shops.map((shop) => {
    const estimate = estimateDeliveryTime({
      shop,
      customerAddress,
      orderTime,
    });

    return {
      ...shop,
      estimatedDeliveryTime: estimate.estimatedMinutes,
    };
  });
}

/**
 * Update product delivery times with current conditions
 */
export function updateProductDeliveryTimes(
  products: Product[],
  shops: Shop[],
  customerAddress?: Address,
  orderTime: Date = new Date()
): Product[] {
  return products.map((product) => {
    const shop = shops.find((s) => s.id === product.shopId);
    if (!shop) return product;

    const estimate = estimateDeliveryTime({
      shop,
      customerAddress,
      orderTime,
      items: [{ product, quantity: 1, shopId: product.shopId }],
    });

    return {
      ...product,
      estimatedDeliveryTime: estimate.estimatedMinutes,
    };
  });
}
