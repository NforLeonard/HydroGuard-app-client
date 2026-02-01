import { useState, useEffect, useRef } from 'react';
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const threshold = 80; // px to pull to trigger refresh

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (container.scrollTop === 0 && startY.current > 0) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;
        if (diff > 0) {
          // Resistance effect
          setPullDistance(Math.min(diff * 0.5, 150));
          // Prevent default only if we're pulling down at the top
          if (e.cancelable && diff < 200) e.preventDefault();
        }
      }
    };
    const handleTouchEnd = async () => {
      if (pullDistance > threshold) {
        setIsRefreshing(true);
        setPullDistance(threshold); // Snap to threshold
        await onRefresh();
        setIsRefreshing(false);
      }
      setPullDistance(0);
      startY.current = 0;
    };
    container.addEventListener('touchstart', handleTouchStart, {
      passive: true
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false
    });
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, onRefresh]);
  return {
    containerRef,
    isRefreshing,
    pullDistance,
    threshold
  };
}