/**
 * React hook for managing product recommendations
 */

import { useState, useEffect, useCallback } from "react";
import { Product, Shop } from "@/lib/types";
import {
  ProductRecommendation,
  recommendationUtils,
  BrowsingHistoryManager,
} from "@/lib/recommendations";

interface UseRecommendationsOptions {
  products: Product[];
  shops: Shop[];
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseRecommendationsReturn {
  recommendations: ProductRecommendation[];
  loading: boolean;
  error: string | null;
  refreshRecommendations: () => void;
  trackProductView: (
    productId: string,
    shopId: string,
    category: string,
    viewDuration?: number
  ) => void;
  browsingStats: {
    totalViews: number;
    topCategories: { category: string; count: number }[];
    topShops: { shopId: string; count: number }[];
    recentViews: number;
  };
}

/**
 * Hook for managing product recommendations
 */
export function useRecommendations({
  products,
  shops,
  limit = 10,
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
}: UseRecommendationsOptions): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<
    ProductRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [browsingStats, setBrowsingStats] = useState<{
    totalViews: number;
    topCategories: { category: string; count: number }[];
    topShops: { shopId: string; count: number }[];
    recentViews: number;
  }>({
    totalViews: 0,
    topCategories: [],
    topShops: [],
    recentViews: 0,
  });

  /**
   * Generate recommendations
   */
  const generateRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const recs = recommendationUtils.getRecommendations(
        products,
        shops,
        limit
      );
      const stats = recommendationUtils.getBrowsingStats();

      setRecommendations(recs);
      setBrowsingStats(stats);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate recommendations"
      );
      console.error("Error generating recommendations:", err);
    } finally {
      setLoading(false);
    }
  }, [products, shops, limit]);

  /**
   * Track product view and refresh recommendations
   */
  const trackProductView = useCallback(
    (
      productId: string,
      shopId: string,
      category: string,
      viewDuration?: number
    ) => {
      try {
        recommendationUtils.trackProductView(
          productId,
          shopId,
          category,
          viewDuration
        );

        // Update browsing stats immediately
        const stats = recommendationUtils.getBrowsingStats();
        setBrowsingStats(stats);

        // Optionally refresh recommendations after tracking
        // This could be debounced in a real application
        if (autoRefresh) {
          setTimeout(() => {
            generateRecommendations();
          }, 1000);
        }
      } catch (err) {
        console.error("Error tracking product view:", err);
      }
    },
    [autoRefresh, generateRecommendations]
  );

  /**
   * Manually refresh recommendations
   */
  const refreshRecommendations = useCallback(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  // Initial load
  useEffect(() => {
    if (products.length > 0 && shops.length > 0) {
      generateRecommendations();
    }
  }, [generateRecommendations, products.length, shops.length]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      generateRecommendations();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, generateRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations,
    trackProductView,
    browsingStats,
  };
}

/**
 * Hook for tracking product views with automatic cleanup
 */
export function useProductViewTracking() {
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);

  /**
   * Start tracking a product view
   */
  const startTracking = useCallback(() => {
    setViewStartTime(Date.now());
  }, []);

  /**
   * End tracking and record the view
   */
  const endTracking = useCallback(
    (productId: string, shopId: string, category: string) => {
      if (viewStartTime) {
        const viewDuration = Math.round((Date.now() - viewStartTime) / 1000);
        recommendationUtils.trackProductView(
          productId,
          shopId,
          category,
          viewDuration
        );
        setViewStartTime(null);
      }
    },
    [viewStartTime]
  );

  /**
   * Track a simple view without duration
   */
  const trackView = useCallback(
    (productId: string, shopId: string, category: string) => {
      recommendationUtils.trackProductView(productId, shopId, category);
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setViewStartTime(null);
    };
  }, []);

  return {
    startTracking,
    endTracking,
    trackView,
    isTracking: viewStartTime !== null,
  };
}

/**
 * Hook for browsing history management
 */
export function useBrowsingHistory() {
  const [history, setHistory] = useState<
    ReturnType<typeof BrowsingHistoryManager.getHistory>
  >([]);
  const [stats, setStats] = useState(recommendationUtils.getBrowsingStats());

  /**
   * Refresh history data
   */
  const refreshHistory = useCallback(() => {
    const historyData = BrowsingHistoryManager.getHistory();
    const statsData = recommendationUtils.getBrowsingStats();

    setHistory(historyData);
    setStats(statsData);
  }, []);

  /**
   * Clear browsing history
   */
  const clearHistory = useCallback(() => {
    BrowsingHistoryManager.clearHistory();
    refreshHistory();
  }, [refreshHistory]);

  /**
   * Get recent views
   */
  const getRecentViews = useCallback((days: number = 7) => {
    return BrowsingHistoryManager.getRecentViews(days);
  }, []);

  // Initial load
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return {
    history,
    stats,
    refreshHistory,
    clearHistory,
    getRecentViews,
  };
}
