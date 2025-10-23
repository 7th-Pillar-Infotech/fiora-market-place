"use client";

import { PWAManager } from "./pwa-utils";

export interface OrderNotificationData {
  orderId: string;
  status: "confirmed" | "preparing" | "out_for_delivery" | "delivered";
  message?: string;
  estimatedDelivery?: Date;
  courierName?: string;
}

export class OrderNotificationManager {
  private static instance: OrderNotificationManager;
  private pwa: PWAManager;

  private constructor() {
    this.pwa = PWAManager.getInstance();
  }

  static getInstance(): OrderNotificationManager {
    if (!OrderNotificationManager.instance) {
      OrderNotificationManager.instance = new OrderNotificationManager();
    }
    return OrderNotificationManager.instance;
  }

  async notifyOrderUpdate(data: OrderNotificationData) {
    const { orderId, status, message, estimatedDelivery, courierName } = data;

    const statusMessages = {
      confirmed: "Your order has been confirmed and is being prepared.",
      preparing: "Your flowers are being carefully prepared for delivery.",
      out_for_delivery: courierName
        ? `${courierName} is on the way with your flowers!`
        : "Your order is out for delivery!",
      delivered: "Your flowers have been delivered. Enjoy!",
    };

    const title = `Order #${orderId.slice(-6)} - ${status
      .replace("_", " ")
      .toUpperCase()}`;
    const body = message || statusMessages[status];

    const options: NotificationOptions = {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      tag: `order-${orderId}`,
      data: {
        orderId,
        status,
        url: `/orders/${orderId}`,
        timestamp: Date.now(),
      },
    };

    // Add delivery time for out_for_delivery status
    if (status === "out_for_delivery" && estimatedDelivery) {
      const timeString = estimatedDelivery.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      options.body += ` Expected delivery: ${timeString}`;
    }

    try {
      await this.pwa.showNotification(title, options);

      // Store notification in localStorage for offline access
      this.storeNotification({
        id: `order-${orderId}-${Date.now()}`,
        title,
        body: options.body || "",
        timestamp: Date.now(),
        orderId,
        status,
        read: false,
      });

      console.log("Order notification sent:", { orderId, status });
    } catch (error) {
      console.error("Failed to send order notification:", error);
    }
  }

  async notifyOrderPlaced(orderId: string, estimatedDelivery?: Date) {
    // Trigger the order placed event for notification prompt
    window.dispatchEvent(
      new CustomEvent("order-placed", {
        detail: { orderId, estimatedDelivery },
      })
    );

    const timeString = estimatedDelivery?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    await this.notifyOrderUpdate({
      orderId,
      status: "confirmed",
      message: `Your order has been placed successfully! ${
        timeString ? `Expected delivery: ${timeString}` : ""
      }`,
    });
  }

  async notifyDeliveryProximity(
    orderId: string,
    courierName: string,
    minutesAway: number
  ) {
    const title = `${courierName} is nearby!`;
    const body = `Your flowers will arrive in approximately ${minutesAway} minutes.`;

    const options: NotificationOptions = {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      tag: `proximity-${orderId}`,
      data: {
        orderId,
        type: "proximity",
        url: `/orders/${orderId}`,
        timestamp: Date.now(),
      },
    };

    try {
      await this.pwa.showNotification(title, options);
      console.log("Proximity notification sent:", { orderId, minutesAway });
    } catch (error) {
      console.error("Failed to send proximity notification:", error);
    }
  }

  private storeNotification(notification: {
    id: string;
    title: string;
    body: string;
    timestamp: number;
    orderId: string;
    status: string;
    read: boolean;
  }) {
    try {
      const stored = JSON.parse(
        localStorage.getItem("order-notifications") || "[]"
      );
      stored.unshift(notification);

      // Keep only last 50 notifications
      const trimmed = stored.slice(0, 50);
      localStorage.setItem("order-notifications", JSON.stringify(trimmed));
    } catch (error) {
      console.error("Failed to store notification:", error);
    }
  }

  getStoredNotifications() {
    try {
      return JSON.parse(localStorage.getItem("order-notifications") || "[]");
    } catch (error) {
      console.error("Failed to get stored notifications:", error);
      return [];
    }
  }

  markNotificationAsRead(notificationId: string) {
    try {
      const stored = JSON.parse(
        localStorage.getItem("order-notifications") || "[]"
      );
      const updated = stored.map((n: { id: string; read: boolean }) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem("order-notifications", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }
}

// Hook for using order notifications in React components
export function useOrderNotifications() {
  const manager = OrderNotificationManager.getInstance();

  const notifyOrderUpdate = (data: OrderNotificationData) => {
    return manager.notifyOrderUpdate(data);
  };

  const notifyOrderPlaced = (orderId: string, estimatedDelivery?: Date) => {
    return manager.notifyOrderPlaced(orderId, estimatedDelivery);
  };

  const notifyDeliveryProximity = (
    orderId: string,
    courierName: string,
    minutesAway: number
  ) => {
    return manager.notifyDeliveryProximity(orderId, courierName, minutesAway);
  };

  const getNotifications = () => {
    return manager.getStoredNotifications();
  };

  const markAsRead = (notificationId: string) => {
    return manager.markNotificationAsRead(notificationId);
  };

  return {
    notifyOrderUpdate,
    notifyOrderPlaced,
    notifyDeliveryProximity,
    getNotifications,
    markAsRead,
  };
}
