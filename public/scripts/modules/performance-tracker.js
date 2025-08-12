/**
 * Performance Tracker Module
 * Handles Core Web Vitals, user behavior tracking, and performance monitoring
 */

class PerformanceTracker {
  constructor(options = {}) {
    this.options = {
      productName: 'Catalyst Pre-Workout',
      price: 30.00,
      enableReporting: true,
      reportInterval: 30000, // 30 seconds
      ...options
    };

    this.metrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      interactionToNextPaint: 0
    };

    this.behaviorMetrics = {
      timeOnPage: 0,
      scrollDepth: 0,
      clicksCount: 0,
      formInteractions: 0,
      purchaseClicks: 0,
      exitIntent: false
    };

    this.pageStartTime = Date.now();
    this.observers = [];
    this.eventListeners = [];
    this.reportTimer = null;

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    this.measureCoreWebVitals();
    this.setupBehaviorTracking();
    this.startReporting();
  }

  measureCoreWebVitals() {
    // Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cumulativeLayoutShift = Math.max(
          this.metrics.cumulativeLayoutShift,
          clsValue
        );
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS measurement not supported');
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP measurement not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-input') {
            this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          }
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID measurement not supported');
    }

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn('FCP measurement not supported');
    }

    // Page Load Time from Navigation Timing
    if (performance.timing) {
      this.metrics.pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
  }

  setupBehaviorTracking() {
    // Scroll tracking (throttled)
    const scrollHandler = this.throttle(() => {
      this.trackScrollDepth();
    }, 100);

    window.addEventListener('scroll', scrollHandler, { passive: true });
    this.eventListeners.push({ element: window, event: 'scroll', handler: scrollHandler });

    // Click tracking
    const clickHandler = (event) => {
      this.trackClick(event);
    };

    document.addEventListener('click', clickHandler, { passive: true });
    this.eventListeners.push({ element: document, event: 'click', handler: clickHandler });

    // Exit intent tracking
    const exitHandler = (event) => {
      this.trackExitIntent(event);
    };

    document.addEventListener('mouseleave', exitHandler);
    this.eventListeners.push({ element: document, event: 'mouseleave', handler: exitHandler });

    // Form interaction tracking
    const formHandler = (event) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
        this.behaviorMetrics.formInteractions++;
      }
    };

    document.addEventListener('focusin', formHandler, { passive: true });
    this.eventListeners.push({ element: document, event: 'focusin', handler: formHandler });

    // Page unload tracking
    const unloadHandler = () => {
      this.reportMetrics();
      this.performFinalAnalysis();
    };

    window.addEventListener('beforeunload', unloadHandler);
    this.eventListeners.push({ element: window, event: 'beforeunload', handler: unloadHandler });
  }

  trackScrollDepth() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(100, (scrollTop / docHeight) * 100);

    this.behaviorMetrics.scrollDepth = Math.max(
      this.behaviorMetrics.scrollDepth,
      scrollPercent
    );
  }

  trackClick(event) {
    this.behaviorMetrics.clicksCount++;

    const target = event.target;
    const text = target.textContent?.toLowerCase() || '';

    // Track purchase-related clicks
    if (text.includes('buy') ||
      text.includes('cart') ||
      text.includes('order') ||
      text.includes('purchase') ||
      target.classList.contains('purchase-button')) {
      this.behaviorMetrics.purchaseClicks++;
    }
  }

  trackExitIntent(event) {
    if (event.clientY <= 0 && !this.behaviorMetrics.exitIntent) {
      this.behaviorMetrics.exitIntent = true;

      // Track exit intent event
      this.trackEvent('exit_intent', {
        timeOnPage: Date.now() - this.pageStartTime,
        scrollDepth: this.behaviorMetrics.scrollDepth
      });
    }
  }

  startReporting() {
    if (!this.options.enableReporting) return;

    // Initial report after 5 seconds
    setTimeout(() => {
      this.reportMetrics();
    }, 5000);

    // Periodic reporting
    this.reportTimer = setInterval(() => {
      this.reportMetrics();
    }, this.options.reportInterval);
  }

  reportMetrics() {
    if (!this.options.enableReporting) return;

    const currentTime = Date.now();
    this.behaviorMetrics.timeOnPage = currentTime - this.pageStartTime;

    const performanceData = {
      // Product context
      product: this.options.productName,
      price: this.options.price,
      timestamp: currentTime,

      // Performance metrics
      performance: {
        ...this.metrics
      },

      // User behavior
      behavior: this.behaviorMetrics,

      // Browser/device info
      browser: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connectionType: navigator.connection?.effectiveType || 'unknown'
      }
    };

    // Send to analytics platforms
    this.sendToAnalytics(performanceData);

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      this.logMetrics();
    }
  }

  sendToAnalytics(data) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metrics', {
        custom_parameters: data
      });
    }

    // Custom analytics endpoint
    if (typeof window !== 'undefined' && window.NBS_ANALYTICS) {
      window.NBS_ANALYTICS.track('performance', data);
    }

    // Web Vitals specific reporting
    this.reportWebVitals();
  }

  reportWebVitals() {
    const vitals = {
      CLS: this.metrics.cumulativeLayoutShift,
      LCP: this.metrics.largestContentfulPaint,
      FID: this.metrics.firstInputDelay,
      FCP: this.metrics.firstContentfulPaint
    };

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', vitals);
    }
  }

  performFinalAnalysis() {
    const conversionScore = this.analyzeConversionPotential();
    const resourceAnalysis = this.analyzeResourcePerformance();

    const finalData = {
      conversion_score: conversionScore,
      resource_performance: resourceAnalysis,
      final_metrics: {
        ...this.metrics,
        ...this.behaviorMetrics
      }
    };

    // Send final session data
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'session_end', finalData);
    }

    // Trigger custom event for other modules
    document.dispatchEvent(new CustomEvent('performanceSessionEnd', {
      detail: finalData
    }));
  }

  analyzeConversionPotential() {
    let score = 100; // Start with perfect score

    // Performance deductions
    if (this.metrics.largestContentfulPaint > 2500) score -= 20;
    if (this.metrics.cumulativeLayoutShift > 0.1) score -= 15;
    if (this.metrics.firstInputDelay > 100) score -= 10;

    // Engagement deductions
    if (this.behaviorMetrics.timeOnPage < 30000) score -= 15; // Less than 30s
    if (this.behaviorMetrics.scrollDepth < 25) score -= 20; // Minimal scroll
    if (this.behaviorMetrics.purchaseClicks === 0 && this.behaviorMetrics.timeOnPage > 60000) score -= 25;

    return Math.max(0, score);
  }

  analyzeResourcePerformance() {
    const resources = performance.getEntriesByType('resource');
    const analysis = {
      slowResources: [],
      totalResources: resources.length,
      totalTransferSize: 0,
      criticalResourcesTime: 0
    };

    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.startTime;

      // Track transfer size if available
      if ('transferSize' in resource) {
        analysis.totalTransferSize += resource.transferSize || 0;
      }

      // Identify slow resources (>1s)
      if (duration > 1000) {
        analysis.slowResources.push({
          name: resource.name.split('/').pop() || resource.name,
          duration: Math.round(duration),
          type: resource.initiatorType
        });
      }

      // Track critical resources
      if (['css', 'script'].includes(resource.initiatorType) ||
        resource.name.includes('font')) {
        analysis.criticalResourcesTime += duration;
      }
    });

    return analysis;
  }

  checkPerformanceBudgets() {
    const budgets = {
      LCP: 2500, // 2.5 seconds
      FID: 100,  // 100ms
      CLS: 0.1   // 0.1
    };

    const violations = [];

    if (this.metrics.largestContentfulPaint > budgets.LCP) {
      violations.push({
        metric: 'LCP',
        value: this.metrics.largestContentfulPaint,
        budget: budgets.LCP
      });
    }

    if (this.metrics.firstInputDelay > budgets.FID) {
      violations.push({
        metric: 'FID',
        value: this.metrics.firstInputDelay,
        budget: budgets.FID
      });
    }

    if (this.metrics.cumulativeLayoutShift > budgets.CLS) {
      violations.push({
        metric: 'CLS',
        value: this.metrics.cumulativeLayoutShift,
        budget: budgets.CLS
      });
    }

    return violations;
  }

  logMetrics() {
    console.group('🔍 Performance Metrics');
    console.log('Core Web Vitals:', {
      CLS: this.metrics.cumulativeLayoutShift.toFixed(3),
      LCP: `${this.metrics.largestContentfulPaint.toFixed(0)}ms`,
      FID: `${this.metrics.firstInputDelay.toFixed(0)}ms`,
      FCP: `${this.metrics.firstContentfulPaint.toFixed(0)}ms`
    });
    console.log('User Behavior:', this.behaviorMetrics);

    const violations = this.checkPerformanceBudgets();
    if (violations.length > 0) {
      console.warn('⚠️ Performance Budget Violations:', violations);
    }

    console.groupEnd();
  }

  trackEvent(eventName, data) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, data);
    }

    if (typeof window !== 'undefined' && window.ProductEnhancements?.analytics) {
      window.ProductEnhancements.analytics.track(eventName, data);
    }
  }

  // Utility function
  throttle(func, delay) {
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
  }

  // Public API
  getMetrics() {
    return {
      performance: { ...this.metrics },
      behavior: {
        ...this.behaviorMetrics,
        timeOnPage: Date.now() - this.pageStartTime
      }
    };
  }

  getConversionScore() {
    return this.analyzeConversionPotential();
  }

  getBudgetViolations() {
    return this.checkPerformanceBudgets();
  }

  destroy() {
    // Clear timer
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
    }

    // Remove event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    // Disconnect observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });

    // Final report
    this.reportMetrics();
  }
}

// Export as ES6 module
export { PerformanceTracker };