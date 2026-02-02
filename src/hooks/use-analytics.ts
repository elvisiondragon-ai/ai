import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

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

  useEffect(() => {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);
  }, []);

  const trackEvent = useCallback(async (
    eventType: 'page_view' | 'impression' | 'heartbeat' | 'click' | 'content_engagement',
    contentId?: string,
    metadata?: any
  ) => {
    // 1. Block Localhost
    if (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
    ) {
        return;
    }

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

  // Heartbeat (every 30 seconds) to track engagement
  // Increased to 30s to avoid DB spam, adjust as needed for "Mastery" resolution
  useEffect(() => {
    if (!sessionId) return;
    
    const interval = setInterval(() => {
        trackEvent('heartbeat');
    }, 30000);

    return () => clearInterval(interval);
  }, [sessionId, trackEvent]);

  return { trackEvent };
};
