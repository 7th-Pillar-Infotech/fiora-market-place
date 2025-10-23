"use client";

import React from "react";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  onValueChange,
  onValueCommit,
  min,
  max,
  step = 1,
  className = "",
}: SliderProps) {
  const [isDragging, setIsDragging] = React.useState<number | null>(null);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (isDragging === null) return;

      const slider = document.getElementById("slider-track");
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );
      const newValue = min + (percentage / 100) * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      const newValues = [...value];
      newValues[isDragging] = clampedValue;

      // Ensure values don't cross over
      if (isDragging === 0 && newValues[0] > newValues[1]) {
        newValues[0] = newValues[1];
      } else if (isDragging === 1 && newValues[1] < newValues[0]) {
        newValues[1] = newValues[0];
      }

      onValueChange(newValues);
    },
    [isDragging, min, max, step, value, onValueChange]
  );

  const handleMouseUp = React.useCallback(() => {
    if (isDragging !== null) {
      onValueCommit?.(value);
      setIsDragging(null);
    }
  }, [isDragging, value, onValueCommit]);

  React.useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={`relative h-6 ${className}`}>
      {/* Track */}
      <div
        id="slider-track"
        className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-neutral-200 rounded-full cursor-pointer"
      >
        {/* Range */}
        <div
          className="absolute h-full bg-rose-500 rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            width: `${getPercentage(value[1]) - getPercentage(value[0])}%`,
          }}
        />

        {/* Thumbs */}
        {value.map((val, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-white border-2 border-rose-500 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform"
            style={{ left: `${getPercentage(val)}%` }}
            onMouseDown={handleMouseDown(index)}
          />
        ))}
      </div>
    </div>
  );
}
