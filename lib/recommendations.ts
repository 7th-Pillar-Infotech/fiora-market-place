/**
 * Recommendation Engine for Fiora Customer Dashboard
 * Implements browsing history tracking and product recommendation algorithms
 */

import { Product, Shop, Recommendation } from "./types";
import { storage, STORAGE_KEYS } from "./utils";

/**
 * Browsing history item interface
 */
export interface BrowsingHistoryItem {
  productId: string;
  shopId: string;
  category: string;
  timestamp: Date;
  viewDuration?: number; // in seconds
}

/**
 * Recommendation reason types
 */
export type RecommendationReason =
  | "browsing_history"
  | "popular"
  | "seasonal"
  | "similar_customers"
  | "category_match"
  | "shop_favorite";

/**
 * Enhanced recommendation interface
 */
export interface ProductRecommendation {
  product: Product;
  shop: Shop;
  reason: RecommendationReason;
  score: number;
  explanation: string;
}

/**
 * Seasonal product categories and timing
 */
const SEASONAL_CATEGORIES = {
  spring: {
    months: [3, 4, 5], // March, April, May
    categories: ["seasonal", "bouquets"],
    tags: ["spring", "tulip", "daffodil", "fresh"],
    boost: 1.5,
  },
  summer: {
    months: [6, 7, 8], // June, July, August
    categories: ["arrangements", "gifts"],
    tags: ["summer", "sunflower", "bright", "colorful"],
    boost: 1.3,
  },
  autumn: {
    months: [9, 10, 11], // September, October, November
    categories: ["arrangements", "seasonal"],
    tags: ["autumn", "warm", "orange", "harvest"],
    boost: 1.4,
  },
  winter: {
    months: [12, 1, 2], // December, January, February
    categories: ["gifts", "seasonal"],
    tags: ["winter", "holiday", "festive", "warm"],
    boost: 1.6,
  },
};

/**
 * Popular product boost factors
 */
const POPULARITY_FACTORS = {
  HIGH_RATING_SHOP: 1.3, // Products from shops with rating >= 4.5
  MEDIUM_RATING_SHOP: 1.1, // Products from shops with rating >= 4.0
  HIGH_STOCK: 1.2, // Products with stock > 15
  FAST_DELIVERY: 1.4, // Products with delivery time < 45 minutes
  RECENT_VIEWS: 1.5, // Products viewed in last 7 days
};

/**
 * Browsing history management
 */
export class BrowsingHistoryManager {
  private static readonly MAX_HISTORY_ITEMS = 100;
  private static readonly STORAGE_KEY = STORAGE_KEYS.BROWSING_HISTORY;

