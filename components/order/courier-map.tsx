"use client";

import React, { useEffect, useState, useRef } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

interface CourierMapProps {
  order: Order;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

export function CourierMap({ order, onLocationUpdate }: CourierMapProps) {
  const [courierLocation, setCourierLocation] = useState(
    order.courierLocation || null
  );
  const [estimatedArrival, setEstimatedArrival] = useState<Date | null>(null);
  const [isNearby, setIsNearby] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate distance between two coordinates (simplified)
  const calculateDistance = (
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number => {
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
  };

  // Simulate courier movement towards delivery address
  useEffect(() => {
    if (order.status !== "out_for_delivery" || !courierLocation) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCourierLocation((prevLocation) => {
        if (!prevLocation) return null;

        const deliveryCoords = order.deliveryAddress.coordinates;
        const distance = calculateDistance(prevLocation, deliveryCoords);

        // If very close (within 100m), stop moving
        if (distance < 0.1) {
          setIsNearby(true);
          return prevLocation;
        }

        // Move courier slightly towards delivery address
        const moveSpeed = 0.0005; // Adjust speed as needed
        const latDiff = deliveryCoords.lat - prevLocation.lat;
        const lngDiff = deliveryCoords.lng - prevLocation.lng;

        const newLocation = {
          lat: prevLocation.lat + latDiff * moveSpeed,
          lng: prevLocation.lng + lngDiff * moveSpeed,
        };

        // Update estimated arrival based on distance and speed
        const remainingDistance = calculateDistance(
          newLocation,
          deliveryCoords
        );
        const estimatedMinutes = Math.max(
          5,
          Math.round(remainingDistance * 60 * 2)
        ); // Rough estimate
        setEstimatedArrival(
          new Date(Date.now() + estimatedMinutes * 60 * 1000)
        );

        // Check if nearby (within 500m)
        setIsNearby(remainingDistance < 0.5);

        // Notify parent component of location update
        if (onLocationUpdate) {
          onLocationUpdate(newLocation);
        }

        return newLocation;
      });
    }, 5000); // Update every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    order.status,
    courierLocation,
    order.deliveryAddress.coordinates,
    onLocationUpdate,
  ]);

  // Initialize estimated arrival
  useEffect(() => {
    if (courierLocation && order.status === "out_for_delivery") {
      const distance = calculateDistance(
        courierLocation,
        order.deliveryAddress.coordinates
      );
      const estimatedMinutes = Math.max(5, Math.round(distance * 60 * 2));
      setEstimatedArrival(new Date(Date.now() + estimatedMinutes * 60 * 1000));
      setIsNearby(distance < 0.5);
    }
  }, [courierLocation, order.deliveryAddress.coordinates, order.status]);

  if (order.status !== "out_for_delivery" || !courierLocation) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary-500" />
            Live Courier Tracking
          </CardTitle>
          {isNearby && (
            <Badge className="bg-green-100 text-green-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Nearby
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Proximity Alert */}
        {isNearby && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
              <Truck className="h-4 w-4" />
              Your courier is nearby!
            </div>
            <p className="text-sm text-green-700">
              Your delivery is less than 500 meters away. Please be available to
              receive your order.
            </p>
          </div>
        )}

        {/* Map Placeholder */}
        <div
          ref={mapRef}
          className="w-full h-64 bg-neutral-100 rounded-lg relative overflow-hidden"
        >
          {/* Simple map visualization */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
            {/* Delivery address marker */}
            <div
              className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
              style={{
                left: "70%",
                top: "60%",
              }}
            >
              <MapPin className="h-4 w-4 text-white" />
            </div>

            {/* Courier location marker */}
            <div
              className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"
              style={{
                left: isNearby ? "68%" : "45%",
                top: isNearby ? "58%" : "40%",
              }}
            >
              <Truck className="h-4 w-4 text-white" />
            </div>

            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full">
              <line
                x1={isNearby ? "68%" : "45%"}
                y1={isNearby ? "58%" : "40%"}
                x2="70%"
                y2="60%"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>

            {/* Map labels */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Courier Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Delivery Address</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-neutral-900">Courier Details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xs">AK</span>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">
                    Alex Kovalenko
                  </div>
                  <div className="text-neutral-600 text-xs">
                    Courier ID: #C1247
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors">
                  <Phone className="h-3 w-3" />
                  Call
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors">
                  <MessageCircle className="h-3 w-3" />
                  Message
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-neutral-900">Delivery Status</h4>
            <div className="space-y-2">
              {estimatedArrival && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-neutral-500" />
                  <div>
                    <div className="text-neutral-600">Estimated arrival</div>
                    <div className="font-medium text-neutral-900">
                      {estimatedArrival.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Navigation className="h-4 w-4 text-neutral-500" />
                <div>
                  <div className="text-neutral-600">Distance remaining</div>
                  <div className="font-medium text-neutral-900">
                    {courierLocation
                      ? `${calculateDistance(
                          courierLocation,
                          order.deliveryAddress.coordinates
                        ).toFixed(1)} km`
                      : "Calculating..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Instructions */}
        {order.deliveryInstructions && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h5 className="font-medium text-yellow-800 mb-1">
              Delivery Instructions
            </h5>
            <p className="text-sm text-yellow-700">
              {order.deliveryInstructions}
            </p>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-neutral-500 text-center">
          Location last updated:{" "}
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </CardContent>
    </Card>
  );
}
