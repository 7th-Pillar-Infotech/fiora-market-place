"use client";

import React, { useState, useEffect } from "react";
import { InstallPrompt } from "./install-prompt";
import { NotificationPrompt } from "./notification-prompt";
import { UpdatePrompt } from "./update-prompt";

interface PWAProviderProps {
  children: React.ReactNode;
  showInstallPrompt?: boolean;
  showNotificationPrompt?: boolean;
  showUpdatePrompt?: boolean;
  installPromptDelay?: number;
  notificationPromptDelay?: number;
}

export function PWAProvider({
  children,
  showInstallPrompt = true,
  showNotificationPrompt = true,
  showUpdatePrompt = true,
  installPromptDelay = 10000, // 10 seconds
  notificationPromptDelay = 30000, // 30 seconds
}: PWAProviderProps) {
  const [showInstall, setShowInstall] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    // Show install prompt after delay
    if (showInstallPrompt) {
      const timer = setTimeout(() => {
        setShowInstall(true);
      }, installPromptDelay);

      return () => clearTimeout(timer);
    }
  }, [showInstallPrompt, installPromptDelay]);

  useEffect(() => {
    // Show notification prompt after delay
    if (showNotificationPrompt) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, notificationPromptDelay);

      return () => clearTimeout(timer);
    }
  }, [showNotificationPrompt, notificationPromptDelay]);

  useEffect(() => {
    // Listen for order placed events
    const handleOrderPlaced = () => {
      setOrderPlaced(true);
      setShowNotification(true);
    };

    window.addEventListener("order-placed", handleOrderPlaced);
    return () => window.removeEventListener("order-placed", handleOrderPlaced);
  }, []);

  const handleInstallDismiss = () => {
    setShowInstall(false);
  };

  const handleNotificationDismiss = () => {
    setShowNotification(false);
  };

  const handleNotificationGranted = () => {
    setShowNotification(false);
    // Show a success message or toast
    console.log("Notifications enabled successfully");
  };

  const handleUpdateDismiss = () => {
    // Update prompt handles its own state
  };

  const handleUpdated = () => {
    // App will reload after update
    console.log("App updated successfully");
  };

  return (
    <>
      {children}

      {/* PWA Prompts */}
      {showInstall && (
        <InstallPrompt onDismiss={handleInstallDismiss} compact={false} />
      )}

      {showNotification && (
        <NotificationPrompt
          onDismiss={handleNotificationDismiss}
          onPermissionGranted={handleNotificationGranted}
          trigger={orderPlaced ? "order-placed" : "auto"}
        />
      )}

      {showUpdatePrompt && (
        <UpdatePrompt
          onDismiss={handleUpdateDismiss}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
}
