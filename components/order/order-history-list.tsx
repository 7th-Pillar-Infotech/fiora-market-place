"use client";

import React from "react";
import { Order } from "@/lib/types";
import { OrderHistoryCard } from "./order-history-card";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingBag } from "lucide-react";

interface OrderHistoryListProps {
  orders: Order[];
}

export function OrderHistoryList({ orders }: OrderHistoryListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-8 w-8 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No orders found
              </h3>
              <p className="text-neutral-600 max-w-md mx-auto">
                You haven't placed any orders yet, or no orders match your
                current filters. Start shopping to see your order history here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <Package className="h-4 w-4" />
        <span>
          {orders.length} {orders.length === 1 ? "order" : "orders"} found
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderHistoryCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
