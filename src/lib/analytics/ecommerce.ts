/**
 * E-commerce Analytics Tracking Functions
 * Handles Gumroad integration and purchase tracking
 */

import { trackEvent } from './ga4';
import type { 
  EcommerceItem,
  PurchaseEvent,
  ProductViewEvent,
  AddToCartEvent
} from './types';

/**
 * Default Catalyst product data
 */
const CATALYST_PRODUCT: EcommerceItem = {
  item_id: 'catalyst-preworkout',
  item_name: 'Catalyst Pre-Workout',
  category: 'Supplements',
  price: 39.99,
  quantity: 1
};

/**
 * Track purchase completion
 */
export function trackPurchase(
  orderId: string,
  value: number,
  items: EcommerceItem[] = [CATALYST_PRODUCT]
): void {
  const eventData: Partial<PurchaseEvent> = {
    transaction_id: orderId,
    value,
    currency: 'USD',
    items,
    affiliation: 'NBS Supplements',
    shipping: 0,
    tax: 0
  };

  trackEvent('purchase', eventData);
}

/**
 * Track product page views
 */
export function trackProductView(productData?: Partial<EcommerceItem>): void {
  const product = { ...CATALYST_PRODUCT, ...productData };
  
  const eventData: Partial<ProductViewEvent> = {
    currency: 'USD',
    value: product.price,
    items: [product]
  };

  trackEvent('view_item', eventData);
}

/**
 * Track add to cart events (for Gumroad clicks)
 */
export function trackAddToCart(productData?: Partial<EcommerceItem>): void {
  const product = { ...CATALYST_PRODUCT, ...productData };
  
  const eventData: Partial<AddToCartEvent> = {
    currency: 'USD',
    value: product.price,
    items: [product]
  };

  trackEvent('add_to_cart', eventData);
}

/**
 * Track when checkout begins (Gumroad overlay opens)
 */
export function trackBeginCheckout(productData?: Partial<EcommerceItem>): void {
  const product = { ...CATALYST_PRODUCT, ...productData };
  
  const eventData = {
    currency: 'USD',
    value: product.price,
    items: [product]
  };

  trackEvent('begin_checkout', eventData);
}

/**
 * Enhanced Gumroad button click tracking
 */
export function trackGumroadClick(element: HTMLElement): void {
  const productName = element.textContent?.trim() || CATALYST_PRODUCT.item_name;
  const price = CATALYST_PRODUCT.price;

  // Track as add to cart event
  trackAddToCart({
    item_name: productName,
    price: price
  });
}

/**
 * Initialize Gumroad tracking integration
 */
export function initializeGumroadTracking(): void {
  // Load Gumroad script dynamically
  const loadGumroad = () => {
    // Check if Gumroad is already loaded
    if (window.GumroadOverlay) {
      return;
    }
    
    // Check if script is already being loaded
    if (document.getElementById('gumroad-script')) {
      return;
    }
    
    // Create and load the Gumroad script
    const script = document.createElement('script');
    script.id = 'gumroad-script';
    script.src = 'https://gumroad.com/js/gumroad.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Gumroad script loaded successfully');
      
      // Set up Gumroad event listeners for conversion tracking
      if (window.GumroadOverlay) {
        // Track when checkout overlay opens
        const originalOpen = window.GumroadOverlay.open;
        window.GumroadOverlay.open = function(...args: any[]) {
          // Track begin_checkout event
          trackBeginCheckout();
          return originalOpen.apply(this, args);
        };
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Gumroad script');
    };
    
    document.head.appendChild(script);
  };

  // Set up click tracking for Gumroad buttons
  const setupGumroadButtons = () => {
    const gumroadButtons = document.querySelectorAll('.gumroad-button, [data-gumroad-single-product]');
    
    let gumroadLoaded = false;
    
    gumroadButtons.forEach(button => {
      // Load Gumroad on first interaction
      button.addEventListener('mouseenter', () => {
        if (!gumroadLoaded) {
          loadGumroad();
          gumroadLoaded = true;
        }
      }, { passive: true, once: true });
      
      button.addEventListener('click', () => {
        if (!gumroadLoaded) {
          loadGumroad();
          gumroadLoaded = true;
        }
        trackGumroadClick(button as HTMLElement);
      }, { passive: true });
    });
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGumroadButtons);
  } else {
    setupGumroadButtons();
  }

  // Listen for successful purchases (Gumroad postMessage events)
  window.addEventListener('message', (event) => {
    if (event.origin === 'https://gumroad.com' && event.data) {
      if (event.data.type === 'gumroad:purchase_complete') {
        const purchaseData = event.data.data;
        
        // Track purchase conversion
        trackPurchase(
          purchaseData.order_id || 'gumroad_' + Date.now(),
          purchaseData.price || CATALYST_PRODUCT.price,
          [{
            ...CATALYST_PRODUCT,
            price: purchaseData.price || CATALYST_PRODUCT.price
          }]
        );
      }
    }
  });
}

/**
 * Make functions available globally for inline scripts
 */
export function exposeGlobalEcommerceFunctions(): void {
  if (typeof window !== 'undefined') {
    window.trackPurchase = trackPurchase;
    window.trackProductView = trackProductView;
    window.trackGumroadClick = trackGumroadClick;
    window.loadGumroad = initializeGumroadTracking;
  }
}