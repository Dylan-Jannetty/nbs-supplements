/**
 * Product Page Enhancement Scripts
 * Handles advanced interactions, performance monitoring, and conversion optimization
 */

// Utility functions
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;

  return (...args) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Enhanced purchase tracking
class PurchaseTracker {
  constructor() {
    this.metrics = {
      buttonHovers: 0,
      buttonClicks: 0,
      scrollDepth: 0,
      timeOnPage: 0,
      purchaseIntent: 0
    };
    this.startTime = Date.now();
    this.setupTracking();
  }

  setupTracking() {
    // Track purchase button interactions
    document.querySelectorAll('.purchase-button').forEach(button => {
      button.addEventListener('mouseenter', () => {
        this.metrics.buttonHovers++;
        this.trackEvent('purchase_intent_hover', { count: this.metrics.buttonHovers });
      });

      button.addEventListener('click', () => {
        this.metrics.buttonClicks++;
        this.trackEvent('purchase_intent_click', { count: this.metrics.buttonClicks });
        this.addPurchaseAnimation(button);
      });
    });

    // Track scroll depth
    const scrollHandler = throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(100, (scrollTop / docHeight) * 100);

      this.metrics.scrollDepth = Math.max(this.metrics.scrollDepth, scrollPercent);

      // Trigger events at key milestones
      if (scrollPercent >= 25 && !this.milestones?.quarter) {
        this.milestones = { ...this.milestones, quarter: true };
        this.trackEvent('scroll_milestone', { depth: 25 });
      }
      if (scrollPercent >= 50 && !this.milestones?.half) {
        this.milestones = { ...this.milestones, half: true };
        this.trackEvent('scroll_milestone', { depth: 50 });
      }
      if (scrollPercent >= 75 && !this.milestones?.threeQuarter) {
        this.milestones = { ...this.milestones, threeQuarter: true };
        this.trackEvent('scroll_milestone', { depth: 75 });
      }
    }, 100);

    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Track time on page
    setInterval(() => {
      this.metrics.timeOnPage = Date.now() - this.startTime;
    }, 5000);
  }

  addPurchaseAnimation(button) {
    // Create ripple effect
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    ripple.classList.add('ripple');

    const style = document.createElement('style');
    style.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleAnimation 0.6s linear;
        pointer-events: none;
      }
      @keyframes rippleAnimation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;

    if (!document.head.querySelector('style[data-ripple]')) {
      style.setAttribute('data-ripple', 'true');
      document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  trackEvent(eventName, data) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
    console.log(`Event: ${eventName}`, data);
  }

  getMetrics() {
    return {
      ...this.metrics,
      timeOnPage: Date.now() - this.startTime
    };
  }
}

// Smooth scrolling enhancement
class SmoothScrollManager {
  constructor() {
    this.setupSmoothScrolling();
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL without triggering scroll
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
  }
}

// Intersection Observer for animations
class AnimationManager {
  constructor() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay based on element index
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 100);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with data-observe attribute
    document.querySelectorAll('[data-observe]').forEach(el => {
      observer.observe(el);
    });
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.startTime = performance.now();
    this.setupPerformanceTracking();
  }

  setupPerformanceTracking() {
    // Monitor Core Web Vitals
    this.observePerformanceMetrics();

    // Track resource loading
    this.trackResourceTiming();

    // Monitor user interactions
    this.trackInteractionTiming();
  }

  observePerformanceMetrics() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime;
      }
    }).observe({ type: 'first-input', buffered: true });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.cls = clsValue;
    }).observe({ type: 'layout-shift', buffered: true });
  }

  trackResourceTiming() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(r => r.duration > 1000);

      this.metrics.resourceCount = resources.length;
      this.metrics.slowResourceCount = slowResources.length;
      this.metrics.totalResourceTime = resources.reduce((sum, r) => sum + r.duration, 0);
    });
  }

  trackInteractionTiming() {
    let interactionCount = 0;

    ['click', 'touch', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
      }, { passive: true, once: false });
    });

    setInterval(() => {
      this.metrics.interactionCount = interactionCount;
    }, 5000);
  }

  getMetrics() {
    return {
      ...this.metrics,
      pageLoadTime: performance.now() - this.startTime
    };
  }
}

// Social proof manager
class SocialProofManager {
  constructor() {
    this.recentPurchases = [
      { name: "Jessica M.", time: "2 minutes ago", location: "California" },
      { name: "Ryan K.", time: "8 minutes ago", location: "Texas" },
      { name: "Maria S.", time: "15 minutes ago", location: "New York" },
      { name: "David L.", time: "22 minutes ago", location: "Florida" },
      { name: "Sarah P.", time: "35 minutes ago", location: "Colorado" }
    ];
    this.currentIndex = 0;
    this.setupSocialProof();
  }

  setupSocialProof() {
    const container = document.createElement('div');
    container.className = 'social-proof-notification fixed bottom-20 left-4 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs transform -translate-x-full transition-transform duration-500';
    container.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium" id="purchase-name"></div>
          <div class="text-xs text-gray-500" id="purchase-details"></div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Show notifications periodically
    this.showNextNotification(container);
    setInterval(() => {
      this.showNextNotification(container);
    }, 15000);
  }

  showNextNotification(container) {
    const purchase = this.recentPurchases[this.currentIndex];
    const nameEl = container.querySelector('#purchase-name');
    const detailsEl = container.querySelector('#purchase-details');

    nameEl.textContent = `${purchase.name} purchased Catalyst`;
    detailsEl.textContent = `${purchase.location} • ${purchase.time}`;

    // Animate in
    container.style.transform = 'translateX(0)';

    // Hide after 5 seconds
    setTimeout(() => {
      container.style.transform = 'translateX(-100%)';
    }, 5000);

    this.currentIndex = (this.currentIndex + 1) % this.recentPurchases.length;
  }
}

// Initialize all enhancements 
function initializeProductEnhancements() {
  console.log('🚀 Initializing product page enhancements...');

  try {
    // Clean up existing instances to prevent duplicates
    if (window.ProductEnhancements) {
      Object.values(window.ProductEnhancements).forEach(instance => {
        if (instance.cleanup && typeof instance.cleanup === 'function') {
          instance.cleanup();
        }
      });
    }

    const purchaseTracker = new PurchaseTracker();
    const smoothScrollManager = new SmoothScrollManager();
    const animationManager = new AnimationManager();
    const performanceMonitor = new PerformanceMonitor();
    const socialProofManager = new SocialProofManager();

    // Global reference for debugging
    window.ProductEnhancements = {
      purchaseTracker,
      smoothScrollManager,
      animationManager,
      performanceMonitor,
      socialProofManager
    };

    console.log('✅ Product page enhancements initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing product enhancements:', error);
  }
}

// Initialize on DOM ready and after view transitions
document.addEventListener('DOMContentLoaded', initializeProductEnhancements);
document.addEventListener('astro:page-load', initializeProductEnhancements);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PurchaseTracker,
    SmoothScrollManager,
    AnimationManager,
    PerformanceMonitor,
    SocialProofManager
  };
}