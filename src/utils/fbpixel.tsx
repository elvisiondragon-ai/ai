// 🌐 IP Address Helper - Fetch client IP (IPv6 preferred)
export const getClientIp = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    if (!response.ok) throw new Error('IP fetch failed');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to fetch client IP:', error);
    return null;
  }
};

// 🎯 Facebook Pixel FBC/FBP Enhanced Tracking System

// 🎯 TEST CODE MAPPING (Dynamic Source of Truth)
const TEST_CODE_MAPPING: Record<string, string> = {
  'testcode_indo': 'TEST3660', 
  'testcode_usa': 'TEST84659',
};

// ⏳ Wait for FBP Cookie Helper
export const waitForFbp = async (timeout = 2000): Promise<string | null> => {
  const start = Date.now();
  // Poll every 100ms
  while (Date.now() - start < timeout) {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(^|;\s*)_fbp=([^;]+)/);
      if (match) return match[2];
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return null;
};

// 🔐 SHA-256 Hash Helper
export const sha256 = async (message: string): Promise<string> => {
  if (!message) return "";
  const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// 🍪 Cookie Helper - Set cookie with domain handling
export const setCookieHelper = (name: string, value: string, days: number = 90) => {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    let domain = hostname;
    if (parts.length >= 2 && !hostname.includes('localhost') && !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        domain = '.' + parts.slice(-2).join('.');
    }
    document.cookie = `${name}=${value}; ${expires}; path=/; domain=${domain}; SameSite=Lax`;
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
};

// 🍪 FBC Cookie Helper
export const getFbcCookieHelper = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// 🔗 FBC URL Extractor
export const getFbcClickIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  let fbclid = urlParams.get('fbclid');
  if (!fbclid && window.location.hash) {
     const hashString = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
     const hashParams = new URLSearchParams(hashString);
     fbclid = hashParams.get('fbclid');
  }
  if (fbclid) {
    const hasUppercase = /[A-Z]/.test(fbclid);
    const hasLowercase = /[a-z]/.test(fbclid);
    const isTooShort = fbclid.length < 20;
    const isTest = /test/i.test(fbclid);
    const isCorruptedLowercase = !hasUppercase && hasLowercase;
    if (isTest || isTooShort || isCorruptedLowercase) {
      console.warn("⚠️ Meta Pixel: Ignoring invalid/corrupted fbclid:", fbclid);
      return null;
    }
    return fbclid;
  }
  return null;
};

// 🔧 FBC Formatter
export const formatFbcCookieValue = (fbclid: string): string => {
  const timestamp = Date.now();
  return `fb.1.${timestamp}.${fbclid}`;
};

// 💾 Save FBC Data
export const setFbcData = (fbclid: string, existingFormattedFbc?: string) => {
    if (!fbclid) return;
    const formattedFbc = existingFormattedFbc || formatFbcCookieValue(fbclid);
    setCookieHelper('_fbc', formattedFbc, 90);
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('_fbc_backup', formattedFbc);
        localStorage.setItem('_fbc_timestamp', Date.now().toString());
    }
};

// 🔗 FBC Cookie Manager
export const handleFbcCookieManager = (): void => {
  const fbclid = getFbcClickIdFromUrl();
  if (fbclid) setFbcData(fbclid);
};

// 🍪 Get FBC and FBP Cookies
export const getFbcFbpCookies = (): { fbc: string | null; fbp: string | null } => {
  let fbc = getFbcCookieHelper('_fbc');
  let fbp = getFbcCookieHelper('_fbp');
  if (fbc) {
    const parts = fbc.split('.');
    if (parts.length >= 4) {
      const fbclid = parts.slice(3).join('.');
      if (!/[A-Z]/.test(fbclid) && /[a-z]/.test(fbclid)) fbc = null;
    }
  }
  return { fbc, fbp };
};

