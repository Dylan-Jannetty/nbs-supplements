/**
 * Enhanced Product Features Module
 * Handles sticky buttons, progress tracking, social proof, animations, and interactive elements
 */

class EnhancedProductFeatures {
  constructor(options = {}) {
    this.options = {
      product: {
        name: 'Catalyst Pre-Workout',
        price: 30.00,
        gumroadUrl: 'https://gumroad.com/l/nbs-catalyst'
      },
      ingredients: [],
      ...options
    };

    this.state = {
      scrollProgress: 0,
      showStickyButton: false,
      showExitIntent: false,
      isLoading: false,
      wishlistAdded: false,
      purchaseMetrics: {
        buttonHovers: 0,
        buttonClicks: 0,
        scrollDepth: 0,
        timeOnPage: 0,
        exitIntentTriggered: false
      }
    };

    this.elements = {};
    this.observers = [];
    this.eventListeners = [];
    this.timers = [];
    this.pageStartTime = Date.now();

    this.init();
  }

  init() {
    this.createElements();
    this.setupScrollTracking();
    this.setupPurchaseTracking();
    this.setupExitIntent();
    this.setupSocialProof();
    this.setupAnimations();
    this.setupWishlist();
    this.startTimeTracking();
  }

  createElements() {
    // Create progress indicator
    this.createProgressIndicator();

    // Create sticky purchase button
    this.createStickyButton();

    // Create social proof notifications
    this.createSocialProofContainer();

    // Create navigation dots
    this.createNavigationDots();

    // Enhance ingredient cards
    this.enhanceIngredientCards();
  }

  createProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 w-full h-1 z-50 bg-background/80 backdrop-blur-sm';
    progressBar.innerHTML = `
      <div class="h-full bg-gradient-to-r from-nbs-primary to-nbs-secondary transition-all duration-300 ease-out" 
           style="width: 0%" data-progress-bar></div>
    `;

