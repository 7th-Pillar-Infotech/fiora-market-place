"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { orderUtils } from "@/lib/utils";
import { mockOrders } from "@/lib/mock-data";
import { OrderTracker } from "@/components/order/order-tracker";
import { OrderDetails } from "@/components/order/order-details";
import { CourierMap } from "@/components/order/courier-map";
import { ProximityNotification } from "@/components/order/proximity-notification";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProximityNotification, setShowProximityNotification] =
    useState(false);

  // Load order data
  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get orders from localStorage, fallback to mock data
        let savedOrders = orderUtils.getOrders();

        // If no saved orders, initialize with mock data
        if (savedOrders.length === 0) {
          savedOrders = mockOrders;
          orderUtils.saveOrders(savedOrders);
        }

        const foundOrder = savedOrders.find((o) => o.id === orderId);

        if (!foundOrder) {
          setError("Order not found");
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        setError("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  // Calculate distance between two coordinates
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

  // Simulate real-time updates for active orders
  useEffect(() => {
    if (
      !order ||
      order.status === "delivered" ||
      order.status === "cancelled"
    ) {
      return;
    }

    const interval = setInterval(() => {
      // Simulate status updates and courier location changes
      const updatedOrders = orderUtils.getOrders();
      const currentOrder = updatedOrders.find((o) => o.id === orderId);

      if (currentOrder) {
        // Simulate courier location updates for out_for_delivery orders
        if (currentOrder.status === "out_for_delivery" && Math.random() > 0.7) {
          // Update courier location slightly
          if (currentOrder.courierLocation) {
            currentOrder.courierLocation = {
              lat:
                currentOrder.courierLocation.lat +
                (Math.random() - 0.5) * 0.001,
              lng:
                currentOrder.courierLocation.lng +
                (Math.random() - 0.5) * 0.001,
            };
            currentOrder.updatedAt = new Date();

            // Check if courier is nearby (within 500m)
            const distance = calculateDistance(
              currentOrder.courierLocation,
              currentOrder.deliveryAddress.coordinates
            );

            if (distance < 0.5 && !showProximityNotification) {
              setShowProximityNotification(true);
            }

            orderUtils.saveOrders(updatedOrders);
            setOrder({ ...currentOrder });
          }
        }
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [order, orderId, showProximityNotification]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-48"></div>
          <div className="h-64 bg-neutral-200 rounded"></div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {error || "Order Not Found"}
          </h1>
          <p className="text-neutral-600 mb-6">
            {error === "Order not found"
              ? "The order you're looking for doesn't exist or may have been removed."
              : "We couldn't load the order details. Please try again."}
          </p>
          <Button asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Order #{order.id}
            </h1>
            <p className="text-neutral-600">
              Track your order status and delivery progress
            </p>
          </div>
        </div>

        {/* Order Tracking */}
        <OrderTracker order={order} />

        {/* Courier Map (only for out_for_delivery status) */}
        {order.status === "out_for_delivery" && order.courierLocation && (
          <CourierMap
            order={order}
            onLocationUpdate={(location) => {
              // Update order with new courier location
              const updatedOrder = {
                ...order,
                courierLocation: location,
                updatedAt: new Date(),
              };
              setOrder(updatedOrder);

              // Update in localStorage
              const orders = orderUtils.getOrders();
              const orderIndex = orders.findIndex((o) => o.id === order.id);
              if (orderIndex >= 0) {
                orders[orderIndex] = updatedOrder;
                orderUtils.saveOrders(orders);
              }
            }}
          />
        )}

        {/* Order Details */}
        <OrderDetails order={order} />
      </div>

      {/* Proximity Notification */}
      <ProximityNotification
        order={order}
        isVisible={showProximityNotification}
        onDismiss={() => setShowProximityNotification(false)}
      />
    </div>
  );
}
