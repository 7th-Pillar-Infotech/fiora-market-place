"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product, Shop } from "@/lib/types";
import { mockShops, mockProducts } from "@/lib/mock-data";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductQuantitySelector } from "@/components/product/product-quantity-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { useProductViewTracking } from "@/hooks/use-recommendations";
import { useCart } from "@/contexts/cart-context";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Cart and view tracking hooks
  const { addItem } = useCart();
  const { startTracking, endTracking } = useProductViewTracking();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundProduct = mockProducts.find((p) => p.id === params.productId);
      const foundShop = foundProduct
        ? mockShops.find((s) => s.id === foundProduct.shopId)
        : null;

      setProduct(foundProduct || null);
      setShop(foundShop || null);
      setLoading(false);

      // Start tracking view when product is loaded
      if (foundProduct) {
        startTracking();
      }
    };

    if (params.productId) {
      loadData();
    }
  }, [params.productId, startTracking]);

  // Track view duration when component unmounts or product changes
  useEffect(() => {
    return () => {
      if (product) {
        endTracking(product.id, product.shopId, product.category);
      }
    };
  }, [product, endTracking]);

  const handleAddToCart = async () => {
    if (!product || !product.isAvailable) return;

    setIsAddingToCart(true);

    // Simulate adding to cart
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Add to cart using context
    const success = addItem(product, quantity);
    if (success) {
      console.log(`Added ${quantity}x ${product.name} to cart`);
    } else {
      console.log("Failed to add item to cart - validation error");
    }

    setIsAddingToCart(false);
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log("Adding to wishlist:", product?.name);
    alert("Added to wishlist!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-neutral-200 rounded-lg"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-neutral-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                </div>
                <div className="h-12 bg-neutral-200 rounded w-32"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-neutral-200 rounded"></div>
                  <div className="h-20 bg-neutral-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !shop) {
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
              <ShoppingCart className="w-12 h-12 text-neutral-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Product not found
            </h1>
            <p className="text-neutral-600 mb-6">
              The product you&apos;re looking for doesn&apos;t exist or has been
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
        <Link href={`/shops/${shop.id}/products`}>
          <Button variant="ghost" className="mb-8 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {shop.name} Products
          </Button>
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div>
            <ProductImageGallery
              images={product.imageUrls}
              productName={product.name}
            />
          </div>

          {/* Right Column - Product Info and Actions */}
          <div className="space-y-8">
            {/* Product Information */}
            <ProductInfo product={product} shop={shop} />

            {/* Purchase Actions */}
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Quantity Selector */}
                {product.isAvailable && (
                  <ProductQuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    maxQuantity={Math.min(product.stock, 10)}
                    disabled={!product.isAvailable}
                  />
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full flex items-center gap-2"
                    onClick={handleAddToCart}
                    disabled={!product.isAvailable || isAddingToCart}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isAddingToCart
                      ? "Adding to Cart..."
                      : product.isAvailable
                      ? `Add ${quantity} to Cart - ₴${(
                          product.price * quantity
                        ).toLocaleString()}`
                      : "Out of Stock"}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full flex items-center gap-2"
                    onClick={handleAddToWishlist}
                  >
                    <Heart className="h-4 w-4" />
                    Add to Wishlist
                  </Button>
                </div>

                {/* Delivery Info */}
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 mb-2">
                    Delivery Information
                  </h4>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <div>
                      Estimated delivery: {product.estimatedDeliveryTime}{" "}
                      minutes
                    </div>
                    <div>Delivery from: {shop.name}</div>
                    <div>Distance: {shop.distance}km away</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">
                      About {shop.name}
                    </h4>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {shop.description}
                    </p>
                  </div>
                  <Link href={`/shops/${shop.id}`}>
                    <Button variant="outline" size="sm">
                      Visit Shop
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