    document.body.appendChild(progressBar);
    this.elements.progressIndicator = progressBar;
    this.elements.progressBar = progressBar.querySelector('[data-progress-bar]');
  }

  createStickyButton() {
    const stickyButton = document.createElement('div');
    stickyButton.className = 'fixed bottom-4 right-4 z-40 transition-all duration-500 ease-out translate-y-16 opacity-0';
    stickyButton.innerHTML = `
      <div class="card shadow-2xl border-2 border-nbs-primary/20 bg-background/95 backdrop-blur-sm">
        <div class="card-content p-4">
          <div class="flex items-center gap-3">
            <img src="/images/catalyst-front-thumb.jpg" 
                 alt="Catalyst" 
                 class="w-12 h-12 rounded object-cover" />
            <div>
              <p class="font-semibold text-sm">${this.options.product.name}</p>
              <p class="text-2xl font-bold text-nbs-primary">$${this.options.product.price}</p>
            </div>
            <button class="btn btn-primary btn-lg bg-nbs-primary hover:bg-nbs-primary/90 text-white purchase-button"
                    data-sticky-purchase>
              <span class="purchase-text">Buy Now</span>
              <span class="loading-spinner hidden">
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Loading...
              </span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(stickyButton);
    this.elements.stickyButton = stickyButton;
  }

  createSocialProofContainer() {
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
          <div class="text-sm font-medium" data-purchase-name></div>
          <div class="text-xs text-gray-500" data-purchase-details></div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    this.elements.socialProof = container;

    this.recentPurchases = [
      { name: "Jessica M.", time: "2 minutes ago", location: "California" },
      { name: "Ryan K.", time: "8 minutes ago", location: "Texas" },
      { name: "Maria S.", time: "15 minutes ago", location: "New York" },
      { name: "David L.", time: "22 minutes ago", location: "Florida" },
      { name: "Sarah P.", time: "35 minutes ago", location: "Colorado" }
    ];
    this.socialProofIndex = 0;
  }


  enhanceIngredientCards() {
    // Find ingredient cards container or create it
    let container = document.getElementById('ingredient-cards-container');
    if (!container) {
      container = document.querySelector('[data-ingredient-cards]');
    }

    if (!container || !this.options.ingredients.length) return;

    // Render interactive ingredient cards
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-observe>
        ${this.options.ingredients.map((ingredient, index) => this.renderIngredientCard(ingredient, index)).join('')}
      </div>
    `;

    this.elements.ingredientCards = container;
  }

  renderIngredientCard(ingredient, index) {
    return `
      <div class="card ingredient-card hover:shadow-lg cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]" 
           style="animation-delay: ${index * 100}ms;" 
           data-ingredient="${ingredient.name}">
        <div class="card-header">
          <div class="flex items-center justify-between mb-2">
            <h4 class="card-title text-lg">${ingredient.name}</h4>
            <div class="badge badge-outline bg-nbs-primary/10 text-nbs-primary border-nbs-primary">
              ${ingredient.dosage}
            </div>
          </div>
          <p class="card-description text-nbs-accent font-medium">
            ${ingredient.purpose}
          </p>
        </div>
        <div class="card-content">
          <p class="text-muted-foreground mb-4">${ingredient.description}</p>
          <div class="space-y-1">
            <h5 class="font-medium text-foreground">Key Benefits:</h5>
            <ul class="text-sm text-muted-foreground space-y-1">
              ${ingredient.benefits.map(benefit => `
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 bg-nbs-secondary rounded-full"></div>
                  ${benefit}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  setupScrollTracking() {
    const scrollHandler = this.throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(100, (scrollTop / docHeight) * 100);

      // Update progress
      this.state.scrollProgress = scrollPercent;
      this.updateProgressBar();

      // Show/hide sticky button
      const shouldShow = scrollTop > 800;
      if (shouldShow !== this.state.showStickyButton) {
        this.state.showStickyButton = shouldShow;
        this.updateStickyButton();
      }

      // Update metrics
      this.state.purchaseMetrics.scrollDepth = Math.max(
        this.state.purchaseMetrics.scrollDepth,
        scrollPercent
      );

      // Update navigation dots
      this.updateNavigationDots();

    }, 16); // 60fps

    window.addEventListener('scroll', scrollHandler, { passive: true });
    this.eventListeners.push({ element: window, event: 'scroll', handler: scrollHandler });
  }

  setupPurchaseTracking() {
    // Track all purchase buttons
    document.addEventListener('mouseenter', (e) => {
      if (e.target.closest('.purchase-button')) {
        this.handlePurchaseIntent('hover');
      }
    }, true);

    document.addEventListener('click', (e) => {
      if (e.target.closest('.purchase-button') || e.target.closest('[data-sticky-purchase]')) {
        this.handlePurchaseIntent('click');
        this.handlePurchase(e.target);
      }
    });
  }

  setupExitIntent() {
    const exitHandler = (e) => {
      if (e.clientY <= 0 && !this.state.purchaseMetrics.exitIntentTriggered) {
        this.showExitIntentModal();
      }
    };

    document.addEventListener('mouseleave', exitHandler);
    this.eventListeners.push({ element: document, event: 'mouseleave', handler: exitHandler });
  }

  setupSocialProof() {
    // Show first notification after 10 seconds
    const timer1 = setTimeout(() => {
      this.showSocialProofNotification();
    }, 10000);

    // Then show every 15 seconds
    const timer2 = setInterval(() => {
      this.showSocialProofNotification();
    }, 15000);

    this.timers.push(timer1, timer2);
  }

  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 100);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with data-observe
    document.querySelectorAll('[data-observe]').forEach(el => {
      observer.observe(el);
    });

    this.observers.push(observer);
  }

  setupWishlist() {
    // Load wishlist state from localStorage
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('nbs_wishlist') || '[]');
      this.state.wishlistAdded = wishlist.some(item => item.name === this.options.product.name);
    }
  }

  startTimeTracking() {
    const timer = setInterval(() => {
      this.state.purchaseMetrics.timeOnPage = Date.now() - this.pageStartTime;
    }, 5000);

    this.timers.push(timer);
  }

  // Update Methods
  updateProgressBar() {
    if (this.elements.progressBar) {
      this.elements.progressBar.style.width = `${this.state.scrollProgress}%`;
    }
  }

  updateStickyButton() {
    if (!this.elements.stickyButton) return;

    if (this.state.showStickyButton) {
      this.elements.stickyButton.classList.remove('translate-y-16', 'opacity-0');
      this.elements.stickyButton.classList.add('translate-y-0', 'opacity-100');
    } else {
      this.elements.stickyButton.classList.add('translate-y-16', 'opacity-0');
      this.elements.stickyButton.classList.remove('translate-y-0', 'opacity-100');
    }
  }

  // Event Handlers
  handlePurchaseIntent(action) {
    if (action === 'hover') {
      this.state.purchaseMetrics.buttonHovers++;
    } else if (action === 'click') {
      this.state.purchaseMetrics.buttonClicks++;
    }

    this.trackEvent('purchase_intent', {
      action,
      count: this.state.purchaseMetrics[action === 'hover' ? 'buttonHovers' : 'buttonClicks']
    });
  }

  async handlePurchase(buttonElement) {
    this.state.isLoading = true;
    this.updatePurchaseButtonState(buttonElement, true);

    // Add ripple effect
    this.addRippleEffect(buttonElement);

    // Simulate brief loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Track purchase attempt
    this.trackEvent('purchase_attempted', {
      product: this.options.product.name,
      price: this.options.product.price,
      metrics: this.state.purchaseMetrics
    });

    // Open Gumroad
    window.open(this.options.product.gumroadUrl, '_blank');

    this.state.isLoading = false;
    this.updatePurchaseButtonState(buttonElement, false);
  }

  updatePurchaseButtonState(button, isLoading) {
    const textEl = button.querySelector('.purchase-text');
    const spinnerEl = button.querySelector('.loading-spinner');

    if (textEl && spinnerEl) {
      if (isLoading) {
        textEl.classList.add('hidden');
        spinnerEl.classList.remove('hidden');
        button.disabled = true;
      } else {
        textEl.classList.remove('hidden');
        spinnerEl.classList.add('hidden');
        button.disabled = false;
      }
    }
  }

  addRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.animation = 'ripple-animation 0.6s linear';
    ripple.style.pointerEvents = 'none';

    // Add CSS keyframes if not already added
    if (!document.head.querySelector('style[data-ripple]')) {
      const style = document.createElement('style');
      style.setAttribute('data-ripple', 'true');
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  showExitIntentModal() {
    this.state.purchaseMetrics.exitIntentTriggered = true;
    this.state.showExitIntent = true;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="card max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-300">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <h3 class="card-title text-xl">Wait! Before you go...</h3>
            <button class="text-muted-foreground hover:text-foreground" data-close-modal>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="card-content">
          <p class="text-muted-foreground mb-4">
            Get 10% off your first order of Catalyst! Use code <span class="font-bold text-nbs-primary">FIRST10</span>
          </p>
          <div class="flex gap-3">
            <button class="btn btn-primary flex-1 bg-nbs-primary hover:bg-nbs-primary/90 purchase-button" 
                    data-discount-purchase>
              Get Discount
            </button>
            <button class="btn btn-outline flex-1" data-close-modal>
              No Thanks
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-modal]') || e.target === modal) {
        modal.remove();
      } else if (e.target.closest('[data-discount-purchase]')) {
        this.handlePurchase(e.target);
        modal.remove();
      }
    });

    this.trackEvent('exit_intent', {
      timeOnPage: Date.now() - this.pageStartTime,
      scrollDepth: this.state.purchaseMetrics.scrollDepth
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) modal.remove();
    }, 10000);
  }

  showSocialProofNotification() {
    const purchase = this.recentPurchases[this.socialProofIndex];
    const nameEl = this.elements.socialProof.querySelector('[data-purchase-name]');
    const detailsEl = this.elements.socialProof.querySelector('[data-purchase-details]');

    if (nameEl && detailsEl) {
      nameEl.textContent = `${purchase.name} purchased Catalyst`;
      detailsEl.textContent = `${purchase.location} • ${purchase.time}`;

      // Show notification
      this.elements.socialProof.style.transform = 'translateX(0)';

      // Hide after 5 seconds
      setTimeout(() => {
        this.elements.socialProof.style.transform = 'translateX(-100%)';
      }, 5000);

      this.socialProofIndex = (this.socialProofIndex + 1) % this.recentPurchases.length;
    }
  }

  smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    this.trackEvent('navigation', { target: elementId, method: 'smooth_scroll' });
  }

  trackEvent(eventName, data) {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, data);
    }

    // Custom analytics
    if (typeof window !== 'undefined' && window.ProductEnhancements?.analytics) {
      window.ProductEnhancements.analytics.track(eventName, data);
    }
  }

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
  getState() {
    return { ...this.state };
  }

  getMetrics() {
    return {
      ...this.state.purchaseMetrics,
      timeOnPage: Date.now() - this.pageStartTime
    };
  }

  showSticky() {
    this.state.showStickyButton = true;
    this.updateStickyButton();
  }

  hideSticky() {
    this.state.showStickyButton = false;
    this.updateStickyButton();
  }

  destroy() {
    // Clear timers
    this.timers.forEach(timer => clearTimeout(timer) || clearInterval(timer));

    // Remove event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());

    // Remove created elements
    Object.values(this.elements).forEach(element => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  }
}

// Export as ES6 module
export { EnhancedProductFeatures };