export interface AdvancedMatchingData {
  em?: string; ph?: string; fn?: string; ln?: string; ct?: string; st?: string; zp?: string; country?: string; external_id?: string; db_id?: string; fbc?: string; fbp?: string;
}

// 🔐 Hash User Data
export const hashUserData = async (userData: AdvancedMatchingData): Promise<AdvancedMatchingData> => {
  const hashedData: AdvancedMatchingData = {};
  if (userData.em) hashedData.em = await sha256(userData.em);
  if (userData.ph) hashedData.ph = await sha256(userData.ph);
  if (userData.fn) hashedData.fn = await sha256(userData.fn);
  if (userData.ln) hashedData.ln = await sha256(userData.ln);
  if (userData.external_id) hashedData.external_id = userData.external_id; 
  if (userData.db_id) hashedData.db_id = userData.db_id;
  if (userData.fbc) hashedData.fbc = userData.fbc;
  if (userData.fbp) hashedData.fbp = userData.fbp;
  return hashedData;
};

// 🚀 Pixel Initializer
const initializedPixels = new Set<string>();
const userDataCache = new Map<string, string>();

export const initFacebookPixelWithLogging = (pixelId: string, userData?: AdvancedMatchingData): void => {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('DISABLE_FB_PIXEL')) return;
  handleFbcCookieManager();
  if (!(window as any).fbq) {
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return; 
      n = f.fbq = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; 
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  }

  if (userData) {
    hashUserData(userData).then(hashed => { 
        const hashedStr = JSON.stringify(hashed);
        if (!initializedPixels.has(pixelId) || userDataCache.get(pixelId) !== hashedStr) {
            (window as any).fbq('init', pixelId, hashed); 
            initializedPixels.add(pixelId);
            userDataCache.set(pixelId, hashedStr);
        }
    });
  } else {
    if (!initializedPixels.has(pixelId)) {
        (window as any).fbq('init', pixelId);
        initializedPixels.add(pixelId);
    }
  }
};

// ⭐ Generic Track Helper
const trackEvent = async (eventName: string, eventData: any = {}, options: { eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string } = {}) => {
  if (typeof window === 'undefined' || !(window as any).fbq) return;
  if (localStorage.getItem('DISABLE_FB_PIXEL')) return;
  try {
    if (options.userData && options.pixelId) {
        const hashed = await hashUserData(options.userData);
        const hashedStr = JSON.stringify(hashed);
        if (userDataCache.get(options.pixelId) !== hashedStr) {
            (window as any).fbq('init', options.pixelId, hashed);
            userDataCache.set(options.pixelId, hashedStr);
            initializedPixels.add(options.pixelId);
        }
    }
    const trackOptions: any = {};
    if (options.eventID) trackOptions.eventID = options.eventID;
    if (options.testCode) trackOptions.test_event_code = TEST_CODE_MAPPING[options.testCode] || options.testCode;
    if (options.pixelId) (window as any).fbq('trackSingle', options.pixelId, eventName, eventData, trackOptions);
    else (window as any).fbq('track', eventName, eventData, trackOptions);
  } catch (error) { console.log(`FB Pixel ${eventName} tracking failed:`, error); }
};

export const trackViewContentEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string) => trackEvent('ViewContent', eventData, { eventID, pixelId, userData, testCode });
export const trackPageViewEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string) => trackEvent('PageView', eventData, { eventID, pixelId, userData, testCode });
export const trackAddToCartEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string) => trackEvent('AddToCart', eventData, { eventID, pixelId, userData, testCode });
export const trackPurchaseEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string) => trackEvent('Purchase', eventData, { eventID, pixelId, userData, testCode });
export const trackAddPaymentInfoEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string) => trackEvent('AddPaymentInfo', eventData, { eventID, pixelId, userData, testCode });
export const trackCustomEvent = async (eventName: string, eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string) => trackEvent(eventName, eventData, { eventID, pixelId, userData, testCode });