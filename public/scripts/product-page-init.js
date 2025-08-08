/**
 * Product Page Initialization Script  
 * Lightweight initialization without ES6 module dependencies
 */

(function () {
  'use strict';

  // Configuration from global window object
  const config = window.PRODUCT_PAGE_CONFIG || {
    product: {
      name: 'Catalyst Pre-Workout',
      price: 30.00,
      gumroadUrl: 'https://gumroad.com/l/nbs-catalyst'
    },
    ingredients: []
  };

  // Simple analytics tracker
  function trackEvent(eventName, data = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, data);
    }
    console.log(`📊 Event: ${eventName}`, data);
  }

  // Enhanced quantity selector functionality
  function initQuantitySelector() {
    const container = document.getElementById('quantity-selector');
    if (!container) return;

    let selectedQuantity = 1;
    const pricingTiers = [
      { quantity: 1, price: config.product.price, savings: 0 },
      { quantity: 2, price: config.product.price * 1.85, savings: config.product.price * 0.15 },
      { quantity: 3, price: config.product.price * 2.7, savings: config.product.price * 0.3 },
      { quantity: 6, price: config.product.price * 5.1, savings: config.product.price * 0.9 }
    ];

    // Add click handlers to quantity cards
    container.addEventListener('click', function (e) {
      const quantityCard = e.target.closest('[data-quantity]');
      if (!quantityCard) return;

      const quantity = parseInt(quantityCard.dataset.quantity);
      const tier = pricingTiers.find(t => t.quantity === quantity);
      if (!tier) return;

      selectedQuantity = quantity;

      // Update visual selection
      container.querySelectorAll('[data-quantity]').forEach(card => {
        card.classList.remove('ring-2', 'ring-nbs-primary', 'bg-nbs-primary/5');
        card.classList.add('hover:ring-1', 'hover:ring-nbs-primary/50');
      });

      quantityCard.classList.add('ring-2', 'ring-nbs-primary', 'bg-nbs-primary/5');
      quantityCard.classList.remove('hover:ring-1', 'hover:ring-nbs-primary/50');

      // Update summary
      updateQuantitySummary(tier);

      // Track selection
      trackEvent('quantity_selected', {
        quantity: quantity,
        total_price: tier.price,
        savings: tier.savings
      });
    });

    function updateQuantitySummary(tier) {
      const summaryCard = container.querySelector('.card.bg-gradient-to-r');
      if (!summaryCard) return;

      const titleEl = summaryCard.querySelector('.font-semibold');
      const descEl = summaryCard.querySelector('.text-muted-foreground');
      const priceEl = summaryCard.querySelector('.text-nbs-primary');

      if (titleEl) {
        titleEl.textContent = `${tier.quantity} ${tier.quantity === 1 ? 'Container' : 'Containers'} Selected`;
      }
      if (descEl) {
        const months = Math.floor(tier.quantity * 30 / 30);
        const timeDesc = tier.quantity === 1 ? '30 days' : `${months} month${months > 1 ? 's' : ''}`;
        descEl.textContent = `${timeDesc} of premium pre-workout`;
      }
      if (priceEl) {
        priceEl.textContent = `$${tier.price.toFixed(2)}`;
      }

      // Add savings display if not present
      let savingsEl = summaryCard.querySelector('.text-green-600');
      if (tier.savings > 0) {
        if (!savingsEl) {
          savingsEl = document.createElement('div');
          savingsEl.className = 'text-sm text-green-600 font-medium';
          priceEl.parentNode.appendChild(savingsEl);
        }
        savingsEl.textContent = `You save $${tier.savings.toFixed(2)}!`;
        savingsEl.style.display = '';
      } else if (savingsEl) {
        savingsEl.style.display = 'none';
      }
    }
  }

  // Enhanced product comparison functionality
  function initProductComparison() {
    const container = document.getElementById('product-comparison');
    if (!container) return;

    const toggleButton = container.querySelector('[data-toggle-comparison]');
    if (!toggleButton) return;

    toggleButton.addEventListener('click', function () {
      // For now, just track the interaction
      trackEvent('comparison_requested', {
        product: config.product.name
      });

      // Could expand with full comparison table here
      alert('Product comparison feature coming soon!');
    });
  }

  // Enhanced purchase button functionality
  function initPurchaseButtons() {
    document.querySelectorAll('.purchase-button').forEach(button => {
      let hoverCount = 0;
      let clickCount = 0;

      button.addEventListener('mouseenter', function () {
        hoverCount++;
        trackEvent('purchase_intent_hover', { count: hoverCount });
      });

      button.addEventListener('click', function (e) {
        clickCount++;
        trackEvent('purchase_intent_click', { count: clickCount });

        // Add loading state
        const originalText = button.textContent;
        button.disabled = true;
        button.innerHTML = `
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Loading...
          </div>
        `;

        // Restore after short delay
        setTimeout(() => {
          button.disabled = false;
          button.textContent = originalText;

          // Open purchase link
          window.open(config.product.gumroadUrl, '_blank');
        }, 800);

        e.preventDefault();
      });
    });
  }

  // Simple scroll progress indicator
  function initScrollProgress() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) {
      const progressContainer = document.createElement('div');
      progressContainer.className = 'fixed top-0 left-0 w-full h-1 z-50 bg-background/80 backdrop-blur-sm';
      progressContainer.innerHTML = '<div class="scroll-progress-bar h-full bg-gradient-to-r from-nbs-primary to-nbs-secondary transition-all duration-300 ease-out" style="width: 0%"></div>';
      document.body.appendChild(progressContainer);
      progressBar = progressContainer.querySelector('.scroll-progress-bar');
    }

    // Update progress on scroll
    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(100, (scrollTop / docHeight) * 100);

      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }
    }, { passive: true });
  }

  // Simple sticky purchase button
  function initStickyButton() {
    // Create sticky button if it doesn't exist
    let stickyButton = document.querySelector('.sticky-purchase-button');
    if (!stickyButton) {
      stickyButton = document.createElement('div');
      stickyButton.className = 'sticky-purchase-button fixed bottom-4 right-4 z-40 transition-all duration-500 ease-out translate-y-16 opacity-0';
      stickyButton.innerHTML = `
        <div class="card shadow-2xl border-2 border-nbs-primary/20 bg-background/95 backdrop-blur-sm">
          <div class="card-content p-4">
            <div class="flex items-center gap-3">
              <img src="/images/catalyst-front-thumb.jpg" alt="Catalyst" class="w-12 h-12 rounded object-cover" />
              <div>
                <p class="font-semibold text-sm">${config.product.name}</p>
                <p class="text-2xl font-bold text-nbs-primary">$${config.product.price}</p>
              </div>
              <button class="btn btn-primary btn-lg bg-nbs-primary hover:bg-nbs-primary/90 text-white purchase-button">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(stickyButton);
    }

    // Show/hide based on scroll position
    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset;
      const shouldShow = scrollTop > 800;

      if (shouldShow) {
        stickyButton.classList.remove('translate-y-16', 'opacity-0');
        stickyButton.classList.add('translate-y-0', 'opacity-100');
      } else {
        stickyButton.classList.add('translate-y-16', 'opacity-0');
        stickyButton.classList.remove('translate-y-0', 'opacity-100');
      }
    }, { passive: true });

    // Add purchase functionality to sticky button
    const stickyPurchaseBtn = stickyButton.querySelector('.purchase-button');
    if (stickyPurchaseBtn) {
      stickyPurchaseBtn.addEventListener('click', function () {
        trackEvent('sticky_purchase_click', { product: config.product.name });
        window.open(config.product.gumroadUrl, '_blank');
      });
    }
  }

  // Wishlist functionality
  function initWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist-button');

    wishlistButtons.forEach(button => {
      const productName = button.dataset.product || config.product.name;

      // Load saved state
      let wishlist = [];
      try {
        wishlist = JSON.parse(localStorage.getItem('nbs_wishlist') || '[]');
      } catch (e) {
        console.warn('Could not load wishlist from localStorage');
      }

      const isInWishlist = wishlist.some(item => item.name === productName);
      updateWishlistButton(button, isInWishlist);

      button.addEventListener('click', function () {
        const currentlyInWishlist = button.classList.contains('active');
        const newState = !currentlyInWishlist;

        updateWishlistButton(button, newState);

        // Update localStorage
        try {
          if (newState) {
            wishlist.push({
              name: productName,
              price: config.product.price,
              addedAt: Date.now()
            });
          } else {
            wishlist = wishlist.filter(item => item.name !== productName);
          }
          localStorage.setItem('nbs_wishlist', JSON.stringify(wishlist));
        } catch (e) {
          console.warn('Could not save to localStorage');
        }

        trackEvent('wishlist_toggle', {
          product: productName,
          action: newState ? 'added' : 'removed'
        });
      });
    });

    function updateWishlistButton(button, isInWishlist) {
      const textEl = button.querySelector('.wishlist-text');
      const heartEl = button.querySelector('.wishlist-heart');

      if (isInWishlist) {
        button.classList.add('active');
        if (textEl) textEl.textContent = 'In Wishlist';
        if (heartEl) heartEl.classList.add('filled');
      } else {
        button.classList.remove('active');
        if (textEl) textEl.textContent = 'Add to Wishlist';
        if (heartEl) heartEl.classList.remove('filled');
      }
    }
  }

  // Enhanced animation observer with debugging
  function initAnimations() {
    const observeElements = document.querySelectorAll('[data-observe]');
    console.log(`🎭 Animation system: Found ${observeElements.length} elements with [data-observe]`);

    if (observeElements.length === 0) {
      console.warn('⚠️  No elements found with [data-observe] attribute');
      return;
    }

    // Add animate-in class to observed elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const elementInfo = `${element.tagName}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.split(' ').join('.') : ''}`;

          console.log(`👁️  Element in view: ${elementInfo}`);

          setTimeout(() => {
            element.classList.add('animate-in');
            console.log(`✨ Added animate-in class to: ${elementInfo}`);

            // Verify the element is actually visible after animation
            setTimeout(() => {
              const computedStyle = window.getComputedStyle(element);
              const opacity = computedStyle.opacity;
              const transform = computedStyle.transform;

              if (opacity === '0') {
                console.error(`❌ Animation failed - element still has opacity: 0`, {
                  element: elementInfo,
                  opacity,
                  transform,
                  hasAnimateClass: element.classList.contains('animate-in')
                });
              } else {
                console.log(`✅ Animation success: ${elementInfo} is now visible (opacity: ${opacity})`);
              }
            }, 650); // Wait for 0.6s transition + small buffer

          }, index * 100);

          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    });

    // Observe all elements and log initial state
    observeElements.forEach((el, index) => {
      const computedStyle = window.getComputedStyle(el);
      const opacity = computedStyle.opacity;
      const transform = computedStyle.transform;

      console.log(`🎯 Observing element ${index + 1}:`, {
        element: `${el.tagName}${el.id ? '#' + el.id : ''}`,
        initialOpacity: opacity,
        initialTransform: transform
      });

      observer.observe(el);
    });

    // Fallback: If any elements are still invisible after 5 seconds, force them visible
    setTimeout(() => {
      const invisibleElements = Array.from(observeElements).filter(el => {
        const style = window.getComputedStyle(el);
        return style.opacity === '0';
      });

      if (invisibleElements.length > 0) {
        console.warn(`⚡ Fallback: Force-showing ${invisibleElements.length} invisible elements`);
        invisibleElements.forEach(el => {
          el.classList.add('animate-in');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      }
    }, 5000);
  }

  // Initialize all features when DOM is ready
  function init() {
    console.log('🚀 Initializing enhanced product page features...');

    try {
      initQuantitySelector();
      initProductComparison();
      initPurchaseButtons();
      initScrollProgress();
      initStickyButton();
      initWishlist();
      initAnimations();

      // Track page initialization
      trackEvent('product_page_initialized', {
        product: config.product.name,
        price: config.product.price,
        timestamp: Date.now()
      });

      console.log('✅ Product page features initialized successfully');

    } catch (error) {
      console.error('❌ Error initializing product page features:', error);

      // Ensure basic purchase buttons still work
      document.querySelectorAll('.purchase-button').forEach(button => {
        button.addEventListener('click', () => {
          window.open(config.product.gumroadUrl, '_blank');
        });
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Make some functions globally available for debugging
  if (typeof window !== 'undefined') {
    window.ProductPageEnhancements = {
      config,
      trackEvent,
      init
    };
  }

})();