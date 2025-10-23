"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Wifi, RefreshCw, X } from "lucide-react";

interface OfflineDetectorProps {
  children: React.ReactNode;
  showBanner?: boolean;
  showModal?: boolean;
}

export function OfflineDetector({
  children,
  showBanner = true,
  showModal = false,
}: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show reconnection notification briefly
        setTimeout(() => setWasOffline(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      if (showModal) {
        setShowOfflineModal(true);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showModal, wasOffline]);

  const handleRetry = () => {
    // Force a connection check
    if (navigator.onLine) {
      setIsOnline(true);
      setShowOfflineModal(false);
    } else {
      // Still offline, show feedback
      console.log("Still offline, please check your connection");
    }
  };

  return (
    <>
      {children}

      {/* Offline Banner */}
      {showBanner && !isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">
                You're offline. Some features may not work properly.
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-white hover:bg-red-700 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Reconnection Banner */}
      {showBanner && isOnline && wasOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">You're back online!</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWasOffline(false)}
              className="text-white hover:bg-green-700"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Offline Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <WifiOff className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                You're Offline
              </h3>
              <p className="text-neutral-600 mb-6">
                Please check your internet connection and try again. Some
                features may not work while offline.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleRetry}
                  className="flex-1 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowOfflineModal(false)}
                  className="flex-1"
                >
                  Continue Offline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook for offline state
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

// Offline status indicator component
export function OfflineStatusIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <Badge variant="destructive" className="fixed bottom-4 right-4 z-40">
      <WifiOff className="w-3 h-3 mr-1" />
      Offline
    </Badge>
  );
}
