"use client";

import React from "react";
import { Shop } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, Phone, ShoppingBag } from "lucide-react";

interface ShopInfoProps {
  shop: Shop;
  handleViewProducts: () => void;
}

export function ShopInfo({ shop, handleViewProducts }: ShopInfoProps) {
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

  const handleCall = () => {
    window.location.href = `tel:${shop.phone}`;
  };

  return (
    <div className="space-y-6">
      {/* Shop Status */}
      <div className="flex items-center gap-2">
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

      {/* Shop Title and Description */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          {shop.name}
        </h1>
        <p className="text-neutral-600 leading-relaxed">{shop.description}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
          <span className="font-medium text-neutral-900">{shop.rating}</span>
          <span className="text-neutral-500">({shop.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Clock className="h-4 w-4" />
          <span>{formatDeliveryTime(shop.estimatedDeliveryTime)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <MapPin className="h-4 w-4" />
          <span>{formatDistance(shop.distance)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Phone className="h-4 w-4" />
          <button
            onClick={handleCall}
            className="hover:text-primary-600 transition-colors"
          >
            Call
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-neutral-900 mb-2">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {shop.categories.map((category) => (
            <Badge
              key={category}
              variant="ghost"
              size="sm"
              className="capitalize"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <Button
          onClick={handleViewProducts}
          size="lg"
          variant="outline"
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          View Products
        </Button>
      </div>
    </div>
  );
}
