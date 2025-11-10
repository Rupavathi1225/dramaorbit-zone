import { supabase } from "@/integrations/supabase/client";

// Generate or get session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Get device info
export const getDeviceInfo = (): string => {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'Mobile';
  if (/tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
};

// Get IP and country (using a simple approach, can be enhanced with a service)
export const getGeoInfo = async (): Promise<{ ip: string; country: string }> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip: data.ip || 'unknown',
      country: data.country_name || 'unknown'
    };
  } catch {
    return { ip: 'unknown', country: 'unknown' };
  }
};

// Get source from URL params or referrer
export const getSource = (): string => {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('source') || params.get('utm_source');
  if (source) return source;
  
  const referrer = document.referrer;
  if (referrer.includes('facebook') || referrer.includes('fb.com')) return 'meta';
  if (referrer.includes('linkedin')) return 'linkedin';
  if (referrer.includes('google')) return 'google';
  if (referrer) return 'referral';
  
  return 'direct';
};

// Track event
export const trackEvent = async (
  eventType: string,
  blogId?: string,
  relatedSearchId?: string
) => {
  try {
    const sessionId = getSessionId();
    const device = getDeviceInfo();
    const source = getSource();
    const geoInfo = await getGeoInfo();
    const userAgent = navigator.userAgent;

    await supabase.from('analytics').insert({
      event_type: eventType,
      blog_id: blogId || null,
      related_search_id: relatedSearchId || null,
      session_id: sessionId,
      ip_address: geoInfo.ip,
      device,
      country: geoInfo.country,
      source,
      user_agent: userAgent
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};
