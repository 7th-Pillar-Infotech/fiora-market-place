"use client";

import React from "react";
import { Shop } from "@/lib/types";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ShopHoursProps {
  shop: Shop;
}

const dayNames = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function ShopHours({ shop }: ShopHoursProps) {
  const getCurrentDay = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  };

  const isCurrentlyOpen = () => {
    const now = new Date();
    const currentDay = getCurrentDay();
    const todayHours = shop.hours[currentDay];

    if (!todayHours) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMin] = todayHours.close.split(":").map(Number);

    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const currentDay = getCurrentDay();
  const isOpen = isCurrentlyOpen();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-neutral-600" />
        <h3 className="font-medium text-neutral-900">Hours</h3>
        <Badge variant={isOpen ? "success" : "destructive"} size="sm">
          {isOpen ? "Open" : "Closed"}
        </Badge>
      </div>

      <div className="space-y-2">
        {Object.entries(shop.hours).map(([day, hours]) => {
          const isToday = day === currentDay;

          if (!hours) {
            return (
              <div
                key={day}
                className={`flex justify-between text-sm ${
                  isToday ? "font-medium text-neutral-900" : "text-neutral-600"
                }`}
              >
                <span className="capitalize">
                  {dayNames[day as keyof typeof dayNames]}
                </span>
                <span>Closed</span>
              </div>
            );
          }

          return (
            <div
              key={day}
              className={`flex justify-between text-sm ${
                isToday ? "font-medium text-neutral-900" : "text-neutral-600"
              }`}
            >
              <span className="capitalize">
                {dayNames[day as keyof typeof dayNames]}
              </span>
              <span>
                {formatTime(hours.open)} - {formatTime(hours.close)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
