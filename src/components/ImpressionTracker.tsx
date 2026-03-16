import { useEffect, useRef } from 'react';
import { useAnalytics } from '../hooks/use-analytics';

interface ImpressionTrackerProps {
  contentId: string;
  children: React.ReactNode;
  threshold?: number; // 0.0 to 1.0 (how much needs to be visible)
  trackTime?: boolean; // If true, tracks duration (5s, 15s, 30s, 60s)
}

export const ImpressionTracker = ({ 
  contentId, 
  children, 
  threshold = 0.5,
  trackTime = true 
}: ImpressionTrackerProps) => {
  const { trackEvent } = useAnalytics();
  const ref = useRef<HTMLDivElement>(null);
  const hasTrackedImpression = useRef(false);
  const timeTracked = useRef<Set<number>>(new Set());
  const startTime = useRef<number | null>(null);
  const accumulatedTime = useRef<number>(0);

  useEffect(() => {
    const checkTime = () => {
      if (!startTime.current) return;
      
      const currentSessionTime = (Date.now() - startTime.current) / 1000;
      const totalTime = accumulatedTime.current + currentSessionTime;
      
      const thresholds = [5, 15, 30, 60];
      thresholds.forEach(sec => {
        if (totalTime >= sec && !timeTracked.current.has(sec)) {
          trackEvent('content_engagement', contentId, { duration: sec });
          timeTracked.current.add(sec);
        }
      });
    };

    const interval = setInterval(checkTime, 1000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Element entered viewport
          if (!hasTrackedImpression.current) {
            trackEvent('impression', contentId);
            hasTrackedImpression.current = true;
          }
          
          if (trackTime && !startTime.current) {
            startTime.current = Date.now();
          }
        } else {
          // Element left viewport
          if (startTime.current) {
            accumulatedTime.current += (Date.now() - startTime.current) / 1000;
            startTime.current = null;
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [contentId, threshold, trackTime, trackEvent]);

  return <div ref={ref} className="w-full h-full">{children}</div>;
};
