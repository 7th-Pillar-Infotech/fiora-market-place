"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockShops } from "@/lib/mock-data";

export default function TestNavigationPage() {
  const router = useRouter();
  const firstShop = mockShops[0];

  const handleRouterPush = () => {
    console.log("Router push to:", `/shops/${firstShop.id}/products`);
    router.push(`/shops/${firstShop.id}/products`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Test Shop: {firstShop.name}</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Shop ID: {firstShop.id}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">
                Method 1: Router Push (Button)
              </h4>
              <Button onClick={handleRouterPush}>
                Go to Products (Router)
              </Button>
            </div>

            <div>
              <h4 className="font-medium mb-2">Method 2: Next.js Link</h4>
              <Link href={`/shops/${firstShop.id}/products`}>
                <Button variant="outline">Go to Products (Link)</Button>
              </Link>
            </div>

            <div>
              <h4 className="font-medium mb-2">Method 3: HTML Link</h4>
              <a href={`/shops/${firstShop.id}/products`}>
                <Button variant="secondary">Go to Products (HTML)</Button>
              </a>
            </div>

            <div>
              <h4 className="font-medium mb-2">Method 4: Window Location</h4>
              <Button
                variant="destructive"
                onClick={() => {
                  window.location.href = `/shops/${firstShop.id}/products`;
                }}
              >
                Go to Products (Window)
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-neutral-100 rounded">
            <h4 className="font-medium mb-2">Available Shops:</h4>
            <div className="space-y-1 text-sm">
              {mockShops.slice(0, 5).map((shop) => (
                <div key={shop.id}>
                  <Link
                    href={`/shops/${shop.id}/products`}
                    className="text-blue-600 hover:underline"
                  >
                    {shop.name} (ID: {shop.id})
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
