/**
 * Product Page Coordinator
 * Main orchestrator that initializes and coordinates all product page modules
 */

import { QuantitySelector } from './modules/quantity-selector.js';
// import { ProductComparison } from './modules/product-comparison.js'; // TODO: Create this module
import { PerformanceTracker } from './modules/performance-tracker.js';
import { EnhancedProductFeatures } from './modules/enhanced-product-features.js';

export class ProductPageCoordinator {
  constructor(config = {}) {
    this.config = {
      // Product configuration
      product: {
        name: 'Catalyst Pre-Workout',
        price: 30.00,
        gumroadUrl: 'https://gumroad.com/l/nbs-catalyst'
      },

      // Ingredients data
      ingredients: [],

      // Module configurations
      enableQuantitySelector: true,
      enableProductComparison: true,
      enablePerformanceTracking: true,
      enableEnhancedFeatures: true,

      // Container selectors
      quantitySelectorContainer: '#quantity-selector',
      comparisonContainer: '#product-comparison',

      // Analytics configuration
      enableAnalytics: true,
      analyticsProvider: 'gtag', // 'gtag' | 'custom' | 'both'

      ...config
    };

    this.modules = {};
    this.analytics = new AnalyticsManager(this.config);
    this.isInitialized = false;

    // Make analytics globally available
    if (typeof window !== 'undefined') {
      window.ProductEnhancements = window.ProductEnhancements || {};
      window.ProductEnhancements.analytics = this.analytics;
    }

    this.init();
  }

  async init() {
    try {
      console.log('🚀 Initializing Product Page Coordinator...');

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialize modules based on configuration
      await this.initializeModules();

      // Set up inter-module communication
      this.setupEventHandlers();

      // Initialize analytics tracking
      this.initializeAnalytics();

      // Set up error handling
      this.setupErrorHandling();

      this.isInitialized = true;
      console.log('✅ Product Page Coordinator initialized successfully');

      // Dispatch ready event
      this.dispatchEvent('productPageReady', {
        modules: Object.keys(this.modules),
        config: this.config
      });

    } catch (error) {
      console.error('❌ Failed to initialize Product Page Coordinator:', error);
      this.handleInitializationError(error);
    }
  }

  async initializeModules() {
    const initPromises = [];

    // Initialize Performance Tracker first (for early metrics collection)
    if (this.config.enablePerformanceTracking) {
      initPromises.push(this.initPerformanceTracker());
    }

    // Initialize other modules in parallel
    if (this.config.enableQuantitySelector) {
      initPromises.push(this.initQuantitySelector());
    }

    // if (this.config.enableProductComparison) {
    //   initPromises.push(this.initProductComparison());
    // }

    if (this.config.enableEnhancedFeatures) {
      initPromises.push(this.initEnhancedFeatures());
    }

    await Promise.all(initPromises);
  }

  async initQuantitySelector() {
    try {
      const container = document.querySelector(this.config.quantitySelectorContainer);
      if (!container) {
        console.warn('Quantity selector container not found:', this.config.quantitySelectorContainer);
        return;
      }

      // Read configuration from data attributes or fallback to config
      const basePrice = parseFloat(container.dataset.basePrice) || this.config.product.price;
      const gumroadUrl = container.dataset.gumroadUrl || this.config.product.gumroadUrl;

      this.modules.quantitySelector = new QuantitySelector(container, {
        basePrice: basePrice,
        gumroadUrl: gumroadUrl,
        onQuantityChange: (quantity, totalPrice, savings) => {
          this.handleQuantityChange(quantity, totalPrice, savings);
        }
      });

      console.log('✓ Quantity Selector initialized');
    } catch (error) {
      console.error('Failed to initialize Quantity Selector:', error);
    }
  }

  // async initProductComparison() {
  //   try {
  //     const container = document.querySelector(this.config.comparisonContainer);
  //     if (!container) {
  //       console.warn('Product comparison container not found:', this.config.comparisonContainer);
  //       return;
  //     }

