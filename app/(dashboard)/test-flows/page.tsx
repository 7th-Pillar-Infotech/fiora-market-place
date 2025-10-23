"use client";

import React, { useState } from "react";
import { NavigationTest } from "@/components/navigation/navigation-test";
import { DataPersistenceTest } from "@/components/testing/data-persistence-test";
import { UserJourneyTest } from "@/components/testing/user-journey-test";
import { ErrorReportingTest } from "@/components/testing/error-reporting-test";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TestTube,
  ArrowRight,
  Database,
  CheckCircle,
  AlertTriangle,
  Info,
  User,
  Bug,
} from "lucide-react";

type TestTab = "navigation" | "persistence" | "journey" | "errors" | "overview";

export default function TestFlowsPage() {
  const [activeTab, setActiveTab] = useState<TestTab>("overview");

  const tabs = [
    {
      id: "overview" as TestTab,
      name: "Overview",
      icon: Info,
      description: "Test overview and instructions",
    },
    {
      id: "journey" as TestTab,
      name: "User Journeys",
      icon: User,
      description: "Test complete user workflows",
    },
    {
      id: "navigation" as TestTab,
      name: "Navigation",
      icon: ArrowRight,
      description: "Test seamless navigation between pages",
    },
    {
      id: "persistence" as TestTab,
      name: "Data Persistence",
      icon: Database,
      description: "Test data persistence across sessions",
    },
    {
      id: "errors" as TestTab,
      name: "Error Handling",
      icon: Bug,
      description: "Test error handling and reporting",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "journey":
        return <UserJourneyTest />;
      case "navigation":
        return <NavigationTest />;
      case "persistence":
        return <DataPersistenceTest />;
      case "errors":
        return <ErrorReportingTest />;
      case "overview":
      default:
        return (
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  User Flow Testing Suite
                </CardTitle>
                <p className="text-neutral-600">
                  Comprehensive testing tools for validating the complete user
                  experience in the Fiora Customer Dashboard.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">User Journey Testing</h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Tests complete user workflows from start to finish:
                    </p>
                    <ul className="text-sm text-neutral-600 space-y-1 ml-4">
                      <li>• Complete shopping journey</li>
                      <li>• Data persistence validation</li>
                      <li>• End-to-end user flows</li>
                      <li>• Requirements validation</li>
                    </ul>
                    <Button
                      onClick={() => setActiveTab("journey")}
                      className="w-full"
                    >
                      Run Journey Tests
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Navigation Testing</h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Tests seamless navigation between pages:
                    </p>
                    <ul className="text-sm text-neutral-600 space-y-1 ml-4">
                      <li>• Shop discovery and browsing</li>
                      <li>• Product catalog navigation</li>
                      <li>• Shopping cart and checkout</li>
                      <li>• Order tracking and history</li>
                    </ul>
                    <Button
                      onClick={() => setActiveTab("navigation")}
                      variant="outline"
                      className="w-full"
                    >
                      Run Navigation Tests
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">
                        Data Persistence Testing
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Tests data persistence across sessions:
                    </p>
                    <ul className="text-sm text-neutral-600 space-y-1 ml-4">
                      <li>• Shopping cart state</li>
                      <li>• User preferences</li>
                      <li>• Browsing history</li>
                      <li>• Order history</li>
                    </ul>
                    <Button
                      onClick={() => setActiveTab("persistence")}
                      variant="outline"
                      className="w-full"
                    >
                      Run Persistence Tests
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Bug className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold">Error Handling Testing</h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Tests error handling and reporting:
                    </p>
                    <ul className="text-sm text-neutral-600 space-y-1 ml-4">
                      <li>• Error boundary functionality</li>
                      <li>• User-friendly error messages</li>
                      <li>• Error logging and reporting</li>
                      <li>• Recovery mechanisms</li>
                    </ul>
                    <Button
                      onClick={() => setActiveTab("errors")}
                      variant="outline"
                      className="w-full"
                    >
                      Run Error Tests
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Test Coverage
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900">
                        Core Features
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        Shop browsing, product catalog, cart functionality
                      </div>
                      <Badge variant="success" className="mt-2">
                        Covered
                      </Badge>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900">
                        User Flows
                      </div>
                      <div className="text-sm text-blue-700 mt-1">
                        Complete purchase journey from browse to order
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        Covered
                      </Badge>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-medium text-purple-900">
                        Data Management
                      </div>
                      <div className="text-sm text-purple-700 mt-1">
                        Persistence, validation, error handling
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        Covered
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-amber-900">
                        Testing Notes
                      </div>
                      <div className="text-sm text-amber-700 mt-1">
                        These tests validate the integration and user experience
                        of the Customer Dashboard. They simulate real user
                        interactions and verify that data persists correctly
                        across browser sessions.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Tab Navigation */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">{renderTabContent()}</div>
    </div>
  );
}
