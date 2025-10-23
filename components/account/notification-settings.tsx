"use client";

import * as React from "react";
import { Bell, Mail, MessageSquare, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loadFromStorage, saveToStorage } from "@/lib/mock-data";
import type { Customer } from "@/lib/types";

interface NotificationPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  smsUpdates: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  weeklyNewsletter: boolean;
}

export function NotificationSettings() {
  const [preferences, setPreferences] = React.useState<NotificationPreferences>(
    {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
      orderUpdates: true,
      promotionalEmails: false,
      weeklyNewsletter: false,
    }
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  // Load preferences on mount
  React.useEffect(() => {
    const savedCustomer = loadFromStorage<Customer>("fiora_customer", {
      id: "customer-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+380501234567",
      addresses: [],
      preferences: {
        notifications: true,
        emailUpdates: true,
        smsUpdates: false,
      },
    });

    setPreferences({
      notifications: savedCustomer.preferences.notifications,
      emailUpdates: savedCustomer.preferences.emailUpdates,
      smsUpdates: savedCustomer.preferences.smsUpdates,
      orderUpdates: true, // Default for new preference
      promotionalEmails: false, // Default for new preference
      weeklyNewsletter: false, // Default for new preference
    });
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    if (isSaved) {
      setIsSaved(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Save to localStorage
      const currentCustomer = loadFromStorage<Customer>("fiora_customer", {
        id: "customer-1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+380501234567",
        addresses: [],
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false,
        },
      });

      const updatedCustomer: Customer = {
        ...currentCustomer,
        preferences: {
          notifications: preferences.notifications,
          emailUpdates: preferences.emailUpdates,
          smsUpdates: preferences.smsUpdates,
        },
      };

      saveToStorage("fiora_customer", updatedCustomer);
      setIsSaved(true);

      // Clear saved state after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const notificationGroups = [
    {
      title: "Order Notifications",
      description: "Get updates about your orders and deliveries",
      icon: Bell,
      settings: [
        {
          key: "notifications" as const,
          label: "Push Notifications",
          description: "Receive notifications in your browser",
          enabled: preferences.notifications,
        },
        {
          key: "orderUpdates" as const,
          label: "Order Status Updates",
          description: "Get notified when your order status changes",
          enabled: preferences.orderUpdates,
        },
      ],
    },
    {
      title: "Email Communications",
      description: "Control what emails you receive from us",
      icon: Mail,
      settings: [
        {
          key: "emailUpdates" as const,
          label: "Order Email Updates",
          description:
            "Receive order confirmations and delivery updates via email",
          enabled: preferences.emailUpdates,
        },
        {
          key: "promotionalEmails" as const,
          label: "Promotional Emails",
          description: "Get notified about special offers and discounts",
          enabled: preferences.promotionalEmails,
        },
        {
          key: "weeklyNewsletter" as const,
          label: "Weekly Newsletter",
          description: "Receive our weekly newsletter with flower care tips",
          enabled: preferences.weeklyNewsletter,
        },
      ],
    },
    {
      title: "SMS Notifications",
      description: "Receive text messages on your phone",
      icon: MessageSquare,
      settings: [
        {
          key: "smsUpdates" as const,
          label: "SMS Updates",
          description: "Get order updates and delivery notifications via SMS",
          enabled: preferences.smsUpdates,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Notification Preferences
        </h2>
        <p className="text-neutral-600">
          Choose how you want to be notified about orders and updates
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {notificationGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.title} className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {group.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {group.settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <label
                          htmlFor={setting.key}
                          className="font-medium text-neutral-900 cursor-pointer"
                        >
                          {setting.label}
                        </label>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">
                        {setting.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        id={setting.key}
                        onClick={() => handleToggle(setting.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                          setting.enabled ? "bg-primary-600" : "bg-neutral-200"
                        }`}
                        role="switch"
                        aria-checked={setting.enabled}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {/* Important Notice */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900">Important</h4>
              <p className="text-sm text-amber-800 mt-1">
                You will always receive critical order notifications
                (confirmations, cancellations, and delivery issues) regardless
                of these settings to ensure you stay informed about your
                purchases.
              </p>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            {isSaved && (
              <div className="flex items-center text-sm text-green-600">
                <Save className="h-4 w-4 mr-1" />
                Preferences saved successfully
              </div>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