  //     this.modules.productComparison = new ProductComparison(container, {
  //       currentProduct: {
  //         name: this.config.product.name,
  //         price: this.config.product.price,
  //         features: [
  //           "Clinical doses",
  //           "Natural ingredients",
  //           "Third-party tested",
  //           "Pharmacist formulated"
  //         ],
  //         rating: 4.8
  //       }
  //     });

  //     console.log('✓ Product Comparison initialized');
  //   } catch (error) {
  //     console.error('Failed to initialize Product Comparison:', error);
  //   }
  // }

  async initPerformanceTracker() {
    try {
      this.modules.performanceTracker = new PerformanceTracker({
        productName: this.config.product.name,
        price: this.config.product.price,
        enableReporting: this.config.enableAnalytics
      });

      console.log('✓ Performance Tracker initialized');
    } catch (error) {
      console.error('Failed to initialize Performance Tracker:', error);
    }
  }

  async initEnhancedFeatures() {
    try {
      this.modules.enhancedFeatures = new EnhancedProductFeatures({
        product: this.config.product,
        ingredients: this.config.ingredients
      });

      console.log('✓ Enhanced Features initialized');
    } catch (error) {
      console.error('Failed to initialize Enhanced Features:', error);
    }
  }

  setupEventHandlers() {
    // Listen for quantity changes
    document.addEventListener('quantityChanged', (event) => {
      const { quantity, tier } = event.detail;
      this.analytics.track('quantity_selection', {
        quantity,
        price: tier.price,
        savings: tier.savings
      });

      // Update any other modules that need to know about quantity changes
      this.broadcastToModules('quantityUpdated', { quantity, tier });
    });

    // Listen for comparison interactions
    // document.addEventListener('comparisonToggled', (event) => {
    //   const { expanded } = event.detail;
    //   this.analytics.track('comparison_interaction', {
    //     action: expanded ? 'expand' : 'collapse'
    //   });
    // });

    // Listen for performance session end
    document.addEventListener('performanceSessionEnd', (event) => {
      const { detail } = event;
      this.handleSessionEnd(detail);
    });

    // Global error handling
    window.addEventListener('error', (event) => {
      this.handleError('JavaScript Error', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('Unhandled Promise Rejection', event.reason);
    });
  }

  initializeAnalytics() {
    // Track page initialization
    this.analytics.track('product_page_initialized', {
      product: this.config.product.name,
      price: this.config.product.price,
      modules: Object.keys(this.modules),
      timestamp: Date.now()
    });

    // Set up enhanced ecommerce tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'USD',
        value: this.config.product.price,
        items: [{
          item_id: 'catalyst-preworkout',
          item_name: this.config.product.name,
          category: 'Pre-Workout',
          quantity: 1,
          price: this.config.product.price
        }]
      });
    }
  }

  setupErrorHandling() {
    // Module-specific error boundaries
    Object.keys(this.modules).forEach(moduleKey => {
      const module = this.modules[moduleKey];
      if (module && typeof module.on === 'function') {
        module.on('error', (error) => {
          this.handleError(`${moduleKey} Error`, error);
        });
      }
    });
  }

  // Event Handlers
  handleQuantityChange(quantity, totalPrice, savings) {
    // Update global state
    this.currentQuantity = quantity;
    this.currentTotalPrice = totalPrice;
    this.currentSavings = savings;

    // Update enhanced features if needed
    if (this.modules.enhancedFeatures) {
      // Could update sticky button price, etc.
    }

    // Enhanced ecommerce tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: totalPrice,
        items: [{
          item_id: 'catalyst-preworkout',
          item_name: this.config.product.name,
          category: 'Pre-Workout',
          quantity: quantity,
          price: this.config.product.price
        }]
      });
    }
  }

  handleSessionEnd(performanceData) {
    // Aggregate final session data
    const sessionData = {
      performance: performanceData,
      interactions: {
        quantity: this.currentQuantity || 1,
        totalPrice: this.currentTotalPrice || this.config.product.price,
        savings: this.currentSavings || 0
      },
      modules: this.getModuleStatuses()
    };

    this.analytics.track('session_complete', sessionData);
  }

  handleError(source, error) {
    console.error(`${source}:`, error);

    this.analytics.track('error_occurred', {
      source,
      error: error.message || error.toString(),
      stack: error.stack,
      timestamp: Date.now()
    });
  }

  handleInitializationError(error) {
    // Fallback initialization for critical features
    console.warn('Attempting fallback initialization...');

    // At minimum, ensure purchase buttons work
    this.setupFallbackPurchaseButtons();

    this.analytics.track('initialization_error', {
      error: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });
  }

  setupFallbackPurchaseButtons() {
    document.querySelectorAll('.purchase-button').forEach(button => {
      button.addEventListener('click', () => {
        window.open(this.config.product.gumroadUrl, '_blank');
      });
    });
  }

  // Utility Methods
  broadcastToModules(eventType, data) {
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.handleEvent === 'function') {
        try {
          module.handleEvent(eventType, data);
        } catch (error) {
          console.warn(`Module failed to handle event ${eventType}:`, error);
        }
      }
    });
  }

  dispatchEvent(eventName, data) {
    document.dispatchEvent(new CustomEvent(`productPage:${eventName}`, {
      detail: data,
      bubbles: true
    }));
  }

  getModuleStatuses() {
    const statuses = {};
    Object.keys(this.modules).forEach(key => {
      statuses[key] = {
        initialized: !!this.modules[key],
        hasError: false // Could be enhanced with more detailed status
      };
    });
    return statuses;
  }

  // Public API
  getModule(name) {
    return this.modules[name];
  }

  getAllModules() {
    return { ...this.modules };
  }

  getConfig() {
    return { ...this.config };
  }

  isReady() {
    return this.isInitialized;
  }

  getAnalytics() {
    return this.analytics;
  }

  destroy() {
    // Destroy all modules
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.destroy === 'function') {
        try {
          module.destroy();
        } catch (error) {
          console.warn('Error destroying module:', error);
        }
      }
    });

    // Clean up analytics
    if (this.analytics && typeof this.analytics.destroy === 'function') {
      this.analytics.destroy();
    }

    // Clear references
    this.modules = {};
    this.isInitialized = false;

    console.log('Product Page Coordinator destroyed');
  }
}

