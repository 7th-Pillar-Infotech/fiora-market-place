"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface ProductQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  minQuantity?: number;
  disabled?: boolean;
}

export function ProductQuantitySelector({
  quantity,
  onQuantityChange,
  maxQuantity = 99,
  minQuantity = 1,
  disabled = false,
}: ProductQuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= minQuantity && value <= maxQuantity) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-neutral-700">Quantity:</span>
      <div className="flex items-center border border-neutral-200 rounded-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrease}
          disabled={disabled || quantity <= minQuantity}
          className="h-8 w-8 p-0 rounded-none border-r border-neutral-200"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={minQuantity}
          max={maxQuantity}
          disabled={disabled}
          className="h-8 w-16 text-center border-0 rounded-none focus:ring-0 focus:border-0"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrease}
          disabled={disabled || quantity >= maxQuantity}
          className="h-8 w-8 p-0 rounded-none border-l border-neutral-200"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      {maxQuantity < 99 && (
        <span className="text-xs text-neutral-500">(Max: {maxQuantity})</span>
      )}
    </div>
  );
}