  /**
   * Get browsing history from localStorage
   */
  static getHistory(): BrowsingHistoryItem[] {
    const history = storage.get<BrowsingHistoryItem[]>(this.STORAGE_KEY, []);
    // Convert timestamp strings back to Date objects
    return history.map((item) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  }

  /**
   * Add product view to browsing history
   */
  static addView(
    productId: string,
    shopId: string,
    category: string,
    viewDuration?: number
  ): void {
    const history = this.getHistory();

    // Remove existing entry for the same product to avoid duplicates
    const filteredHistory = history.filter(
      (item) => item.productId !== productId
    );

    // Add new entry at the beginning
    const newItem: BrowsingHistoryItem = {
      productId,
      shopId,
      category,
      timestamp: new Date(),
      viewDuration,
    };

    const updatedHistory = [newItem, ...filteredHistory].slice(
      0,
      this.MAX_HISTORY_ITEMS
    );
    storage.set(this.STORAGE_KEY, updatedHistory);
  }

  /**
   * Get recent views (last N days)
   */
  static getRecentViews(days: number = 7): BrowsingHistoryItem[] {
    const history = this.getHistory();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return history.filter((item) => item.timestamp >= cutoffDate);
  }

  /**
   * Get most viewed categories
   */
  static getTopCategories(
    limit: number = 5
  ): { category: string; count: number }[] {
    const history = this.getHistory();
    const categoryCounts = new Map<string, number>();

    history.forEach((item) => {
      const count = categoryCounts.get(item.category) || 0;
      categoryCounts.set(item.category, count + 1);
    });

    return Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get most visited shops
   */
  static getTopShops(limit: number = 5): { shopId: string; count: number }[] {
    const history = this.getHistory();
    const shopCounts = new Map<string, number>();

    history.forEach((item) => {
      const count = shopCounts.get(item.shopId) || 0;
      shopCounts.set(item.shopId, count + 1);
    });

    return Array.from(shopCounts.entries())
      .map(([shopId, count]) => ({ shopId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Clear browsing history
   */
  static clearHistory(): void {
    storage.remove(this.STORAGE_KEY);
  }
}

/**
 * Recommendation Engine
 */
export class RecommendationEngine {
  private products: Product[];
  private shops: Shop[];

  constructor(products: Product[], shops: Shop[]) {
    this.products = products.filter((p) => p.isAvailable);
    this.shops = shops;
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(limit: number = 10): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];

    // Get browsing history based recommendations
    const historyRecs = this.getBrowsingHistoryRecommendations();
    recommendations.push(...historyRecs);

    // Get popular product recommendations
    const popularRecs = this.getPopularRecommendations();
    recommendations.push(...popularRecs);

    // Get seasonal recommendations
    const seasonalRecs = this.getSeasonalRecommendations();
    recommendations.push(...seasonalRecs);

    // Remove duplicates and sort by score
    const uniqueRecs = this.removeDuplicates(recommendations);
    const sortedRecs = uniqueRecs.sort((a, b) => b.score - a.score);

    return sortedRecs.slice(0, limit);
  }

  /**
   * Get recommendations based on browsing history
   */
  private getBrowsingHistoryRecommendations(): ProductRecommendation[] {
    const history = BrowsingHistoryManager.getHistory();
    const recentHistory = BrowsingHistoryManager.getRecentViews(14); // Last 2 weeks

    if (history.length === 0) {
      return [];
    }

    const recommendations: ProductRecommendation[] = [];
    const topCategories = BrowsingHistoryManager.getTopCategories(3);
    const topShops = BrowsingHistoryManager.getTopShops(3);

    // Recommend products from frequently viewed categories
    topCategories.forEach(({ category, count }) => {
      const categoryProducts = this.products.filter(
        (p) => p.category === category
      );
      const viewedProductIds = new Set(history.map((h) => h.productId));

      categoryProducts
        .filter((p) => !viewedProductIds.has(p.id))
        .slice(0, 3)
        .forEach((product) => {
          const shop = this.shops.find((s) => s.id === product.shopId);
          if (shop) {
            const score = this.calculateBrowsingHistoryScore(
              product,
              count,
              recentHistory
            );
            recommendations.push({
              product,
              shop,
              reason: "category_match",
              score,
              explanation: `Based on your interest in ${category} flowers`,
            });
          }
        });
    });

    // Recommend products from favorite shops
    topShops.forEach(({ shopId, count }) => {
      const shopProducts = this.products.filter((p) => p.shopId === shopId);
      const viewedProductIds = new Set(history.map((h) => h.productId));

      shopProducts
        .filter((p) => !viewedProductIds.has(p.id))
        .slice(0, 2)
        .forEach((product) => {
          const shop = this.shops.find((s) => s.id === product.shopId);
          if (shop) {
            const score = this.calculateShopFavoriteScore(product, shop, count);
            recommendations.push({
              product,
              shop,
              reason: "shop_favorite",
              score,
              explanation: `From ${shop.name}, a shop you frequently visit`,
            });
          }
        });
    });

    return recommendations;
  }

  /**
   * Get popular product recommendations
   */
  private getPopularRecommendations(): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];

    // Get products from highly rated shops
    const highRatedShops = this.shops.filter((s) => s.rating >= 4.5);
    const mediumRatedShops = this.shops.filter(
      (s) => s.rating >= 4.0 && s.rating < 4.5
    );

    // High-rated shop products
    highRatedShops.forEach((shop) => {
      const shopProducts = this.products
        .filter((p) => p.shopId === shop.id)
        .sort((a, b) => b.stock - a.stock) // Prefer higher stock items
        .slice(0, 2);

      shopProducts.forEach((product) => {
        const score = this.calculatePopularityScore(product, shop, "high");
        recommendations.push({
          product,
          shop,
          reason: "popular",
          score,
          explanation: `Popular choice from highly-rated ${shop.name}`,
        });
      });
    });

    // Medium-rated shop products (fewer recommendations)
    mediumRatedShops.slice(0, 3).forEach((shop) => {
      const shopProducts = this.products
        .filter((p) => p.shopId === shop.id)
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 1);

      shopProducts.forEach((product) => {
        const score = this.calculatePopularityScore(product, shop, "medium");
        recommendations.push({
          product,
          shop,
          reason: "popular",
          score,
          explanation: `Popular choice from well-rated ${shop.name}`,
        });
      });
    });

    return recommendations;
  }

  /**
   * Get seasonal recommendations
   */
  private getSeasonalRecommendations(): ProductRecommendation[] {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentSeason = this.getCurrentSeason(currentMonth);

    if (!currentSeason) {
      return [];
    }

    const seasonalConfig = SEASONAL_CATEGORIES[currentSeason];
    const recommendations: ProductRecommendation[] = [];

    // Find products matching seasonal categories and tags
    const seasonalProducts = this.products.filter((product) => {
      const matchesCategory = seasonalConfig.categories.includes(
        product.category
      );
      const matchesTags = product.tags.some((tag) =>
        seasonalConfig.tags.some((seasonalTag) =>
          tag.toLowerCase().includes(seasonalTag.toLowerCase())
        )
      );
      return matchesCategory || matchesTags;
    });

    // Sort by shop rating and delivery time
    const sortedProducts = seasonalProducts
      .map((product) => ({
        product,
        shop: this.shops.find((s) => s.id === product.shopId)!,
      }))
      .filter((item) => item.shop)
      .sort((a, b) => {
        // Prioritize by shop rating, then by delivery time
        if (a.shop.rating !== b.shop.rating) {
          return b.shop.rating - a.shop.rating;
        }
        return (
          a.product.estimatedDeliveryTime - b.product.estimatedDeliveryTime
        );
      })
      .slice(0, 6);

    sortedProducts.forEach(({ product, shop }) => {
      const score = this.calculateSeasonalScore(
        product,
        shop,
        seasonalConfig.boost
      );
      recommendations.push({
        product,
        shop,
        reason: "seasonal",
        score,
        explanation: `Perfect for ${currentSeason} season`,
      });
    });

    return recommendations;
  }

  /**
   * Calculate browsing history based score
   */
  private calculateBrowsingHistoryScore(
    product: Product,
    categoryCount: number,
    recentHistory: BrowsingHistoryItem[]
  ): number {
    let score = 0.7; // Base score for browsing history

    // Boost based on category frequency
    score += Math.min(categoryCount * 0.1, 0.3);

    // Boost for recent activity in this category
    const recentCategoryViews = recentHistory.filter(
      (h) => h.category === product.category
    ).length;
    score += Math.min(recentCategoryViews * 0.05, 0.2);

    // Apply product quality factors
    score = this.applyProductQualityFactors(score, product);

    return Math.min(score, 1.0);
  }

  /**
   * Calculate shop favorite score
   */
  private calculateShopFavoriteScore(
    product: Product,
    shop: Shop,
    visitCount: number
  ): number {
    let score = 0.8; // Base score for shop favorites

    // Boost based on visit frequency
    score += Math.min(visitCount * 0.05, 0.2);

    // Apply shop quality factors
    score += (shop.rating - 3.0) * 0.1; // Boost for higher ratings

    // Apply product quality factors
    score = this.applyProductQualityFactors(score, product);

    return Math.min(score, 1.0);
  }

  /**
   * Calculate popularity score
   */
  private calculatePopularityScore(
    product: Product,
    shop: Shop,
    tier: "high" | "medium"
  ): number {
    let score = tier === "high" ? 0.9 : 0.7;

    // Apply shop rating boost
    if (shop.rating >= 4.5) {
      score *= POPULARITY_FACTORS.HIGH_RATING_SHOP;
    } else if (shop.rating >= 4.0) {
      score *= POPULARITY_FACTORS.MEDIUM_RATING_SHOP;
    }

    // Apply product quality factors
    score = this.applyProductQualityFactors(score, product);

    return Math.min(score, 1.0);
  }

  /**
   * Calculate seasonal score
   */
  private calculateSeasonalScore(
    product: Product,
    shop: Shop,
    seasonalBoost: number
  ): number {
    let score = 0.8; // Base seasonal score

    // Apply seasonal boost
    score *= seasonalBoost;

    // Apply shop rating
    score += (shop.rating - 3.0) * 0.05;

    // Apply product quality factors
    score = this.applyProductQualityFactors(score, product);

    return Math.min(score, 1.0);
  }

  /**
   * Apply product quality factors to score
   */
  private applyProductQualityFactors(
    baseScore: number,
    product: Product
  ): number {
    let score = baseScore;

    // Boost for high stock
    if (product.stock > 15) {
      score *= POPULARITY_FACTORS.HIGH_STOCK;
    }

    // Boost for fast delivery
    if (product.estimatedDeliveryTime < 45) {
      score *= POPULARITY_FACTORS.FAST_DELIVERY;
    }

    return score;
  }

  /**
   * Get current season based on month
   */
  private getCurrentSeason(
    month: number
  ): keyof typeof SEASONAL_CATEGORIES | null {
    for (const [season, config] of Object.entries(SEASONAL_CATEGORIES)) {
      if (config.months.includes(month)) {
        return season as keyof typeof SEASONAL_CATEGORIES;
      }
    }
    return null;
  }

  /**
   * Remove duplicate recommendations
   */
  private removeDuplicates(
    recommendations: ProductRecommendation[]
  ): ProductRecommendation[] {
    const seen = new Set<string>();
    return recommendations.filter((rec) => {
      if (seen.has(rec.product.id)) {
        return false;
      }
      seen.add(rec.product.id);
      return true;
    });
  }
}

/**
 * Utility functions for recommendation system
 */
export const recommendationUtils = {
  /**
   * Track product view
   */
  trackProductView(
    productId: string,
    shopId: string,
    category: string,
    viewDuration?: number
  ): void {
    BrowsingHistoryManager.addView(productId, shopId, category, viewDuration);
  },

  /**
   * Get recommendations for display
   */
  getRecommendations(
    products: Product[],
    shops: Shop[],
    limit: number = 10
  ): ProductRecommendation[] {
    const engine = new RecommendationEngine(products, shops);
    return engine.generateRecommendations(limit);
  },

  /**
   * Get browsing history stats
   */
  getBrowsingStats(): {
    totalViews: number;
    topCategories: { category: string; count: number }[];
    topShops: { shopId: string; count: number }[];
    recentViews: number;
  } {
    const history = BrowsingHistoryManager.getHistory();
    const recentViews = BrowsingHistoryManager.getRecentViews(7);

    return {
      totalViews: history.length,
      topCategories: BrowsingHistoryManager.getTopCategories(5),
      topShops: BrowsingHistoryManager.getTopShops(5),
      recentViews: recentViews.length,
    };
  },

  /**
   * Clear all recommendation data
   */
  clearRecommendationData(): void {
    BrowsingHistoryManager.clearHistory();
  },
};
