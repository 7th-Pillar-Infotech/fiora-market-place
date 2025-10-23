"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  User,
  ShoppingCart,
  Package,
} from "lucide-react";
import {
  userJourneys,
  runUserJourney,
  UserJourney,
  JourneyStep,
  ValidationResult,
} from "@/lib/user-journey-validation";

interface JourneyTestResult {
  step: JourneyStep;
  result: ValidationResult;
  duration: number;
}

interface JourneyTestSummary {
  totalSteps: number;
  passedSteps: number;
  failedSteps: number;
  totalDuration: number;
}

export function UserJourneyTest() {
  const [selectedJourney, setSelectedJourney] = useState<string>(
    "completeShoppingJourney"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [results, setResults] = useState<JourneyTestResult[]>([]);
  const [summary, setSummary] = useState<JourneyTestSummary | null>(null);

  const journeys = Object.entries(userJourneys).map(([key, journey]) => ({
    key,
    ...journey,
  }));

  const currentJourney =
    userJourneys[selectedJourney as keyof typeof userJourneys];

  const runJourney = async () => {
    if (!currentJourney) return;

    setIsRunning(true);
    setCurrentStep(0);
    setResults([]);
    setSummary(null);

    try {
      const journeyResult = await runUserJourney(currentJourney);
      setResults(journeyResult.results);
      setSummary(journeyResult.summary);
    } catch (error) {
      console.error("Journey execution failed:", error);
    } finally {
      setIsRunning(false);
      setCurrentStep(-1);
    }
  };

  const resetResults = () => {
    setResults([]);
    setSummary(null);
    setCurrentStep(-1);
  };

  const getStatusIcon = (result?: ValidationResult) => {
    if (!result) return <Clock className="h-4 w-4 text-neutral-400" />;

    if (result.success) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (result?: ValidationResult) => {
    if (!result) return <Badge variant="outline">Pending</Badge>;

    if (result.success) {
      return <Badge variant="success">Passed</Badge>;
    } else {
      return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getJourneyIcon = (journeyKey: string) => {
    switch (journeyKey) {
      case "completeShoppingJourney":
        return <ShoppingCart className="h-5 w-5" />;
      case "dataPersistenceJourney":
        return <Package className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const progress =
    currentJourney && currentStep >= 0
      ? (currentStep / currentJourney.steps.length) * 100
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Journey Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Journey Testing
          </CardTitle>
          <p className="text-sm text-neutral-600">
            Test complete user workflows to validate end-to-end functionality.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {journeys.map((journey) => (
              <div
                key={journey.key}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedJourney === journey.key
                    ? "border-primary-500 bg-primary-50"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
                onClick={() => setSelectedJourney(journey.key)}
              >
                <div className="flex items-start gap-3">
                  {getJourneyIcon(journey.key)}
                  <div className="flex-1">
                    <div className="font-medium">{journey.name}</div>
                    <div className="text-sm text-neutral-600 mt-1">
                      {journey.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {journey.steps.length} steps
                      </Badge>
                      <div className="text-xs text-neutral-500">
                        Requirements: {journey.requirements.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {summary && (
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-600">
                      {summary.passedSteps}
                    </span>{" "}
                    passed
                  </div>
                  <div>
                    <span className="font-medium text-red-600">
                      {summary.failedSteps}
                    </span>{" "}
                    failed
                  </div>
                  <div>
                    <span className="font-medium">
                      {formatDuration(summary.totalDuration)}
                    </span>{" "}
                    total
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetResults}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={runJourney}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Running Journey...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Journey
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">
                  Step {currentStep + 1} of {currentJourney?.steps.length}
                </div>
                <div className="text-sm text-neutral-600">
                  {Math.round(progress)}%
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              {currentJourney &&
                currentStep >= 0 &&
                currentStep < currentJourney.steps.length && (
                  <div className="text-sm text-neutral-600 mt-1">
                    {currentJourney.steps[currentStep].name}
                  </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Journey Steps and Results */}
      {currentJourney && (
        <Card>
          <CardHeader>
            <CardTitle>{currentJourney.name} - Steps</CardTitle>
            <p className="text-sm text-neutral-600">
              {currentJourney.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentJourney.steps.map((step, index) => {
                const result = results.find((r) => r.step.id === step.id);
                const isCurrentStep = isRunning && currentStep === index;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      isCurrentStep
                        ? "border-blue-200 bg-blue-50"
                        : "border-neutral-200"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {isCurrentStep ? (
                        <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                      ) : (
                        getStatusIcon(result?.result)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{step.name}</div>
                          <div className="text-sm text-neutral-600 mt-1">
                            {step.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {result && (
                            <div className="text-xs text-neutral-500">
                              {formatDuration(result.duration)}
                            </div>
                          )}
                          {isCurrentStep ? (
                            <Badge variant="secondary">Running</Badge>
                          ) : (
                            getStatusBadge(result?.result)
                          )}
                        </div>
                      </div>

                      {result?.result && (
                        <div className="mt-3 space-y-2">
                          <div
                            className={`text-sm ${
                              result.result.success
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {result.result.message}
                          </div>

                          {result.result.details && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-neutral-500">
                                View details
                              </summary>
                              <pre className="bg-neutral-100 p-2 rounded mt-1 overflow-auto">
                                {JSON.stringify(result.result.details, null, 2)}
                              </pre>
                            </details>
                          )}

                          {result.result.errors &&
                            result.result.errors.length > 0 && (
                              <div className="text-xs text-red-600">
                                <div className="font-medium">Errors:</div>
                                <ul className="list-disc list-inside mt-1">
                                  {result.result.errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Journey Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <div className="text-2xl font-bold text-neutral-900">
                  {summary.totalSteps}
                </div>
                <div className="text-sm text-neutral-600">Total Steps</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {summary.passedSteps}
                </div>
                <div className="text-sm text-green-700">Passed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {summary.failedSteps}
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatDuration(summary.totalDuration)}
                </div>
                <div className="text-sm text-blue-700">Duration</div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-neutral-50">
              <div className="font-medium mb-2">
                Journey Status:{" "}
                {summary.failedSteps === 0 ? (
                  <Badge variant="success">All Steps Passed</Badge>
                ) : (
                  <Badge variant="destructive">Some Steps Failed</Badge>
                )}
              </div>
              <div className="text-sm text-neutral-600">
                Success Rate:{" "}
                {Math.round((summary.passedSteps / summary.totalSteps) * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
