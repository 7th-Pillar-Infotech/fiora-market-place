"use client";

import * as React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Modal,
  Badge,
  Breadcrumb,
} from "@/components";
import { ShoppingCart, Heart, Star } from "lucide-react";

export default function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const breadcrumbItems = [
    { label: "Shops", href: "/shops" },
    { label: "Flower Paradise", href: "/shops/1" },
    { label: "Red Roses Bouquet" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Fiora UI Components Demo
        </h1>
        <p className="text-neutral-600">
          Showcase of reusable UI components for the customer dashboard
        </p>
      </div>

      {/* Breadcrumb Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Breadcrumb Navigation</h2>
        <Breadcrumb items={breadcrumbItems} />
      </section>

      {/* Buttons Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Badges Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Available</Badge>
          <Badge variant="success">In Stock</Badge>
          <Badge variant="warning">Low Stock</Badge>
          <Badge variant="destructive">Out of Stock</Badge>
          <Badge variant="info">New</Badge>
          <Badge variant="outline">Featured</Badge>
          <Badge variant="ghost">Popular</Badge>
        </div>
      </section>

      {/* Input Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Input Fields</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+380 44 123 4567"
            helperText="We'll use this for delivery updates"
          />
          <Input
            label="Delivery Address"
            placeholder="Enter your address"
            error="Please enter a valid address"
          />
          <Input
            label="Special Instructions"
            placeholder="Any special delivery notes"
          />
        </div>
      </section>

      {/* Cards Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Flower Paradise</CardTitle>
              <CardDescription>Premium flower arrangements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium ml-1">4.8</span>
                </div>
                <Badge variant="success" size="sm">
                  Open
                </Badge>
              </div>
              <p className="text-sm text-neutral-600">
                Delivery in 30-45 minutes • 2.1 km away
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Shop</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Red Roses Bouquet</CardTitle>
              <CardDescription>12 premium red roses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-primary-600">
                  ₴850
                </span>
                <Badge variant="warning" size="sm">
                  2 left
                </Badge>
              </div>
              <p className="text-sm text-neutral-600">
                Perfect for special occasions
              </p>
            </CardContent>
            <CardFooter className="space-x-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button className="flex-1">Add to Cart</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order #12345</CardTitle>
              <CardDescription>Placed 2 hours ago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="info">Out for Delivery</Badge>
                </div>
                <div className="flex justify-between">
                  <span>ETA:</span>
                  <span className="font-medium">15 minutes</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Track Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Modal Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add to Cart"
          description="Configure your flower arrangement"
        >
          <div className="space-y-4">
            <Input label="Quantity" type="number" defaultValue="1" min="1" />
            <Input
              label="Special Message"
              placeholder="Add a personal message (optional)"
            />
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)} className="flex-1">
                Add to Cart
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
}
