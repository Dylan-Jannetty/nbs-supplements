/**
 * Core Web Vitals Performance Monitoring
 * Tracks LCP, INP, CLS, and other performance metrics for NBS Supplements
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
}

interface WebVitalsConfig {
  lcpThreshold: { good: number; poor: number };
  inpThreshold: { good: number; poor: number };
  clsThreshold: { good: number; poor: number };
  reportCallback?: (metric: PerformanceMetric) => void;
}

class PerformanceMonitor {
  private config: WebVitalsConfig;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor(config: Partial<WebVitalsConfig> = {}) {
    this.config = {
      lcpThreshold: { good: 2000, poor: 4000 },
      inpThreshold: { good: 150, poor: 500 },
      clsThreshold: { good: 0.05, poor: 0.25 },
      ...config
    };

    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Wait for page load to ensure accurate measurements
    window.addEventListener('load', () => {
      this.measureLCP();
      this.measureINP();
      this.measureCLS();
      this.measureTTFB();
      this.measureFCP();
    });
  }

  private getRating(value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  }

  private reportMetric(metric: PerformanceMetric): void {
    this.metrics.set(metric.name, metric);
    
    // Send to analytics if callback provided
    if (this.config.reportCallback) {
      this.config.reportCallback(metric);
    }

    // Send to GA4 if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        page_url: metric.url
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric.name}: ${metric.value} (${metric.rating})`);
    }
  }

  private measureLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;

      if (lastEntry) {
        const value = lastEntry.startTime;
        this.reportMetric({
          name: 'LCP',
          value: Math.round(value),
          rating: this.getRating(value, this.config.lcpThreshold),
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    } catch (e) {
      console.warn('LCP measurement not supported');
    }
  }

  private measureINP(): void {
    if (!('PerformanceObserver' in window)) return;

    let maxINP = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      for (const entry of entries) {
        if (entry.entryType === 'event') {
          const eventEntry = entry as any;
          const inp = eventEntry.processingStart - eventEntry.startTime;
          
          if (inp > maxINP) {
            maxINP = inp;
            this.reportMetric({
              name: 'INP',
              value: Math.round(inp),
              rating: this.getRating(inp, this.config.inpThreshold),
              timestamp: Date.now(),
              url: window.location.href
            });
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['event'] });
      this.observers.set('inp', observer);
    } catch (e) {
      // Fallback to FID measurement if INP not supported
      this.measureFID();
    }
  }

  private measureFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as any;

      if (firstEntry) {
        const value = firstEntry.processingStart - firstEntry.startTime;
        this.reportMetric({
          name: 'FID',
          value: Math.round(value),
          rating: this.getRating(value, { good: 100, poor: 300 }),
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', observer);
    } catch (e) {
      console.warn('FID measurement not supported');
    }
  }

  private measureCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      for (const entry of entries) {
        if ((entry as any).hadRecentInput) continue;

        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

        if (sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000) {
          sessionValue += (entry as any).value;
          sessionEntries.push(entry);
        } else {
          sessionValue = (entry as any).value;
          sessionEntries = [entry];
        }

        if (sessionValue > clsValue) {
          clsValue = sessionValue;
          this.reportMetric({
            name: 'CLS',
            value: Math.round(clsValue * 1000) / 1000,
            rating: this.getRating(clsValue, this.config.clsThreshold),
            timestamp: Date.now(),
            url: window.location.href
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', observer);
    } catch (e) {
      console.warn('CLS measurement not supported');
    }
  }

  private measureTTFB(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const navigationEntry = entries[0] as any;

      if (navigationEntry) {
        const value = navigationEntry.responseStart - navigationEntry.requestStart;
        this.reportMetric({
          name: 'TTFB',
          value: Math.round(value),
          rating: this.getRating(value, { good: 600, poor: 1500 }),
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.set('ttfb', observer);
    } catch (e) {
      console.warn('TTFB measurement not supported');
    }
  }

  private measureFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries[0];

      if (fcpEntry) {
        const value = fcpEntry.startTime;
        this.reportMetric({
          name: 'FCP',
          value: Math.round(value),
          rating: this.getRating(value, { good: 1800, poor: 3000 }),
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('fcp', observer);
    } catch (e) {
      console.warn('FCP measurement not supported');
    }
  }

  // Public methods
  public getMetrics(): Map<string, PerformanceMetric> {
    return new Map(this.metrics);
  }

  public getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }

  // Report performance summary
  public reportSummary(): void {
    const summary = Array.from(this.metrics.values()).reduce((acc, metric) => {
      acc[metric.name] = {
        value: metric.value,
        rating: metric.rating
      };
      return acc;
    }, {} as Record<string, { value: number; rating: string }>);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_summary', {
        custom_map: summary,
        page_url: window.location.href
      });
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor({
  reportCallback: (metric) => {
    // Custom reporting logic can be added here
    // For example, sending to a custom analytics endpoint
    if (metric.rating === 'poor') {
      console.warn(`Poor performance detected: ${metric.name} = ${metric.value}`);
    }
  }
});

// Expose globally for debugging
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = performanceMonitor;
}