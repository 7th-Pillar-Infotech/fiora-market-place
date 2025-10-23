"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Shop } from "@/lib/types";
import { mockShops } from "@/lib/mock-data";
import { ShopInfo } from "@/components/shop/shop-info";
import { ShopHours } from "@/components/shop/shop-hours";
import { ShopMap } from "@/components/shop/shop-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShop = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundShop = mockShops.find((s) => s.id === params.id);
      setShop(foundShop || null);
      setLoading(false);
    };

    if (params.id) {
      loadShop();
    }
  }, [params.id]);

  const handleViewProducts = () => {
    router.push(`/shops/${params.id}/products`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-[16/9] bg-neutral-200 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-neutral-200 rounded-xl"></div>
                <div className="h-48 bg-neutral-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/shops">
            <Button variant="ghost" className="mb-8 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Shops
            </Button>
          </Link>

          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-neutral-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Shop not found
            </h1>
            <p className="text-neutral-600 mb-6">
              The shop you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/shops">
              <Button>Browse All Shops</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Link href="/shops">
          <Button variant="ghost" className="mb-8 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Shops
          </Button>
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image
                src={shop.imageUrl}
                alt={shop.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>

            {/* Shop Information */}
            <ShopInfo shop={shop} />

            {/* View Products Button - Mobile */}
            <div className="lg:hidden">
              <Button
                size="lg"
                className="w-full flex items-center gap-2"
                onClick={handleViewProducts}
              >
                <ShoppingBag className="h-4 w-4" />
                View Products
              </Button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Hours Card */}
            <Card>
              <CardContent className="p-6">
                <ShopHours shop={shop} />
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardContent className="p-6">
                <ShopMap shop={shop} />
              </CardContent>
            </Card>

            {/* View Products Button - Desktop */}
            <div className="hidden lg:block">
              <Button
                size="lg"
                className="w-full flex items-center gap-2"
                onClick={handleViewProducts}
              >
                <ShoppingBag className="h-4 w-4" />
                View Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
