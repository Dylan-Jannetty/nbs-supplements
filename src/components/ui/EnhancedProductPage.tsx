import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './button.tsx';
import { Badge } from './badge.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card.tsx';

interface ProductPageEnhancementsProps {
  product: {
    name: string;
    price: number;
    gumroadUrl: string;
  };
  ingredients: Array<{
    name: string;
    dosage: string;
    purpose: string;
    description: string;
    benefits: string[];
  }>;
}

interface PurchaseMetrics {
  buttonHovers: number;
  buttonClicks: number;
  scrollDepth: number;
  timeOnPage: number;
  exitIntentTriggered: boolean;
}

const EnhancedProductPage: React.FC<ProductPageEnhancementsProps> = ({ product, ingredients }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [purchaseMetrics, setPurchaseMetrics] = useState<PurchaseMetrics>({
    buttonHovers: 0,
    buttonClicks: 0,
    scrollDepth: 0,
    timeOnPage: 0,
    exitIntentTriggered: false
  });
  const [recentPurchases] = useState([
    { name: "Jessica M.", time: "2 minutes ago", location: "California" },
    { name: "Ryan K.", time: "8 minutes ago", location: "Texas" },
    { name: "Maria S.", time: "15 minutes ago", location: "New York" }
  ]);
  const [stockAlert] = useState(87); // Simulated stock level
  const [wishlistAdded, setWishlistAdded] = useState(false);

  // Refs
  const pageStartTime = useRef(Date.now());
  const stickyButtonRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const exitIntentTimerRef = useRef<NodeJS.Timeout>();

  // Performance optimized scroll handler
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    setScrollProgress(scrollPercent);
    setShowStickyButton(scrollTop > 800);
    
    // Update metrics
    setPurchaseMetrics(prev => ({
      ...prev,
      scrollDepth: Math.max(prev.scrollDepth, scrollPercent)
    }));
  }, []);

  // Optimized smooth scroll function
  const smoothScrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Track navigation
      trackEvent('navigation', { target: elementId, method: 'smooth_scroll' });
    }
  }, []);

  // Purchase intent tracking
  const handlePurchaseIntent = useCallback((action: 'hover' | 'click') => {
    if (action === 'hover') {
      setPurchaseMetrics(prev => ({
        ...prev,
        buttonHovers: prev.buttonHovers + 1
      }));
      trackEvent('purchase_intent', { action: 'button_hover', count: purchaseMetrics.buttonHovers + 1 });
    } else {
      setPurchaseMetrics(prev => ({
        ...prev,
        buttonClicks: prev.buttonClicks + 1
      }));
      trackEvent('purchase_intent', { action: 'button_click', count: purchaseMetrics.buttonClicks + 1 });
    }
  }, [purchaseMetrics.buttonHovers, purchaseMetrics.buttonClicks]);

  // Enhanced purchase flow
  const handlePurchase = useCallback(async () => {
    setIsLoading(true);
    handlePurchaseIntent('click');
    
    // Simulate brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Track conversion
    trackEvent('purchase_attempted', {
      product: product.name,
      price: product.price,
      metrics: purchaseMetrics
    });
    
    // Open Gumroad in new tab
    window.open(product.gumroadUrl, '_blank');
    setIsLoading(false);
  }, [product, purchaseMetrics]);

  // Exit intent detection
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !purchaseMetrics.exitIntentTriggered) {
      setShowExitIntent(true);
      setPurchaseMetrics(prev => ({
        ...prev,
        exitIntentTriggered: true
      }));
      trackEvent('exit_intent', { timeOnPage: Date.now() - pageStartTime.current });
    }
  }, [purchaseMetrics.exitIntentTriggered]);

  // Wishlist functionality
  const handleWishlist = useCallback(() => {
    setWishlistAdded(!wishlistAdded);
    trackEvent('wishlist_toggle', { 
      product: product.name,
      action: wishlistAdded ? 'removed' : 'added'
    });
    
    // Store in localStorage for persistence
    const wishlist = JSON.parse(localStorage.getItem('nbs_wishlist') || '[]');
    if (wishlistAdded) {
      const filtered = wishlist.filter((item: any) => item.name !== product.name);
      localStorage.setItem('nbs_wishlist', JSON.stringify(filtered));
    } else {
      wishlist.push({ name: product.name, price: product.price, addedAt: Date.now() });
      localStorage.setItem('nbs_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlistAdded, product]);

  // Event tracking utility
  const trackEvent = useCallback((eventName: string, data: any) => {
    // Integration point for analytics (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, data);
    }
    console.log(`Event: ${eventName}`, data); // Development logging
  }, []);

  // Intersection Observer for lazy loading sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          trackEvent('section_viewed', { section: entry.target.id });
        }
      });
    }, observerOptions);

    // Observe all major sections
    const sections = document.querySelectorAll('[data-observe]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [trackEvent]);

  // Set up event listeners
  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 16); // 60fps
    window.addEventListener('scroll', throttledScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Time tracking
    const interval = setInterval(() => {
      setPurchaseMetrics(prev => ({
        ...prev,
        timeOnPage: Date.now() - pageStartTime.current
      }));
    }, 5000);

    // Load wishlist state
    const wishlist = JSON.parse(localStorage.getItem('nbs_wishlist') || '[]');
    setWishlistAdded(wishlist.some((item: any) => item.name === product.name));

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(interval);
      if (exitIntentTimerRef.current) {
        clearTimeout(exitIntentTimerRef.current);
      }
    };
  }, [handleScroll, handleMouseLeave, product.name]);

  return (
    <>
      {/* Progress Indicator */}
      <div 
        ref={progressBarRef}
        className="fixed top-0 left-0 w-full h-1 z-50 bg-background/80 backdrop-blur-sm"
      >
        <div 
          className="h-full bg-gradient-to-r from-nbs-primary to-nbs-secondary transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Purchase Button */}
      <div 
        ref={stickyButtonRef}
        className={`fixed bottom-4 right-4 z-40 transition-all duration-500 ease-out ${
          showStickyButton ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <Card className="shadow-2xl border-2 border-nbs-primary/20 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/catalyst-front-thumb.jpg" 
                alt="Catalyst" 
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-2xl font-bold text-nbs-primary">${product.price}</p>
              </div>
              <Button
                size="lg"
                className="bg-nbs-primary hover:bg-nbs-primary/90 text-white"
                onClick={handlePurchase}
                onMouseEnter={() => handlePurchaseIntent('hover')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </div>
                ) : (
                  'Buy Now'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Purchase Buttons with Loading States */}
      <div className="enhanced-purchase-section">
        <style>
          {`
            .purchase-button {
              position: relative;
              overflow: hidden;
              transform: translateY(0);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .purchase-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            .purchase-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
              transition: left 0.5s;
            }
            .purchase-button:hover::before {
              left: 100%;
            }
            .animate-in {
              opacity: 1;
              transform: translateY(0);
            }
            .animate-in-delayed {
              opacity: 0;
              transform: translateY(20px);
              animation: slideInUp 0.6s ease-out forwards;
            }
            @keyframes slideInUp {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .ingredient-card {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .ingredient-card:hover {
              transform: translateY(-4px) scale(1.02);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
          `}
        </style>
      </div>

      {/* Social Proof Section */}
      <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border-green-200 dark:border-green-800" data-observe>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {stockAlert} left in stock
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Recent purchases:
                {recentPurchases.slice(0, 2).map((purchase, index) => (
                  <span key={index} className="block">
                    {purchase.name} from {purchase.location} • {purchase.time}
                  </span>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWishlist}
              className={`transition-colors ${wishlistAdded ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
            >
              <svg
                className={`w-4 h-4 mr-2 transition-colors ${wishlistAdded ? 'fill-red-500' : 'fill-none'}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistAdded ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Ingredient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-observe>
        {ingredients.map((ingredient, index) => (
          <Card 
            key={ingredient.name} 
            className="ingredient-card hover:shadow-lg cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                <Badge variant="outline" className="bg-nbs-primary/10 text-nbs-primary border-nbs-primary">
                  {ingredient.dosage}
                </Badge>
              </div>
              <CardDescription className="text-nbs-accent font-medium">
                {ingredient.purpose}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{ingredient.description}</p>
              <div className="space-y-1">
                <h4 className="font-medium text-foreground">Key Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {ingredient.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-nbs-secondary rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Helper */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
        <div className="space-y-3">
          {['ingredient-breakdown', 'reviews', 'faq'].map((section) => (
            <button
              key={section}
              onClick={() => smoothScrollTo(section)}
              className="block w-3 h-3 rounded-full bg-muted hover:bg-nbs-primary transition-colors duration-200"
              aria-label={`Go to ${section.replace('-', ' ')}`}
            />
          ))}
        </div>
      </div>

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Wait! Before you go...</CardTitle>
                <button
                  onClick={() => setShowExitIntent(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get 10% off your first order of Catalyst! Use code <span className="font-bold text-nbs-primary">FIRST10</span>
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handlePurchase}
                  className="flex-1 bg-nbs-primary hover:bg-nbs-primary/90"
                >
                  Get Discount
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowExitIntent(false)}
                  className="flex-1"
                >
                  No Thanks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

// Utility function for throttling
function throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return ((...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}

export default EnhancedProductPage;