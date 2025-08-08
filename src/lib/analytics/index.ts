/**
 * Analytics Module - Main Entry Point
 * Exports all analytics functions and provides initialization
 */

// Type exports
export type * from './types';

// GA4 core functions
export {
  initializeGA4,
  trackEvent,
  trackPageView,
  isDebugMode,
  safeGtag
} from './ga4';

// Blog analytics functions
export {
  trackBlogEngagement,
  trackArticleView,
  trackReadingProgress,
  trackReadingComplete,
  trackBlogNewsletterSignup,
  trackBlogProductCTA,
  trackArticleClick,
  trackBlogSearch,
  trackBlogFilter
} from './blog';

// E-commerce analytics functions
export {
  trackPurchase,
  trackProductView,
  trackAddToCart,
  trackBeginCheckout,
  trackGumroadClick,
  initializeGumroadTracking,
  exposeGlobalEcommerceFunctions
} from './ecommerce';

// Engagement tracking functions
export {
  trackScrollDepth,
  initializeScrollTracking,
  trackNewsletterSignup,
  trackContactForm,
  trackTimeOnPage,
  initializeEngagementTracking,
  exposeGlobalEngagementFunctions
} from './engagement';

// Configuration and initialization
import type { AnalyticsConfig } from './types';
import { initializeGA4 } from './ga4';
import { initializeGumroadTracking, exposeGlobalEcommerceFunctions } from './ecommerce';
import { initializeEngagementTracking, exposeGlobalEngagementFunctions } from './engagement';

/**
 * Default analytics configuration for NBS Supplements
 */
export const DEFAULT_CONFIG: AnalyticsConfig = {
  measurementId: 'G-117M1HYTL2',
  enableDebug: false,
  cookieExpires: 60 * 60 * 24 * 28, // 28 days
  anonymizeIp: true
};

/**
 * Initialize all analytics systems
 */
export function initializeAnalytics(config: Partial<AnalyticsConfig> = {}): void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Initialize GA4
  initializeGA4(finalConfig);
  
  // Initialize e-commerce tracking
  initializeGumroadTracking();
  
  // Initialize engagement tracking
  initializeEngagementTracking();
  
  // Expose global functions for inline scripts
  exposeGlobalEcommerceFunctions();
  exposeGlobalEngagementFunctions();
  
  // Debug logging
  if (finalConfig.enableDebug) {
    console.log('NBS Analytics fully initialized with config:', finalConfig);
  }
}

/**
 * Initialize analytics for specific page types
 */
export function initializePageAnalytics(pageType: 'blog' | 'product' | 'general' = 'general'): void {
  const config: Partial<AnalyticsConfig> = {
    enableDebug: window.location.hostname === 'localhost'
  };
  
  initializeAnalytics(config);
  
  // Page-specific initialization
  switch (pageType) {
    case 'blog':
      // Blog-specific tracking is handled by individual components
      break;
    case 'product':
      // Product page specific tracking
      if (typeof window !== 'undefined') {
        // Auto-track product view after page load
        window.addEventListener('load', () => {
          const { trackProductView } = require('./ecommerce');
          trackProductView();
        });
      }
      break;
    default:
      // General page tracking
      break;
  }
}