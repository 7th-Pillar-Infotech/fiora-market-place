"use client";

import { useRef, useCallback } from "react";

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export function useTouchGestures(options: TouchGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
  } = options;

  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);
  const lastTap = useRef<TouchPoint | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      const now = Date.now();

      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      };

      touchEnd.current = null;
      isLongPress.current = false;

      // Start long press timer
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          isLongPress.current = true;
          onLongPress();
        }, longPressDelay);
      }
    },
    [onLongPress, longPressDelay]
  );

  const handleTouchMove = useCallback(() => {
    // Cancel long press on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (isLongPress.current) {
        return;
      }

      const touch = e.changedTouches[0];
      const now = Date.now();

      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      };

      if (!touchStart.current || !touchEnd.current) return;

      const deltaX = touchEnd.current.x - touchStart.current.x;
      const deltaY = touchEnd.current.y - touchStart.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check for swipe gestures
      if (absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
        return;
      }

      // Check for tap gestures
      if (absDeltaX < 10 && absDeltaY < 10) {
        // Check for double tap
        if (
          onDoubleTap &&
          lastTap.current &&
          now - lastTap.current.time < doubleTapDelay &&
          Math.abs(touchEnd.current.x - lastTap.current.x) < 20 &&
          Math.abs(touchEnd.current.y - lastTap.current.y) < 20
        ) {
          onDoubleTap();
          lastTap.current = null;
        } else {
          // Single tap
          if (onTap) {
            // Delay single tap to allow for double tap detection
            setTimeout(() => {
              if (lastTap.current?.time === touchEnd.current?.time) {
                onTap();
              }
            }, doubleTapDelay);
          }
          lastTap.current = touchEnd.current;
        }
      }
    },
    [
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onTap,
      onDoubleTap,
      swipeThreshold,
      doubleTapDelay,
    ]
  );

  const attachListeners = useCallback(
    (element: HTMLElement) => {
      element.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      element.addEventListener("touchmove", handleTouchMove, { passive: true });
      element.addEventListener("touchend", handleTouchEnd, { passive: true });

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);

        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
        }
      };
    },
    [handleTouchStart, handleTouchMove, handleTouchEnd]
  );

  return { attachListeners };
}

// Hook for detecting device capabilities
export function useDeviceCapabilities() {
  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;
  const hasHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;
  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid =
    typeof window !== "undefined" && /Android/.test(navigator.userAgent);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return {
    isTouchDevice,
    hasHover,
    isIOS,
    isAndroid,
    isMobile,
  };
}
