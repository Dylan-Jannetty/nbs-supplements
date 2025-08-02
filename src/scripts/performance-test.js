/**
 * Performance Testing Script for NBS Supplements
 * Runs automated Core Web Vitals tests and provides recommendations
 */

// Performance budget thresholds
const PERFORMANCE_BUDGET = {
  LCP: { good: 2000, poor: 4000 },      // ms
  INP: { good: 150, poor: 500 },        // ms
  CLS: { good: 0.05, poor: 0.25 },      // unitless
  FCP: { good: 1800, poor: 3000 },      // ms
  TTFB: { good: 600, poor: 1500 },      // ms
  TotalBlockingTime: { good: 200, poor: 600 }, // ms
  SpeedIndex: { good: 3400, poor: 5800 } // ms
};

class PerformanceTester {
  constructor() {
    this.results = new Map();
    this.recommendations = [];
  }

  async runTests() {
    console.log('🚀 Starting NBS Supplements Performance Tests...\n');
    
    await this.measurePageLoad();
    await this.measureInteractivity();
    await this.measureVisualStability();
    await this.measureResourceLoading();
    
    this.generateReport();
    this.generateRecommendations();
  }

  async measurePageLoad() {
    console.log('📊 Measuring Page Load Performance...');
    
    const startTime = performance.now();
    
    // Wait for page to fully load
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
    
    const loadTime = performance.now() - startTime;
    
    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.results.set('TTFB', navigation.responseStart - navigation.requestStart);
      this.results.set('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
      this.results.set('LoadEvent', navigation.loadEventEnd - navigation.loadEventStart);
    }
    
    // Get paint timing
    const paints = performance.getEntriesByType('paint');
    paints.forEach(paint => {
      if (paint.name === 'first-contentful-paint') {
        this.results.set('FCP', paint.startTime);
      }
    });
    
    console.log(`✅ Page Load: ${Math.round(loadTime)}ms`);
  }

  async measureInteractivity() {
    console.log('🖱️  Measuring Interactivity...');
    
    // Measure main thread blocking time
    let totalBlockingTime = 0;
    const longTasks = performance.getEntriesByType('longtask');
    
    longTasks.forEach(task => {
      const blockingTime = Math.max(0, task.duration - 50);
      totalBlockingTime += blockingTime;
    });
    
    this.results.set('TotalBlockingTime', totalBlockingTime);
    
    // Test button responsiveness
    const buttons = document.querySelectorAll('button, .gumroad-button');
    if (buttons.length > 0) {
      const testButton = buttons[0];
      const clickStart = performance.now();
      testButton.click();
      const clickEnd = performance.now();
      this.results.set('ButtonResponseTime', clickEnd - clickStart);
    }
    
    console.log(`✅ Total Blocking Time: ${Math.round(totalBlockingTime)}ms`);
  }

