/**
 * User Engagement Analytics Functions
 * Handles scroll tracking, form submissions, and user interactions
 */

import { trackEvent } from './ga4';
import type { ScrollDepthEvent, NewsletterSignupEvent, FormSubmitEvent } from './types';

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(): void {
  const scrollPercent = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );
  
  const milestones = [25, 50, 75, 90];
  
  // Store tracked milestones to avoid duplicate tracking
  if (!window._scrollTracked) {
    window._scrollTracked = [];
  }
  
  milestones.forEach(milestone => {
    if (scrollPercent >= milestone && !window._scrollTracked.includes(milestone)) {
      window._scrollTracked.push(milestone);
      
      const eventData: Partial<ScrollDepthEvent> = {
        percent_scrolled: milestone
      };
      
      trackEvent('scroll', eventData);
    }
  });
}

/**
 * Initialize optimized scroll tracking
 */
export function initializeScrollTracking(): void {
  if (typeof window === 'undefined') return;
  
  let ticking = false;
  
  const optimizedScrollHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        trackScrollDepth();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
}

/**
 * Track newsletter signup events
 */
export function trackNewsletterSignup(
  method: string = 'newsletter_form',
  source?: string
): void {
  const eventData: Partial<NewsletterSignupEvent> = {
    content_group: 'newsletter',
    method,
    value: 5.00, // Estimated lead value
    ...(source && { content_id: source })
  };

  trackEvent('generate_lead', eventData);
}

/**
 * Track contact form submissions
 */
export function trackContactForm(formType: string = 'contact'): void {
  const eventData: Partial<FormSubmitEvent> = {
    form_name: formType,
    content_group: 'contact'
  };

  trackEvent('form_submit', eventData);
}

/**
 * Track time spent on page before leaving
 */
export function trackTimeOnPage(): void {
  const startTime = Date.now();
  
  const reportTimeOnPage = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    // Only track if user spent more than 10 seconds on page
    if (timeSpent > 10) {
      trackEvent('page_view', {
        time_on_page_seconds: timeSpent,
        engagement_type: 'time_spent'
      });
    }
  };

  // Track time on page when user leaves
  window.addEventListener('beforeunload', reportTimeOnPage);
  
  // Also track when page becomes hidden (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      reportTimeOnPage();
    }
  });
}

/**
 * Initialize all engagement tracking
 */
export function initializeEngagementTracking(): void {
  initializeScrollTracking();
  trackTimeOnPage();
}

/**
 * Make engagement functions available globally
 */
export function exposeGlobalEngagementFunctions(): void {
  if (typeof window !== 'undefined') {
    window.trackScrollDepth = trackScrollDepth;
    window.trackNewsletterSignup = trackNewsletterSignup;
    window.trackContactForm = trackContactForm;
  }
}