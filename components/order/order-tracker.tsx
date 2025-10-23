"use client";

import React from "react";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface OrderTrackerProps {
  order: Order;
}

export function OrderTracker({ order }: OrderTrackerProps) {
  const steps = [
    {
      id: "confirmed",
      label: "Order Confirmed",
      description: "Your order has been received and confirmed",
      icon: CheckCircle,
    },
    {
      id: "preparing",
      label: "Preparing Order",
      description: "Our florists are preparing your fresh flowers",
      icon: Package,
    },
    {
      id: "out_for_delivery",
      label: "Out for Delivery",
      description: "Your order is on the way to your address",
      icon: Truck,
    },
    {
      id: "delivered",
      label: "Delivered",
      description: "Your order has been successfully delivered",
      icon: CheckCircle,
    },
  ];

  const getStepStatus = (stepId: string) => {
    const statusOrder = [
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepId);

    if (order.status === "cancelled") {
      return stepIndex === 0 ? "completed" : "cancelled";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Order Confirmed",
          color: "bg-blue-100 text-blue-800",
          icon: CheckCircle,
          iconColor: "text-blue-600",
        };
      case "preparing":
        return {
          label: "Preparing Your Order",
          color: "bg-yellow-100 text-yellow-800",
          icon: Package,
          iconColor: "text-yellow-600",
        };
      case "out_for_delivery":
        return {
          label: "Out for Delivery",
          color: "bg-purple-100 text-purple-800",
          icon: Truck,
          iconColor: "text-purple-600",
        };
      case "delivered":
        return {
          label: "Delivered Successfully",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          iconColor: "text-green-600",
        };
      case "cancelled":
        return {
          label: "Order Cancelled",
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          iconColor: "text-red-600",
        };
      default:
        return {
          label: "Unknown Status",
          color: "bg-neutral-100 text-neutral-800",
          icon: AlertCircle,
          iconColor: "text-neutral-600",
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const estimatedDate = new Date(order.estimatedDeliveryTime);
  const createdDate = new Date(order.createdAt);
  const updatedDate = new Date(order.updatedAt);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary-500" />
            Order Status
          </CardTitle>
          <Badge className={statusConfig.color}>
            <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig.iconColor}`} />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex gap-4">
                {/* Icon */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stepStatus === "completed"
                        ? "bg-green-100 text-green-600"
                        : stepStatus === "current"
                        ? "bg-blue-100 text-blue-600"
                        : stepStatus === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {stepStatus === "cancelled" ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-8 mt-2 ${
                        stepStatus === "completed"
                          ? "bg-green-200"
                          : stepStatus === "cancelled"
                          ? "bg-red-200"
                          : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium ${
                        stepStatus === "completed" || stepStatus === "current"
                          ? "text-neutral-900"
                          : stepStatus === "cancelled"
                          ? "text-red-600"
                          : "text-neutral-500"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {stepStatus === "current" && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Clock className="h-3 w-3" />
                        <span>In Progress</span>
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      stepStatus === "completed" || stepStatus === "current"
                        ? "text-neutral-600"
                        : stepStatus === "cancelled"
                        ? "text-red-500"
                        : "text-neutral-400"
                    }`}
                  >
                    {stepStatus === "cancelled" && step.id !== "confirmed"
                      ? "This step was cancelled"
                      : step.description}
                  </p>

                  {/* Timestamps */}
                  {stepStatus === "completed" && (
                    <div className="text-xs text-neutral-500 mt-1">
                      {step.id === "confirmed" && (
                        <span>
                          {createdDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {createdDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                      {step.id === "delivered" && order.actualDeliveryTime && (
                        <span>
                          {new Date(
                            order.actualDeliveryTime
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(
                            order.actualDeliveryTime
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Current step additional info */}
                  {stepStatus === "current" && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      {step.id === "preparing" && (
                        <div className="text-sm text-blue-800">
                          <div className="font-medium mb-1">
                            Estimated completion: 15-30 minutes
                          </div>
                          <div>
                            Our skilled florists are carefully selecting and
                            arranging your flowers to ensure the highest
                            quality.
                          </div>
                        </div>
                      )}
                      {step.id === "out_for_delivery" && (
                        <div className="text-sm text-blue-800">
                          <div className="font-medium mb-1">
                            Estimated delivery:{" "}
                            {estimatedDate.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              Delivering to {order.deliveryAddress.street}
                            </span>
                          </div>
                          {order.courierLocation && (
                            <div className="mt-2 text-xs">
                              <span className="inline-flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Courier location updated{" "}
                                {updatedDate.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery Information */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-neutral-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-500" />
                Delivery Time
              </h4>
              <div className="text-sm text-neutral-600">
                <div>
                  Estimated:{" "}
                  {estimatedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {estimatedDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {order.actualDeliveryTime && (
                  <div className="text-green-600 mt-1">
                    Delivered:{" "}
                    {new Date(order.actualDeliveryTime).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      }
                    )}{" "}
                    at{" "}
                    {new Date(order.actualDeliveryTime).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-neutral-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-neutral-500" />
                Delivery Address
              </h4>
              <div className="text-sm text-neutral-600">
                {order.deliveryAddress.street}
                <br />
                {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