  async measureVisualStability() {
    console.log('📏 Measuring Visual Stability...');
    
    let cumulativeLayoutShift = 0;
    
    // Observe layout shifts
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          cumulativeLayoutShift += entry.value;
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Wait for a bit to collect layout shifts
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      observer.disconnect();
      this.results.set('CLS', cumulativeLayoutShift);
      
      console.log(`✅ Cumulative Layout Shift: ${cumulativeLayoutShift.toFixed(3)}`);
    } catch (e) {
      console.warn('CLS measurement not supported');
    }
  }

  async measureResourceLoading() {
    console.log('📦 Measuring Resource Loading...');
    
    const resources = performance.getEntriesByType('resource');
    
    let totalResourceSize = 0;
    let totalResourceTime = 0;
    let imageCount = 0;
    let scriptCount = 0;
    let stylesheetCount = 0;
    
    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.startTime;
      totalResourceTime += duration;
      
      if (resource.transferSize) {
        totalResourceSize += resource.transferSize;
      }
      
      if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        imageCount++;
      } else if (resource.name.match(/\.js$/i)) {
        scriptCount++;
      } else if (resource.name.match(/\.css$/i)) {
        stylesheetCount++;
      }
    });
    
    this.results.set('TotalResourceSize', totalResourceSize);
    this.results.set('TotalResourceTime', totalResourceTime);
    this.results.set('ImageCount', imageCount);
    this.results.set('ScriptCount', scriptCount);
    this.results.set('StylesheetCount', stylesheetCount);
    
    console.log(`✅ Total Resources: ${resources.length} (${Math.round(totalResourceSize / 1024)}KB)`);
  }

  generateReport() {
    console.log('\n📋 Performance Report');
    console.log('=====================================');
    
    // Core Web Vitals
    console.log('\n🎯 Core Web Vitals:');
    ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].forEach(metric => {
      const value = this.results.get(metric);
      if (value !== undefined) {
        const budget = PERFORMANCE_BUDGET[metric];
        const rating = this.getRating(value, budget);
        const emoji = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
        
        console.log(`${emoji} ${metric}: ${this.formatValue(metric, value)} (${rating})`);
      }
    });
    
    // Other metrics
    console.log('\n📊 Additional Metrics:');
    ['TotalBlockingTime', 'ButtonResponseTime', 'TotalResourceSize', 'ImageCount', 'ScriptCount'].forEach(metric => {
      const value = this.results.get(metric);
      if (value !== undefined) {
        console.log(`• ${metric}: ${this.formatValue(metric, value)}`);
      }
    });
  }

  generateRecommendations() {
    console.log('\n💡 Performance Recommendations:');
    console.log('=====================================');
    
    // LCP recommendations
    const lcp = this.results.get('LCP');
    if (lcp && lcp > PERFORMANCE_BUDGET.LCP.good) {
      this.recommendations.push('🖼️  Optimize Largest Contentful Paint by preloading hero images');
      this.recommendations.push('⚡ Consider using WebP format for images');
      this.recommendations.push('🔗 Ensure critical CSS is inlined');
    }
    
    // INP recommendations
    const inp = this.results.get('INP') || this.results.get('TotalBlockingTime');
    if (inp && inp > PERFORMANCE_BUDGET.INP.good) {
      this.recommendations.push('🚀 Reduce JavaScript execution time');
      this.recommendations.push('⏰ Use requestIdleCallback for non-critical tasks');
      this.recommendations.push('📦 Consider code splitting for large bundles');
    }
    
    // CLS recommendations
    const cls = this.results.get('CLS');
    if (cls && cls > PERFORMANCE_BUDGET.CLS.good) {
      this.recommendations.push('📐 Add explicit width/height to images');
      this.recommendations.push('🎨 Reserve space for dynamic content');
      this.recommendations.push('🔄 Optimize font loading to prevent layout shifts');
    }
    
    // Resource recommendations
    const resourceSize = this.results.get('TotalResourceSize');
    if (resourceSize && resourceSize > 1000000) { // 1MB
      this.recommendations.push('📦 Consider reducing total resource size');
      this.recommendations.push('🗜️  Enable compression for text resources');
    }
    
    const imageCount = this.results.get('ImageCount');
    if (imageCount && imageCount > 10) {
      this.recommendations.push('🖼️  Consider lazy loading for non-critical images');
    }
    
    // Display recommendations
    this.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    
    if (this.recommendations.length === 0) {
      console.log('🎉 Great job! No major performance issues detected.');
    }
  }

  getRating(value, budget) {
    if (value <= budget.good) return 'good';
    if (value <= budget.poor) return 'needs-improvement';
    return 'poor';
  }

  formatValue(metric, value) {
    if (metric === 'CLS') {
      return value.toFixed(3);
    } else if (metric.includes('Size')) {
      return `${Math.round(value / 1024)}KB`;
    } else if (metric.includes('Count')) {
      return value.toString();
    } else {
      return `${Math.round(value)}ms`;
    }
  }

  // Export results for external analysis
  exportResults() {
    const results = Object.fromEntries(this.results);
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      results,
      recommendations: this.recommendations,
      budget: PERFORMANCE_BUDGET
    };
    
    // Save to localStorage for debugging
    localStorage.setItem('nbs-performance-report', JSON.stringify(report, null, 2));
    
    return report;
  }
}

// Auto-run if script is loaded directly
if (typeof window !== 'undefined' && window.location) {
  // Wait for page to be interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => new PerformanceTester().runTests(), 1000);
    });
  } else {
    setTimeout(() => new PerformanceTester().runTests(), 1000);
  }
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.PerformanceTester = PerformanceTester;
}