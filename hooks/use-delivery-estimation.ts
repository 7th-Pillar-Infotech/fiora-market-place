"use client";

import { useState, useEffect, useMemo } from "react";
import { Shop, Product, CartItem, Address } from "@/lib/types";
import {
  estimateDeliveryTime,
  estimateCartDeliveryTime,
  updateShopDeliveryTimes,
  updateProductDeliveryTimes,
  DeliveryEstimate,
} from "@/lib/delivery-estimation";

/**
 * Hook for estimating delivery time for a single shop
 */
export function useShopDeliveryEstimate(
  shop: Shop | null,
  customerAddress?: Address,
  items?: CartItem[]
) {
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!shop) {
      setEstimate(null);
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for realistic UX
    const timer = setTimeout(() => {
      const newEstimate = estimateDeliveryTime({
        shop,
        customerAddress,
        items,
        orderTime: new Date(),
      });

      setEstimate(newEstimate);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [shop, customerAddress, items]);

  return { estimate, isLoading };
}

/**
 * Hook for estimating delivery time for cart items
 */
export function useCartDeliveryEstimate(
  cartItems: CartItem[],
  shops: Shop[],
  customerAddress?: Address
) {
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      setEstimate(null);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      const newEstimate = estimateCartDeliveryTime(
        cartItems,
        shops,
        customerAddress,
        new Date()
      );

      setEstimate(newEstimate);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [cartItems, shops, customerAddress]);

  return { estimate, isLoading };
}

/**
 * Hook for updating shop delivery times with current conditions
 */
export function useUpdatedShopDeliveryTimes(
  shops: Shop[],
  customerAddress?: Address,
  refreshInterval: number = 60000 // 1 minute
) {
  const [updatedShops, setUpdatedShops] = useState<Shop[]>(shops);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateDeliveryTimes = useMemo(() => {
    return () => {
      const updated = updateShopDeliveryTimes(
        shops,
        customerAddress,
        new Date()
      );
      setUpdatedShops(updated);
      setLastUpdated(new Date());
    };
  }, [shops, customerAddress]);

  useEffect(() => {
    // Initial update
    updateDeliveryTimes();

    // Set up interval for periodic updates
    const interval = setInterval(updateDeliveryTimes, refreshInterval);

    return () => clearInterval(interval);
  }, [updateDeliveryTimes, refreshInterval]);

  return {
    shops: updatedShops,
    lastUpdated,
    refresh: updateDeliveryTimes,
  };
}

/**
 * Hook for updating product delivery times with current conditions
 */
export function useUpdatedProductDeliveryTimes(
  products: Product[],
  shops: Shop[],
  customerAddress?: Address,
  refreshInterval: number = 60000 // 1 minute
) {
  const [updatedProducts, setUpdatedProducts] = useState<Product[]>(products);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateDeliveryTimes = useMemo(() => {
    return () => {
      const updated = updateProductDeliveryTimes(
        products,
        shops,
        customerAddress,
        new Date()
      );
      setUpdatedProducts(updated);
      setLastUpdated(new Date());
    };
  }, [products, shops, customerAddress]);

  useEffect(() => {
    // Initial update
    updateDeliveryTimes();

    // Set up interval for periodic updates
    const interval = setInterval(updateDeliveryTimes, refreshInterval);

    return () => clearInterval(interval);
  }, [updateDeliveryTimes, refreshInterval]);

  return {
    products: updatedProducts,
    lastUpdated,
    refresh: updateDeliveryTimes,
  };
}

/**
 * Hook for real-time delivery estimates that update based on current conditions
 */
export function useRealTimeDeliveryEstimate(
  shop: Shop | null,
  customerAddress?: Address,
  items?: CartItem[],
  updateInterval: number = 30000 // 30 seconds
) {
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const updateEstimate = useMemo(() => {
    return () => {
      if (!shop) {
        setEstimate(null);
        return;
      }

      setIsLoading(true);

      const newEstimate = estimateDeliveryTime({
        shop,
        customerAddress,
        items,
        orderTime: new Date(),
      });

      setEstimate(newEstimate);
      setLastUpdated(new Date());
      setIsLoading(false);
    };
  }, [shop, customerAddress, items]);

  useEffect(() => {
    // Initial update
    updateEstimate();

    // Set up interval for periodic updates
    const interval = setInterval(updateEstimate, updateInterval);

    return () => clearInterval(interval);
  }, [updateEstimate, updateInterval]);

  return {
    estimate,
    isLoading,
    lastUpdated,
    refresh: updateEstimate,
  };
}

/**
 * Hook for comparing delivery times across multiple shops
 */
export function useDeliveryComparison(
  shops: Shop[],
  customerAddress?: Address,
  items?: CartItem[]
) {
  const [comparisons, setComparisons] = useState<
    Array<{
      shop: Shop;
      estimate: DeliveryEstimate;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shops.length === 0) {
      setComparisons([]);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      const newComparisons = shops.map((shop) => ({
        shop,
        estimate: estimateDeliveryTime({
          shop,
          customerAddress,
          items,
          orderTime: new Date(),
        }),
      }));

      // Sort by delivery time (fastest first)
      newComparisons.sort(
        (a, b) => a.estimate.estimatedMinutes - b.estimate.estimatedMinutes
      );

      setComparisons(newComparisons);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [shops, customerAddress, items]);

  return {
    comparisons,
    isLoading,
    fastest: comparisons[0] || null,
    slowest: comparisons[comparisons.length - 1] || null,
  };
}
