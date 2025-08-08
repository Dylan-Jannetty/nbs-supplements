/**
 * Analytics Types and Interfaces for NBS Supplements
 * Provides type safety for all analytics tracking events
 */

// Global gtag function type
declare global {
  function gtag(...args: any[]): void;
}

// Base analytics event structure
export interface AnalyticsEvent {
  event_name: string;
  engagement_time_msec: number;
  [key: string]: any;
}

// Blog-specific event types
export interface BlogEngagementEvent extends AnalyticsEvent {
  content_type: 'article';
  content_id: string;
  content_category?: string;
  action: string;
}

export interface BlogReadingProgressEvent extends BlogEngagementEvent {
  progress_percent: number;
  reading_time_seconds: number;
}

export interface BlogArticleClickEvent extends BlogEngagementEvent {
  click_location: 'featured_section' | 'recent_section';
}

export interface BlogSearchEvent extends AnalyticsEvent {
  search_term: string;
  search_location: 'blog_index';
}

// E-commerce event types
export interface EcommerceItem {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface PurchaseEvent extends AnalyticsEvent {
  transaction_id: string;
  value: number;
  currency: 'USD';
  items: EcommerceItem[];
  affiliation?: string;
  shipping?: number;
  tax?: number;
}

export interface ProductViewEvent extends AnalyticsEvent {
  currency: 'USD';
  value: number;
  items: EcommerceItem[];
}

export interface AddToCartEvent extends AnalyticsEvent {
  currency: 'USD';
  value: number;
  items: EcommerceItem[];
}

// User engagement event types
export interface ScrollDepthEvent extends AnalyticsEvent {
  percent_scrolled: number;
}

export interface NewsletterSignupEvent extends AnalyticsEvent {
  method: string;
  content_group: 'newsletter';
  value?: number;
}

export interface FormSubmitEvent extends AnalyticsEvent {
  form_name: string;
  content_group: 'contact';
}

// Utility types for analytics configuration
export interface AnalyticsConfig {
  measurementId: string;
  enableDebug?: boolean;
  cookieExpires?: number;
  anonymizeIp?: boolean;
}

export type AnalyticsEventName = 
  | 'blog_article_view'
  | 'blog_reading_progress' 
  | 'blog_reading_complete'
  | 'blog_newsletter_signup'
  | 'blog_product_cta_click'
  | 'blog_article_click'
  | 'blog_search_used'
  | 'blog_filter_used'
  | 'purchase'
  | 'view_item'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'generate_lead'
  | 'form_submit'
  | 'scroll'
  | 'page_view';