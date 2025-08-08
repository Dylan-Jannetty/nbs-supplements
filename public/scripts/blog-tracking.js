/**
 * Blog Tracking Client-Side Script
 * Handles blog engagement tracking on the client side
 */

// Blog engagement tracking function - exposed globally
window.trackBlogEngagement = function(action, articleTitle, additionalData = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      content_type: 'article',
      content_id: articleTitle,
      engagement_time_msec: Date.now() - performance.timeOrigin,
      ...additionalData
    });
  } else if (window.location.hostname === 'localhost') {
    console.log('Blog engagement tracked (gtag not available):', action, articleTitle);
  }
};

// Article view tracking
window.trackArticleView = function(articleTitle, category, readingTime) {
  const eventData = {
    content_type: 'article',
    content_id: articleTitle,
    action: 'view'
  };
  
  if (category) eventData.content_category = category;
  if (readingTime) eventData.estimated_reading_time = readingTime;
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'blog_article_view', eventData);
  }
};

// Newsletter signup tracking
window.trackBlogNewsletterSignup = function(source = 'blog_article', articleTitle) {
  const eventData = {
    content_group: 'newsletter',
    method: source,
    value: 5.00
  };
  
  if (articleTitle) eventData.content_id = articleTitle;
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'generate_lead', eventData);
  }
  
  // Also call existing newsletter tracking if available
  if (typeof window.trackNewsletterSignup === 'function') {
    window.trackNewsletterSignup(source);
  }
};

// Product CTA tracking
window.trackBlogProductCTA = function(articleTitle, ctaText, readingProgress, readingTime) {
  const eventData = {
    content_type: 'article',
    content_id: articleTitle,
    cta_text: ctaText,
    cta_location: 'blog_article'
  };
  
  if (readingProgress) eventData.reading_progress_percent = readingProgress;
  if (readingTime) eventData.reading_time_seconds = Math.round(readingTime / 1000);
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'blog_product_cta_click', eventData);
  }
};

// Reading progress tracking
window.trackReadingProgress = function(articleTitle, progressPercent, readingTimeSeconds, category) {
  const eventData = {
    content_type: 'article',
    content_id: articleTitle,
    action: 'reading_progress',
    progress_percent: progressPercent,
    reading_time_seconds: readingTimeSeconds
  };
  
  if (category) eventData.content_category = category;
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'blog_reading_progress', eventData);
  }
};

// Reading completion tracking
window.trackReadingComplete = function(articleTitle, totalReadingTime, estimatedReadingTime, category) {
  const readingSpeedFactor = totalReadingTime / (estimatedReadingTime * 60 * 1000);
  
  const eventData = {
    content_type: 'article',
    content_id: articleTitle,
    action: 'reading_complete',
    total_reading_time_seconds: Math.round(totalReadingTime / 1000),
    estimated_reading_time: estimatedReadingTime,
    reading_speed_factor: readingSpeedFactor
  };
  
  if (category) eventData.content_category = category;
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'blog_reading_complete', eventData);
  }
};

// Article click tracking from blog index
window.trackArticleClick = function(articleTitle, clickLocation) {
  const eventData = {
    content_type: 'article_preview',
    content_id: articleTitle,
    click_location: clickLocation,
    engagement_time_msec: Date.now() - performance.timeOrigin
  };
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'blog_article_click', eventData);
  }
  
  // Also use the legacy trackBlogEngagement function if available
  if (typeof window.trackBlogEngagement === 'function') {
    window.trackBlogEngagement('article_click', articleTitle);
  }
};

// Blog search tracking
window.trackBlogSearch = function(searchTerm) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'search', {
      search_term: searchTerm,
      search_location: 'blog_index'
    });
  }
  
  // Also use the legacy trackBlogEngagement function if available
  if (typeof window.trackBlogEngagement === 'function') {
    window.trackBlogEngagement('search', `Search: ${searchTerm}`);
  }
};

// Blog filter tracking
window.trackBlogFilter = function(category) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'filter', {
      filter_type: 'category',
      filter_value: category,
      filter_location: 'blog_index'
    });
  }
  
  // Also use the legacy trackBlogEngagement function if available
  if (typeof window.trackBlogEngagement === 'function') {
    window.trackBlogEngagement('filter', `Category: ${category}`);
  }
};