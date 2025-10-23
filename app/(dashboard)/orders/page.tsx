"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { orderUtils } from "@/lib/utils";
import { mockOrders } from "@/lib/mock-data";
import { OrderHistoryList } from "@/components/order/order-history-list";
import { OrderFilters } from "@/components/order/order-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all" as "all" | Order["status"],
    dateRange: "all" as "all" | "week" | "month" | "year",
    sortBy: "newest" as "newest" | "oldest" | "amount_high" | "amount_low",
  });

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        // Get orders from localStorage, fallback to mock data
        let savedOrders = orderUtils.getOrders();

        // If no saved orders, initialize with mock data
        if (savedOrders.length === 0) {
          savedOrders = mockOrders;
          orderUtils.saveOrders(savedOrders);
        }

        setOrders(savedOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Apply filters whenever orders or filters change
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    // Filter by date range
    const now = new Date();
    if (filters.dateRange !== "all") {
      const cutoffDate = new Date();
      switch (filters.dateRange) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= cutoffDate
      );
    }

    // Sort orders
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "amount_high":
        filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "amount_low":
        filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  // Calculate order statistics
  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    pending: orders.filter((o) =>
      ["confirmed", "preparing", "out_for_delivery"].includes(o.status)
    ).length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Order History</h1>
          <p className="text-neutral-600 mt-1">
            Track your orders and view your purchase history
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {stats.total}
                  </div>
                  <div className="text-sm text-neutral-600">Total Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {stats.delivered}
                  </div>
                  <div className="text-sm text-neutral-600">Delivered</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {stats.pending}
                  </div>
                  <div className="text-sm text-neutral-600">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {stats.cancelled}
                  </div>
                  <div className="text-sm text-neutral-600">Cancelled</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <OrderFilters
          filters={filters}
          onFiltersChange={setFilters}
          orderCount={filteredOrders.length}
        />

        {/* Orders List */}
        <OrderHistoryList orders={filteredOrders} />
      </div>
    </div>
  );
}
