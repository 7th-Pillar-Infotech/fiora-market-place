"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounced-value";

interface ProductSearchAdvancedProps {
  value: string;
  onChange: (value: string) => void;
  products: Product[];
  placeholder?: string;
  showSuggestions?: boolean;
}

export function ProductSearchAdvanced({
  value,
  onChange,
  products,
  placeholder = "Search products...",
  showSuggestions = true,
}: ProductSearchAdvancedProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedValue = useDebounce(localValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fiora_recent_product_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.warn("Failed to load recent searches:", error);
      }
    }
  }, []);

  // Update parent component with debounced value
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Generate suggestions based on products
  useEffect(() => {
    if (localValue.trim() && showSuggestions) {
      const query = localValue.toLowerCase();
      const productSuggestions = new Set<string>();

      products.forEach((product) => {
        // Add matching product names
        if (product.name.toLowerCase().includes(query)) {
          productSuggestions.add(product.name);
        }

        // Add matching categories
        if (product.category.toLowerCase().includes(query)) {
          productSuggestions.add(product.category);
        }

        // Add matching tags
        product.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(query)) {
            productSuggestions.add(tag);
          }
        });
      });

      setSuggestions(Array.from(productSuggestions).slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [localValue, products, showSuggestions]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setIsOpen(newValue.length > 0 || recentSearches.length > 0);
  };

  const handleInputFocus = () => {
    setIsOpen(localValue.length > 0 || recentSearches.length > 0);
  };

  const handleSearch = (searchTerm: string) => {
    setLocalValue(searchTerm);
    onChange(searchTerm);
    setIsOpen(false);

    // Save to recent searches
    if (searchTerm.trim()) {
      const updated = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, 5);

      setRecentSearches(updated);
      localStorage.setItem(
        "fiora_recent_product_searches",
        JSON.stringify(updated)
      );
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("fiora_recent_product_searches");
  };

  const popularSearches = [
    "roses",
    "bouquet",
    "wedding",
    "birthday",
    "seasonal",
  ];

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-10 pr-10"
        />
        {localValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && showSuggestions && (
        <Card
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto"
        >
          <CardContent className="p-0">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 border-b border-neutral-100">
                <div className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  Suggestions
                </div>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-neutral-50 rounded capitalize"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-3 border-b border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs h-auto p-1"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-neutral-50 rounded"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {!localValue && (
              <div className="p-3">
                <div className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <Badge
                      key={search}
                      variant="secondary"
                      className="cursor-pointer hover:bg-neutral-200 capitalize"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
