"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ShopSearch({
  value,
  onChange,
  placeholder = "Search shops...",
}: ShopSearchProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-neutral-400 hover:text-neutral-600"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
