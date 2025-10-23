"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Shop } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  const formatDeliveryTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  const formatDistance = (distance: number) => {
    return distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  console.log({ shop });

  return (
    <Link href={`/shops/${shop.id}`} className="group">
      <Card className="h-full transition-all duration-200 hover:shadow-medium hover:-translate-y-1 group-hover:border-primary-200">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
          <Image
            src={shop.imageUrl}
            alt={shop.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {!shop.isOpen && (
              <Badge variant="destructive" size="sm">
                Closed
              </Badge>
            )}
            {shop.rating >= 4.5 && (
              <Badge variant="success" size="sm">
                Top Rated
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                {shop.name}
              </h3>
              <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                {shop.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                <span className="font-medium text-neutral-900">
                  {shop.rating}
                </span>
                <span className="text-neutral-500">({shop.reviewCount})</span>
              </div>

              <div className="flex items-center gap-1 text-neutral-600">
                <Clock className="h-4 w-4" />
                <span>{formatDeliveryTime(shop.estimatedDeliveryTime)}</span>
              </div>

              <div className="flex items-center gap-1 text-neutral-600">
                <MapPin className="h-4 w-4" />
                <span>{formatDistance(shop.distance)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {shop.categories.slice(0, 3).map((category) => (
                <Badge
                  key={category}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  {category}
                </Badge>
              ))}
              {shop.categories.length > 3 && (
                <Badge variant="ghost" size="sm" className="text-xs">
                  +{shop.categories.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
