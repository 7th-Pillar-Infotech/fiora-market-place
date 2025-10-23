"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWA } from "@/lib/pwa-utils";
import { RefreshCw, X, Download } from "lucide-react";

interface UpdatePromptProps {
  onDismiss?: () => void;
  onUpdated?: () => void;
}

export function UpdatePrompt({ onDismiss, onUpdated }: UpdatePromptProps) {
  const { updateAvailable, updateApp } = usePWA();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!updateAvailable || isDismissed) {
    return null;
  }

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateApp();
      onUpdated?.();
    } catch (error) {
      console.error("Update failed:", error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-strong border-info-200 bg-info-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-info-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-info-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-info-900">
                Update Available
              </p>
              <p className="text-xs text-info-700">
                A new version of Fiora is ready to install
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="text-xs bg-info-600 hover:bg-info-700"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDismiss}
                className="text-info-400 hover:text-info-600"
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
