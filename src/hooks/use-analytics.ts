import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { trackCustomEvent } from '@/utils/fbpixel';

const SESSION_KEY = 'analytics_session_id';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const useAnalytics = () => {
  const location = useLocation();
  const [sessionId, setSessionId] = useState<string>('');
  const sessionStartTime = useRef<number>(Date.now());
  const milestonesTracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);
  }, []);

  // Reset milestones and start time on location change
  useEffect(() => {
    sessionStartTime.current = Date.now();
    milestonesTracked.current = new Set();
  }, [location.pathname]);

  const trackEvent = useCallback(async (
    eventType: 'page_view' | 'impression' | 'heartbeat' | 'click' | 'content_engagement',
    contentId?: string,
    metadata?: any
  ) => {
    // 1. Block Localhost (TEMPORARILY DISABLED FOR TESTING)
    /*
    if (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
    ) {
        return;
    }
    */

    // 2. Block Opt-out Users (Run localStorage.setItem('analytics_opt_out', 'true') in console)
    if (localStorage.getItem('analytics_opt_out')) {
        return;
    }

    if (!sessionId) return;

    try {
      await (supabase.from('analytics_events' as any) as any).insert({
        session_id: sessionId,
        event_type: eventType,
        path: location.pathname,
        content_id: contentId,
        metadata: metadata,
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, [sessionId, location.pathname]);

  // Track Page View on route change
  useEffect(() => {
    if (sessionId) {
      trackEvent('page_view');
    }
  }, [location.pathname, sessionId, trackEvent]);

  // Heartbeat (every 15 seconds) to track engagement and Meta TimeSpent
  useEffect(() => {
    if (!sessionId) return;
    
    const interval = setInterval(() => {
        trackEvent('heartbeat');
        
        const elapsedSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        
        // Define milestones for Meta Pixel
        const milestones = [15, 30, 60, 90, 120, 180, 300];
        
        milestones.forEach(s => {
            if (elapsedSeconds >= s && !milestonesTracked.current.has(s)) {
                trackCustomEvent('TimeSpent', { 
                    url: location.pathname, 
                    seconds: s 
                });
                milestonesTracked.current.add(s);
            }
        });

    }, 15000); // Check every 15s to catch milestones more accurately

    return () => clearInterval(interval);
  }, [sessionId, trackEvent, location.pathname]);

  return { trackEvent };
};
