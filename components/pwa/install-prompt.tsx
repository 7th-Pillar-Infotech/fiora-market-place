"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWA } from "@/lib/pwa-utils";
import { Download, X, Smartphone } from "lucide-react";

interface InstallPromptProps {
  onDismiss?: () => void;
  compact?: boolean;
}

export function InstallPrompt({
  onDismiss,
  compact = false,
}: InstallPromptProps) {
  const { canInstall, install } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!canInstall || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await install();
      if (success) {
        setIsDismissed(true);
        onDismiss?.();
      }
    } catch (error) {
      console.error("Install failed:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (compact) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <Card className="shadow-strong border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                  Install Fiora
                </p>
                <p className="text-xs text-neutral-600">
                  Get the app for faster access
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="text-xs"
                >
                  {isInstalling ? "Installing..." : "Install"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDismiss}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-strong border-primary-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                Install Fiora App
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Install our app for faster access, offline browsing, and push
                notifications about your orders.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isInstalling ? "Installing..." : "Install App"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-neutral-600"
                >
                  Maybe Later
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
