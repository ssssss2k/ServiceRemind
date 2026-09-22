import { useEffect, useMemo, useRef, useState } from 'react';

export function useIncrementalList(items, pageSize = 60) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visibleCount >= items.length || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisibleCount((current) => Math.min(current + pageSize, items.length));
      }
    }, { rootMargin: '240px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [items.length, pageSize, visibleCount]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  return { visibleItems, sentinelRef, hasMore: visibleCount < items.length };
}
