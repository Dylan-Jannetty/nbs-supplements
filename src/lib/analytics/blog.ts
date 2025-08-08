/**
 * Blog Analytics Tracking Functions
 * Handles all blog-specific engagement tracking
 */

import { trackEvent } from './ga4';
import type { 
  BlogEngagementEvent,
  BlogReadingProgressEvent,
  BlogArticleClickEvent,
  BlogSearchEvent,
  NewsletterSignupEvent
} from './types';

/**
 * Track general blog engagement events
 */
export function trackBlogEngagement(
  action: string, 
  articleTitle: string,
  additionalData: Partial<BlogEngagementEvent> = {}
): void {
  const eventData: Partial<BlogEngagementEvent> = {
    content_type: 'article',
    content_id: articleTitle,
    action,
    ...additionalData
  };

  trackEvent('blog_article_view', eventData);
}

/**
 * Track article page views
 */
export function trackArticleView(
  articleTitle: string,
  category?: string,
  readingTime?: number
): void {
  const eventData: Partial<BlogEngagementEvent> = {
    content_type: 'article',
    content_id: articleTitle,
    action: 'view',
    ...(category && { content_category: category }),
    ...(readingTime && { estimated_reading_time: readingTime })
  };

  trackEvent('blog_article_view', eventData);
}

/**
 * Track reading progress milestones
 */
export function trackReadingProgress(
  articleTitle: string,
  progressPercent: number,
  readingTimeSeconds: number,
  category?: string
): void {
  const eventData: Partial<BlogReadingProgressEvent> = {
    content_type: 'article',
    content_id: articleTitle,
    action: 'reading_progress',
    progress_percent: progressPercent,
    reading_time_seconds: readingTimeSeconds,
    ...(category && { content_category: category })
  };

  trackEvent('blog_reading_progress', eventData);
}

/**
 * Track article reading completion
 */
export function trackReadingComplete(
  articleTitle: string,
  totalReadingTime: number,
  estimatedReadingTime: number,
  category?: string
): void {
  const readingSpeedFactor = totalReadingTime / (estimatedReadingTime * 60 * 1000);
  
  const eventData = {
    content_type: 'article',
    content_id: articleTitle,
    action: 'reading_complete',
    total_reading_time_seconds: Math.round(totalReadingTime / 1000),
    estimated_reading_time: estimatedReadingTime,
    reading_speed_factor: readingSpeedFactor,
    ...(category && { content_category: category })
  };

  trackEvent('blog_reading_complete', eventData);
}

/**
 * Track newsletter signups from blog articles
 */
export function trackBlogNewsletterSignup(
  source: string = 'blog_article',
  articleTitle?: string
): void {
  const eventData: Partial<NewsletterSignupEvent> = {
    content_group: 'newsletter',
    method: source,
    value: 5.00, // Estimated lead value
    ...(articleTitle && { content_id: articleTitle })
  };

  trackEvent('generate_lead', eventData);
}

/**
 * Track product CTA clicks from blog articles
 */
export function trackBlogProductCTA(
  articleTitle: string,
  ctaText: string,
  readingProgress?: number,
  readingTime?: number
): void {
  const eventData = {
    content_type: 'article',
    content_id: articleTitle,
    cta_text: ctaText,
    cta_location: 'blog_article',
    ...(readingProgress && { reading_progress_percent: readingProgress }),
    ...(readingTime && { reading_time_seconds: Math.round(readingTime / 1000) })
  };

  trackEvent('blog_product_cta_click', eventData);
}

/**
 * Track article clicks from blog index
 */
export function trackArticleClick(
  articleTitle: string,
  clickLocation: 'featured_section' | 'recent_section'
): void {
  const eventData: Partial<BlogArticleClickEvent> = {
    content_type: 'article',
    content_id: articleTitle,
    action: 'article_click',
    click_location: clickLocation
  };

  trackEvent('blog_article_click', eventData);
}

/**
 * Track blog search usage
 */
export function trackBlogSearch(searchTerm: string): void {
  const eventData: Partial<BlogSearchEvent> = {
    search_term: searchTerm,
    search_location: 'blog_index'
  };

  trackEvent('blog_search_used', eventData);
}

/**
 * Track blog category filter usage
 */
export function trackBlogFilter(category: string): void {
  const eventData = {
    filter_type: 'category',
    filter_value: category,
    filter_location: 'blog_index'
  };

  trackEvent('blog_filter_used', eventData);
}