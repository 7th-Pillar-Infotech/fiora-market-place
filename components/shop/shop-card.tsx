"use client";

import React from "react";
import Link from "next/link";
import { Shop } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleDeliveryTime } from "@/components/ui/delivery-time";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Star, MapPin } from "lucide-react";

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  const formatDistance = (distance: number) => {
    return distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  return (
    <Link href={`/shops/${shop.id}`} className="group tap-target">
      <Card className="h-full transition-all duration-200 hover:shadow-medium md:hover:-translate-y-1 group-hover:border-primary-200 active:scale-95 md:active:scale-100">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
          <OptimizedImage
            src={shop.imageUrl}
            alt={shop.name}
            fill
            className="transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            aspectRatio="landscape"
            priority={false}
          />
          <div className="absolute top-2 md:top-3 left-2 md:left-3 flex gap-1 md:gap-2">
            {!shop.isOpen && (
              <Badge variant="destructive" size="sm" className="text-xs">
                Closed
              </Badge>
            )}
            {shop.rating >= 4.5 && (
              <Badge variant="success" size="sm" className="text-xs">
                Top Rated
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-3 md:p-4">
          <div className="space-y-2 md:space-y-3">
            <div>
              <h3 className="font-semibold text-base md:text-lg text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                {shop.name}
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 line-clamp-2 mt-1">
                {shop.description}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-3 md:h-4 w-3 md:w-4 fill-accent-400 text-accent-400" />
                <span className="font-medium text-neutral-900">
                  {shop.rating}
                </span>
                <span className="text-neutral-500 hidden sm:inline">
                  ({shop.reviewCount})
                </span>
              </div>

              <SimpleDeliveryTime
                minutes={shop.estimatedDeliveryTime}
                className="text-neutral-600"
              />

              <div className="flex items-center gap-1 text-neutral-600">
                <MapPin className="h-3 md:h-4 w-3 md:w-4" />
                <span>{formatDistance(shop.distance)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {shop.categories.slice(0, 2).map((category) => (
                <Badge
                  key={category}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  {category}
                </Badge>
              ))}
              {shop.categories.length > 2 && (
                <Badge variant="ghost" size="sm" className="text-xs">
                  +{shop.categories.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
