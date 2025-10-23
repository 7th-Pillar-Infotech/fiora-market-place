"use client";

import React from "react";
import { Shop } from "@/lib/types";
import { ShopCard } from "./shop-card";

interface ShopGridProps {
  shops: Shop[];
  loading?: boolean;
}

export function ShopGrid({ shops, loading = false }: ShopGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-neutral-200 aspect-[4/3] rounded-t-xl"></div>
            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-3 bg-neutral-200 rounded w-full"></div>
              <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
              <div className="flex gap-1 md:gap-2">
                <div className="h-5 md:h-6 bg-neutral-200 rounded w-12 md:w-16"></div>
                <div className="h-5 md:h-6 bg-neutral-200 rounded w-12 md:w-16"></div>
                <div className="h-5 md:h-6 bg-neutral-200 rounded w-12 md:w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          No shops found
        </h3>
        <p className="text-neutral-600">
          Try adjusting your search criteria or filters to find more shops.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}
