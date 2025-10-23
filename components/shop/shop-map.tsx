"use client";

import React from "react";
import { Shop } from "@/lib/types";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopMapProps {
  shop: Shop;
}

export function ShopMap({ shop }: ShopMapProps) {
  const { coordinates } = shop.address;

  // Create a simple static map placeholder (for future implementation)
  // const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-flower+ec4899(${coordinates.lng},${coordinates.lat})/${coordinates.lng},${coordinates.lat},14,0/400x300@2x?access_token=pk.example`;

  const openInMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-neutral-600" />
        <h3 className="font-medium text-neutral-900">Location</h3>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-neutral-600">
          <p>{shop.address.street}</p>
          <p>
            {shop.address.city}, {shop.address.postalCode}
          </p>
          <p className="mt-1 text-xs">
            Distance: {shop.distance.toFixed(1)}km from your location
          </p>
        </div>

        {/* Map placeholder */}
        <div className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">Map view</p>
              <p className="text-xs text-neutral-400">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={openInMaps}
          className="w-full flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Open in Maps
        </Button>
      </div>
    </div>
  );
}
