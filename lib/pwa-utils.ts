"use client";

import React from "react";

// Type definition for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// PWA Installation and Service Worker utilities
export class PWAManager {
  private static instance: PWAManager;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private swRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  private async init() {
    // Check if app is already installed
    this.checkInstallationStatus();

    // Listen for install prompt
    this.setupInstallPrompt();

    // Register service worker
    await this.registerServiceWorker();

    // Setup push notifications
    this.setupPushNotifications();
  }

  private checkInstallationStatus() {
    // Check if running in standalone mode (installed)
    this.isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
  }

  private setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("PWA: Install prompt available");
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent("pwa-install-available"));
    });

    window.addEventListener("appinstalled", () => {
      console.log("PWA: App installed");
      this.isInstalled = true;
      this.deferredPrompt = null;

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("pwa-installed"));
    });
  }

  private setupPushNotifications() {
    if ("Notification" in window && "serviceWorker" in navigator) {
      // Request permission on user interaction
      this.requestNotificationPermission();
    }
  }

  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("PWA: Service Worker registered", registration);
        this.swRegistration = registration;

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          console.log("PWA: Service Worker update found");
          window.dispatchEvent(new CustomEvent("pwa-update-available"));
        });

        return registration;
      } catch (error) {
        console.error("PWA: Service Worker registration failed", error);
        return null;
      }
    }
    return null;
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log("PWA: Install prompt result", outcome);

      this.deferredPrompt = null;
      return outcome === "accepted";
    } catch (error) {
      console.error("PWA: Install prompt failed", error);
      return false;
    }
  }

  canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled;
  }

  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("PWA: Notifications not supported");
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission === "denied") {
      return "denied";
    }

    const permission = await Notification.requestPermission();
    console.log("PWA: Notification permission", permission);
    return permission;
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error("PWA: Service Worker not registered");
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
        ) as BufferSource,
      });

      console.log("PWA: Push subscription created", subscription);

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      console.error("PWA: Push subscription failed", error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error("Failed to send subscription to server");
      }

      console.log("PWA: Subscription sent to server");
    } catch (error) {
      console.error("PWA: Failed to send subscription to server", error);
    }
  }

  async showNotification(title: string, options?: NotificationOptions) {
    if (!this.swRegistration) {
      console.error("PWA: Service Worker not registered");
      return;
    }

    const permission = await this.requestNotificationPermission();
    if (permission !== "granted") {
      console.warn("PWA: Notification permission not granted");
      return;
    }

    try {
      await this.swRegistration.showNotification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        ...options,
      });
    } catch (error) {
      console.error("PWA: Failed to show notification", error);
    }
  }

  async updateServiceWorker() {
    if (!this.swRegistration) {
      return;
    }

    try {
      await this.swRegistration.update();
      console.log("PWA: Service Worker updated");
    } catch (error) {
      console.error("PWA: Service Worker update failed", error);
    }
  }
}

// Hook for using PWA features in React components
export function usePWA() {
  const [canInstall, setCanInstall] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    const pwa = PWAManager.getInstance();

    setCanInstall(pwa.canInstall());
    setIsInstalled(pwa.isAppInstalled());

    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    window.addEventListener("pwa-install-available", handleInstallAvailable);
    window.addEventListener("pwa-installed", handleInstalled);
    window.addEventListener("pwa-update-available", handleUpdateAvailable);

    return () => {
      window.removeEventListener(
        "pwa-install-available",
        handleInstallAvailable
      );
      window.removeEventListener("pwa-installed", handleInstalled);
      window.removeEventListener("pwa-update-available", handleUpdateAvailable);
    };
  }, []);

  const install = async () => {
    const pwa = PWAManager.getInstance();
    const success = await pwa.promptInstall();
    if (success) {
      setCanInstall(false);
    }
    return success;
  };

  const requestNotifications = async () => {
    const pwa = PWAManager.getInstance();
    return await pwa.requestNotificationPermission();
  };

  const subscribeToNotifications = async () => {
    const pwa = PWAManager.getInstance();
    return await pwa.subscribeToPushNotifications();
  };

  const showNotification = async (
    title: string,
    options?: NotificationOptions
  ) => {
    const pwa = PWAManager.getInstance();
    return await pwa.showNotification(title, options);
  };

  const updateApp = async () => {
    const pwa = PWAManager.getInstance();
    await pwa.updateServiceWorker();
    setUpdateAvailable(false);
    window.location.reload();
  };

  return {
    canInstall,
    isInstalled,
    updateAvailable,
    install,
    requestNotifications,
    subscribeToNotifications,
    showNotification,
    updateApp,
  };
}
