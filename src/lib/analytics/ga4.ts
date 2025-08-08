/**
 * Google Analytics 4 Core Functions
 * Handles GA4 initialization and base tracking functionality
 */

import type { 
  AnalyticsConfig, 
  AnalyticsEvent,
  AnalyticsEventName 
} from './types';

/**
 * Initialize Google Analytics 4 with configuration
 */
export function initializeGA4(config: AnalyticsConfig): void {
  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  
  // Make gtag globally available
  window.gtag = gtag;
  
  gtag('js', new Date());

  // Configure GA4 with settings
  gtag('config', config.measurementId, {
    // Enhanced e-commerce settings
    allow_enhanced_conversions: true,
    send_page_view: true,
    // Privacy settings
    anonymize_ip: config.anonymizeIp ?? true,
    // Performance settings
    cookie_expires: config.cookieExpires ?? 60 * 60 * 24 * 28, // 28 days
  });

  // Track initial page view with enhanced data
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    content_group1: 'NBS Supplements',
    custom_map: {
      dimension1: 'supplement_site'
    }
  });

  // Debug logging if enabled
  if (config.enableDebug) {
    console.log('GA4 Analytics initialized with config:', config);
  }
}

/**
 * Track a custom event with GA4
 */
export function trackEvent(
  eventName: AnalyticsEventName, 
  parameters: Partial<AnalyticsEvent> = {}
): void {
  if (typeof gtag === 'undefined') {
    console.warn('GA4 not initialized. Event not tracked:', eventName);
    return;
  }

  // Add default engagement time if not provided
  const eventData = {
    engagement_time_msec: Date.now() - performance.timeOrigin,
    ...parameters
  };

  gtag('event', eventName, eventData);
  
  // Debug logging
  if (isDebugMode()) {
    console.log('GA4 Event tracked:', eventName, eventData);
  }
}

/**
 * Track page view event
 */
export function trackPageView(
  pageTitle: string = document.title,
  pageLocation: string = window.location.href
): void {
  trackEvent('page_view', {
    page_title: pageTitle,
    page_location: pageLocation,
    engagement_time_msec: Date.now() - performance.timeOrigin
  });
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return typeof window !== 'undefined' && 
         window.location.hostname === 'localhost' ||
         window.location.search.includes('ga_debug=true');
}

/**
 * Utility to safely access gtag
 */
export function safeGtag(...args: any[]): void {
  if (typeof gtag !== 'undefined') {
    gtag(...args);
  } else if (isDebugMode()) {
    console.log('gtag called but not available:', args);
  }
}