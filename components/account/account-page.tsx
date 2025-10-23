"use client";

import * as React from "react";
import Link from "next/link";
import { User, MapPin, Bell, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./profile-form";
import { AddressBook } from "./address-book";
import { NotificationSettings } from "./notification-settings";

type TabType = "profile" | "addresses" | "notifications" | "orders";

export function AccountPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>("profile");

  const tabs = [
    {
      id: "profile" as const,
      label: "Profile",
      icon: User,
      description: "Manage your personal information",
    },
    {
      id: "addresses" as const,
      label: "Addresses",
      icon: MapPin,
      description: "Manage your delivery addresses",
    },
    {
      id: "notifications" as const,
      label: "Notifications",
      icon: Bell,
      description: "Control your notification preferences",
    },
    {
      id: "orders" as const,
      label: "Order History",
      icon: Package,
      description: "View your past orders",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileForm />;
      case "addresses":
        return <AddressBook />;
      case "notifications":
        return <NotificationSettings />;
      case "orders":
        return (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">
              Order history is available on the{" "}
              <Link href="/orders" className="text-primary-600 hover:underline">
                Orders page
              </Link>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Account Settings
        </h1>
        <p className="text-neutral-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-neutral-500 hidden sm:block">
                        {tab.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">{renderTabContent()}</Card>
        </div>
      </div>
    </div>
  );
}
