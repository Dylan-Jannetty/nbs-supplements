import React, { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  interactionToNextPaint: number;
}

interface UserBehaviorMetrics {
  timeOnPage: number;
  scrollDepth: number;
  clicksCount: number;
  formInteractions: number;
  purchaseClicks: number;
}

interface PerformanceTrackerProps {
  productName: string;
  price: number;
  enableReporting?: boolean;
}

const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({ 
  productName, 
  price, 
  enableReporting = true 
}) => {
  const metricsRef = useRef<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    interactionToNextPaint: 0
  });

  const behaviorRef = useRef<UserBehaviorMetrics>({
    timeOnPage: 0,
    scrollDepth: 0,
    clicksCount: 0,
    formInteractions: 0,
    purchaseClicks: 0,
  });

  const pageStartTime = useRef(Date.now());
  const observersRef = useRef<Array<PerformanceObserver>>([]);

  // Core Web Vitals measurement
  const measureCoreWebVitals = useCallback(() => {
    // Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metricsRef.current.cumulativeLayoutShift = Math.max(
          metricsRef.current.cumulativeLayoutShift,
          clsValue
        );
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observersRef.current.push(clsObserver);
    } catch (e) {
      console.warn('CLS measurement not supported');
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metricsRef.current.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observersRef.current.push(lcpObserver);
    } catch (e) {
      console.warn('LCP measurement not supported');
    }

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-input') {
            metricsRef.current.firstInputDelay = (entry as any).processingStart - entry.startTime;
          }
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observersRef.current.push(fidObserver);
    } catch (e) {
      console.warn('FID measurement not supported');
    }

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metricsRef.current.firstContentfulPaint = entry.startTime;
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      observersRef.current.push(fcpObserver);
    } catch (e) {
      console.warn('FCP measurement not supported');
    }
  }, []);

  // User behavior tracking
  const trackScrollDepth = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(100, (scrollTop / docHeight) * 100);
    
    behaviorRef.current.scrollDepth = Math.max(
      behaviorRef.current.scrollDepth,
      scrollPercent
    );
  }, []);

  const trackClick = useCallback((event: MouseEvent) => {
    behaviorRef.current.clicksCount++;
    
    const target = event.target as HTMLElement;
    
    // Track purchase-related clicks
    if (target.textContent?.toLowerCase().includes('buy') ||
        target.textContent?.toLowerCase().includes('cart') ||
        target.textContent?.toLowerCase().includes('order')) {
      behaviorRef.current.purchaseClicks++;
    }
    
    // Track form interactions
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      behaviorRef.current.formInteractions++;
    }
  }, []);

  // Performance reporting
  const reportMetrics = useCallback(() => {
    if (!enableReporting) return;

    const currentTime = Date.now();
    behaviorRef.current.timeOnPage = currentTime - pageStartTime.current;

    const performanceData = {
      // Product context
      product: productName,
      price: price,
      timestamp: currentTime,
      
      // Performance metrics
      performance: {
        ...metricsRef.current,
        pageLoadTime: performance.timing ? 
          performance.timing.loadEventEnd - performance.timing.navigationStart : 0
      },
      
      // User behavior
      behavior: behaviorRef.current,
      
      // Browser/device info
      browser: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connectionType: (navigator as any).connection?.effectiveType || 'unknown'
      }
    };

    // Send to analytics
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if ((window as any).gtag) {
        (window as any).gtag('event', 'performance_metrics', {
          custom_parameters: performanceData
        });
      }

      // Custom analytics endpoint (if available)
      if ((window as any).NBS_ANALYTICS) {
        (window as any).NBS_ANALYTICS.track('performance', performanceData);
      }

      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.group('🔍 Performance Metrics');
        console.log('Core Web Vitals:', {
          CLS: metricsRef.current.cumulativeLayoutShift.toFixed(3),
          LCP: `${metricsRef.current.largestContentfulPaint.toFixed(0)}ms`,
          FID: `${metricsRef.current.firstInputDelay.toFixed(0)}ms`,
          FCP: `${metricsRef.current.firstContentfulPaint.toFixed(0)}ms`
        });
        console.log('User Behavior:', behaviorRef.current);
        console.groupEnd();
      }
    }
  }, [enableReporting, productName, price]);

  // Real User Monitoring (RUM) for conversion optimization
  const analyzeConversionPotential = useCallback(() => {
    const metrics = behaviorRef.current;
    const performance = metricsRef.current;
    
    let conversionScore = 100; // Start with perfect score
    
    // Deduct points for poor performance
    if (performance.largestContentfulPaint > 2500) conversionScore -= 20;
    if (performance.cumulativeLayoutShift > 0.1) conversionScore -= 15;
    if (performance.firstInputDelay > 100) conversionScore -= 10;
    
    // Deduct points for poor engagement
    if (metrics.timeOnPage < 30000) conversionScore -= 15; // Less than 30 seconds
    if (metrics.scrollDepth < 25) conversionScore -= 20; // Didn't scroll much
    if (metrics.purchaseClicks === 0 && metrics.timeOnPage > 60000) conversionScore -= 25;
    
    return Math.max(0, conversionScore);
  }, []);

  // Resource timing analysis
  const analyzeResourcePerformance = useCallback(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const analysis = {
      slowResources: [] as Array<{name: string, duration: number, type: string}>,
      totalResources: resources.length,
      totalTransferSize: 0,
      criticalResourcesTime: 0
    };

    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.startTime;
      
      // Track transfer size if available
      if ('transferSize' in resource) {
        analysis.totalTransferSize += (resource as any).transferSize || 0;
      }
      
      // Identify slow resources (>1s)
      if (duration > 1000) {
        analysis.slowResources.push({
          name: resource.name.split('/').pop() || resource.name,
          duration: Math.round(duration),
          type: resource.initiatorType
        });
      }
      
      // Track critical resources (CSS, JS, fonts)
      if (resource.initiatorType === 'css' || 
          resource.initiatorType === 'script' ||
          resource.name.includes('font')) {
        analysis.criticalResourcesTime += duration;
      }
    });

    return analysis;
  }, []);

  // Initialize tracking
  useEffect(() => {
    measureCoreWebVitals();
    
    // Throttled scroll tracking
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', trackClick, { passive: true });
    
    // Report metrics periodically and on page unload
    const reportInterval = setInterval(reportMetrics, 30000); // Every 30 seconds
    
    const handleBeforeUnload = () => {
      reportMetrics();
      
      // Final conversion analysis
      const conversionScore = analyzeConversionPotential();
      const resourceAnalysis = analyzeResourcePerformance();
      
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'session_end', {
          conversion_score: conversionScore,
          resource_performance: resourceAnalysis,
          final_metrics: {
            ...metricsRef.current,
            ...behaviorRef.current
          }
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', trackClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(reportInterval);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      // Disconnect performance observers
      observersRef.current.forEach(observer => observer.disconnect());
    };
  }, [measureCoreWebVitals, trackScrollDepth, trackClick, reportMetrics, analyzeConversionPotential, analyzeResourcePerformance]);

  // Performance budget alerts (development only)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const checkPerformanceBudget = () => {
      const budgets = {
        LCP: 2500, // 2.5 seconds
        FID: 100,  // 100ms
        CLS: 0.1   // 0.1
      };
      
      if (metricsRef.current.largestContentfulPaint > budgets.LCP) {
        console.warn(`⚠️ LCP Budget Exceeded: ${metricsRef.current.largestContentfulPaint.toFixed(0)}ms (budget: ${budgets.LCP}ms)`);
      }
      
      if (metricsRef.current.firstInputDelay > budgets.FID) {
        console.warn(`⚠️ FID Budget Exceeded: ${metricsRef.current.firstInputDelay.toFixed(0)}ms (budget: ${budgets.FID}ms)`);
      }
      
      if (metricsRef.current.cumulativeLayoutShift > budgets.CLS) {
        console.warn(`⚠️ CLS Budget Exceeded: ${metricsRef.current.cumulativeLayoutShift.toFixed(3)} (budget: ${budgets.CLS})`);
      }
    };
    
    const budgetTimer = setTimeout(checkPerformanceBudget, 5000);
    return () => clearTimeout(budgetTimer);
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default PerformanceTracker;