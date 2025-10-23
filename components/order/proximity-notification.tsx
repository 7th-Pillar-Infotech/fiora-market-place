"use client";

import React, { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Truck, MapPin, Clock, X, CheckCircle } from "lucide-react";

interface ProximityNotificationProps {
  order: Order;
  isVisible: boolean;
  onDismiss: () => void;
}

export function ProximityNotification({
  order,
  isVisible,
  onDismiss,
}: ProximityNotificationProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Calculate estimated arrival time
  useEffect(() => {
    if (!isVisible || order.status !== "out_for_delivery") return;

    const interval = setInterval(() => {
      const now = new Date();
      const estimated = new Date(order.estimatedDeliveryTime);
      const diff = estimated.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Arriving now");
      } else {
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, order.status, order.estimatedDeliveryTime]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right-full duration-300">
      <Card className="border-green-200 bg-green-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-green-600" />
                <h3 className="font-medium text-green-900">Courier Nearby!</h3>
              </div>

              <p className="text-sm text-green-800 mb-3">
                Your delivery is approaching. Please be available to receive
                your order.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-green-700">
                  <Clock className="h-3 w-3" />
                  <span>ETA: {timeRemaining}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-green-700">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">
                    {order.deliveryAddress.street}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // In a real app, this would mark as received
                    console.log("Order marked as received");
                    onDismiss();
                  }}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  I'm Ready
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-green-700 hover:text-green-800 hover:bg-green-100"
                  onClick={onDismiss}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