// Analytics Manager Class
class AnalyticsManager {
  constructor(config) {
    this.config = config;
    this.eventQueue = [];
    this.isReady = false;

    this.init();
  }

  init() {
    // Initialize analytics providers
    if (this.config.enableAnalytics) {
      this.setupProviders();
    }

    this.isReady = true;
    this.flushEventQueue();
  }

  setupProviders() {
    // Google Analytics setup is handled externally
    // This is where you could add other providers like Mixpanel, Amplitude, etc.
  }

  track(eventName, data = {}) {
    const event = {
      name: eventName,
      data: {
        ...data,
        timestamp: Date.now(),
        page: window.location.pathname
      }
    };

    if (!this.isReady) {
      this.eventQueue.push(event);
      return;
    }

    this.sendEvent(event);
  }

  sendEvent(event) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, event.data);
    }

    // Custom analytics endpoint
    if (typeof window !== 'undefined' && window.NBS_ANALYTICS) {
      window.NBS_ANALYTICS.track(event.name, event.data);
    }

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Analytics Event: ${event.name}`, event.data);
    }
  }

  flushEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      this.sendEvent(event);
    }
  }

  destroy() {
    this.eventQueue = [];
    this.isReady = false;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a product page
  if (document.body.classList.contains('product-page') ||
    window.location.pathname.includes('/products/')) {

    // Get configuration from data attributes or window object
    const config = window.PRODUCT_PAGE_CONFIG || {};

    // Initialize coordinator
    window.ProductPageCoordinator = new ProductPageCoordinator(config);

    // Make coordinator globally accessible for debugging
    if (process.env.NODE_ENV === 'development') {
      window.ProductEnhancements = window.ProductEnhancements || {};
      window.ProductEnhancements.coordinator = window.ProductPageCoordinator;
    }
  }
});

// Export for module usage
export default ProductPageCoordinator;