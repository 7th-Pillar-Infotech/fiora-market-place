"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWA } from "@/lib/pwa-utils";
import { Bell, X, BellRing } from "lucide-react";

interface NotificationPromptProps {
  onDismiss?: () => void;
  onPermissionGranted?: () => void;
  trigger?: "manual" | "auto" | "order-placed";
}

export function NotificationPrompt({
  onDismiss,
  onPermissionGranted,
  trigger = "manual",
}: NotificationPromptProps) {
  const { requestNotifications, subscribeToNotifications } = usePWA();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if we should show the prompt
    const checkPermission = () => {
      if (typeof window === "undefined") return;

      const permission = Notification.permission;
      const hasBeenDismissed = localStorage.getItem(
        "notification-prompt-dismissed"
      );

      // Show if permission is default and hasn't been dismissed
      if (permission === "default" && !hasBeenDismissed) {
        // For auto trigger, show after a delay
        if (trigger === "auto") {
          setTimeout(() => setShouldShow(true), 5000);
        } else if (trigger === "order-placed") {
          setShouldShow(true);
        } else {
          setShouldShow(true);
        }
      }
    };

    checkPermission();
  }, [trigger]);

  if (!shouldShow || isDismissed) {
    return null;
  }

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const permission = await requestNotifications();

      if (permission === "granted") {
        // Subscribe to push notifications
        await subscribeToNotifications();
        onPermissionGranted?.();
        setIsDismissed(true);
      } else {
        // Store dismissal to avoid showing again
        localStorage.setItem("notification-prompt-dismissed", "true");
        setIsDismissed(true);
      }
    } catch (error) {
      console.error("Notification permission request failed:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("notification-prompt-dismissed", "true");
    setIsDismissed(true);
    onDismiss?.();
  };

  const getContent = () => {
    switch (trigger) {
      case "order-placed":
        return {
          title: "Stay Updated on Your Order",
          description:
            "Get notified when your flowers are being prepared, out for delivery, and delivered.",
          icon: BellRing,
        };
      case "auto":
        return {
          title: "Never Miss an Update",
          description:
            "Enable notifications to get real-time updates about your orders and special offers.",
          icon: Bell,
        };
      default:
        return {
          title: "Enable Notifications",
          description:
            "Get notified about order updates, delivery status, and special offers from your favorite shops.",
          icon: Bell,
        };
    }
  };

  const content = getContent();
  const IconComponent = content.icon;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-strong border-primary-200 animate-slide-up">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                {content.title}
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                {content.description}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleRequestPermission}
                  disabled={isRequesting}
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {isRequesting ? "Enabling..." : "Enable Notifications"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-neutral-600"
                >
                  Not Now
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
