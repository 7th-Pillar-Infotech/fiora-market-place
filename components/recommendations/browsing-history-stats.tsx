"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, Store, Calendar, Trash2 } from "lucide-react";

interface BrowsingHistoryStatsProps {
  stats: {
    totalViews: number;
    topCategories: { category: string; count: number }[];
    topShops: { shopId: string; count: number }[];
    recentViews: number;
  };
  shops?: { id: string; name: string }[];
  onClearHistory?: () => void;
  compact?: boolean;
}

export function BrowsingHistoryStats({
  stats,
  shops = [],
  onClearHistory,
  compact = false,
}: BrowsingHistoryStatsProps) {
  const getShopName = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    return shop?.name || `Shop ${shopId.slice(-4)}`;
  };

  if (stats.totalViews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4" />
            Your Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Eye className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-600">No browsing history yet</p>
            <p className="text-xs text-neutral-500">
              Start exploring products to see your activity
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4" />
            Your Activity
          </CardTitle>
          {onClearHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-lg font-semibold text-neutral-900">
              {stats.totalViews}
            </div>
            <div className="text-xs text-neutral-600">Total Views</div>
          </div>
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-lg font-semibold text-neutral-900">
              {stats.recentViews}
            </div>
            <div className="text-xs text-neutral-600">This Week</div>
          </div>
        </div>

        {/* Top Categories */}
        {stats.topCategories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-3 w-3 text-neutral-500" />
              <span className="text-xs font-medium text-neutral-700">
                Favorite Categories
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {stats.topCategories
                .slice(0, compact ? 3 : 5)
                .map(({ category, count }) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="text-xs capitalize"
                  >
                    {category} ({count})
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Top Shops */}
        {stats.topShops.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-3 w-3 text-neutral-500" />
              <span className="text-xs font-medium text-neutral-700">
                Visited Shops
              </span>
            </div>
            <div className="space-y-1">
              {stats.topShops
                .slice(0, compact ? 2 : 3)
                .map(({ shopId, count }) => (
                  <div
                    key={shopId}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-neutral-700 truncate">
                      {getShopName(shopId)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Activity Indicator */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Calendar className="h-3 w-3" />
          <span>
            {stats.recentViews > 0
              ? `${stats.recentViews} views in the last 7 days`
              : "No recent activity"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
