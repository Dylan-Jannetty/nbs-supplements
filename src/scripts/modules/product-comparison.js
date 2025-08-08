/**
 * Product Comparison Module
 * Handles product comparison table/cards with competitor data
 */

class ProductComparison {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.options = {
      currentProduct: {
        name: "Catalyst Pre-Workout",
        price: 30.00,
        features: ["Clinical doses", "Natural ingredients", "Third-party tested", "Pharmacist formulated"],
        rating: 4.8
      },
      ...options
    };

    this.isExpanded = false;
    this.competitors = [
      {
        name: "Brand X Pre-Workout",
        price: 45.99,
        features: ["Artificial flavors", "Proprietary blend", "Synthetic caffeine"],
        rating: 4.2,
        artificial: true,
        clinicalDoses: false
      },
      {
        name: "Brand Y Energy",
        price: 38.99,
        features: ["Underdosed ingredients", "Artificial colors", "Sugar alcohols"],
        rating: 3.8,
        artificial: true,
        clinicalDoses: false
      },
      {
        name: "Brand Z Performance",
        price: 52.99,
        features: ["Hidden ingredients", "Artificial sweeteners", "Synthetic compounds"],
        rating: 4.0,
        artificial: true,
        clinicalDoses: false
      }
    ];

    this.comparisonFeatures = [
      { feature: "Clinical Doses", catalyst: true, description: "All ingredients at research-backed doses" },
      { feature: "Natural Ingredients", catalyst: true, description: "No artificial colors, flavors, or sweeteners" },
      { feature: "Third-Party Tested", catalyst: true, description: "Verified purity and potency" },
      { feature: "Pharmacist Formulated", catalyst: true, description: "Expert pharmaceutical knowledge" },
      { feature: "No Proprietary Blends", catalyst: true, description: "Full transparency of ingredients" },
      { feature: "USA Manufacturing", catalyst: true, description: "FDA-registered facility" },
      { feature: "Money-Back Guarantee", catalyst: true, description: "30-day satisfaction guarantee" }
    ];

    this.init();
  }

  init() {
    if (!this.container) {
      console.warn('ProductComparison: Container not found');
      return;
    }

    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = this.isExpanded ? this.renderExpanded() : this.renderCollapsed();
  }

  renderCollapsed() {
    return `
      <div class="card mb-8">
        <div class="card-content p-6 text-center">
          <h3 class="text-lg font-semibold mb-2">How does Catalyst compare?</h3>
          <p class="text-muted-foreground mb-4">
            See how Catalyst stacks up against other pre-workout supplements
          </p>
          <button 
            class="btn btn-outline hover:bg-nbs-primary hover:text-white" 
            data-toggle-comparison>
            Compare Products
          </button>
        </div>
      </div>
    `;
  }

  renderExpanded() {
    return `
      <div class="card mb-8 overflow-hidden">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <h3 class="card-title text-xl">Product Comparison</h3>
            <button class="btn btn-ghost btn-sm" data-close-comparison>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="card-content">
          <!-- Desktop Table View -->
          <div class="hidden lg:block overflow-x-auto" data-desktop-view>
            ${this.renderDesktopTable()}
          </div>

          <!-- Mobile Card View -->
          <div class="lg:hidden space-y-4" data-mobile-view>
            ${this.renderMobileCards()}
          </div>

          <!-- Summary -->
          <div class="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 class="font-medium text-green-800 dark:text-green-200 mb-1">
                  Why Catalyst Stands Out
                </h4>
                <p class="text-sm text-green-700 dark:text-green-300">
                  Unlike other pre-workouts that hide behind proprietary blends and artificial ingredients, 
                  Catalyst provides full transparency with clinical doses of natural, research-backed ingredients. 
                  Every ingredient serves a purpose, and every dose is optimized for maximum effectiveness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderDesktopTable() {
    return `
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left p-4 font-medium">Feature</th>
            <th class="text-center p-4">
              <div class="flex flex-col items-center">
                <div class="font-bold text-nbs-primary">${this.options.currentProduct.name}</div>
                <div class="badge bg-nbs-primary text-white mt-1">Our Product</div>
              </div>
            </th>
            ${this.competitors.map(competitor => `
              <th class="text-center p-4">
                <div class="font-medium text-muted-foreground">${competitor.name}</div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="p-4 font-medium">Price</td>
            <td class="text-center p-4">
              <span class="text-lg font-bold text-nbs-primary">$${this.options.currentProduct.price}</span>
            </td>
            ${this.competitors.map(competitor => `
              <td class="text-center p-4">
                <span class="text-lg">$${competitor.price}</span>
              </td>
            `).join('')}
          </tr>
          <tr class="border-b">
            <td class="p-4 font-medium">Rating</td>
            <td class="text-center p-4">
              <div class="flex items-center justify-center gap-1">
                <span class="font-bold">${this.options.currentProduct.rating}</span>
                ${this.renderStars(this.options.currentProduct.rating, 'text-nbs-accent')}
              </div>
            </td>
            ${this.competitors.map(competitor => `
              <td class="text-center p-4">
                <div class="flex items-center justify-center gap-1">
                  <span>${competitor.rating}</span>
                  ${this.renderStars(competitor.rating, 'text-yellow-400')}
                </div>
              </td>
            `).join('')}
          </tr>
          ${this.comparisonFeatures.map(feature => `
            <tr class="border-b hover:bg-muted/30 transition-colors">
              <td class="p-4">
                <div>
                  <div class="font-medium">${feature.feature}</div>
                  <div class="text-sm text-muted-foreground">${feature.description}</div>
                </div>
              </td>
              <td class="text-center p-4">
                ${this.renderCheckmark(true)}
              </td>
              ${this.competitors.map(() => `
                <td class="text-center p-4">
                  ${this.renderCheckmark(false)}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderMobileCards() {
    const currentProductCard = `
      <div class="card border-2 border-nbs-primary bg-nbs-primary/5">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <h4 class="card-title text-nbs-primary">${this.options.currentProduct.name}</h4>
            <div class="badge bg-nbs-primary text-white">Our Product</div>
          </div>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Price:</span>
              <span class="font-bold text-nbs-primary">$${this.options.currentProduct.price}</span>
            </div>
            <div class="flex justify-between">
              <span>Rating:</span>
              <span class="font-bold">${this.options.currentProduct.rating}/5</span>
            </div>
            ${this.comparisonFeatures.map(feature => `
              <div class="flex justify-between items-center">
                <span class="text-sm">${feature.feature}:</span>
                ${this.renderCheckmark(true)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const competitorCards = this.competitors.map(competitor => `
      <div class="card opacity-75">
        <div class="card-header">
          <h4 class="card-title text-muted-foreground">${competitor.name}</h4>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Price:</span>
              <span class="font-bold">$${competitor.price}</span>
            </div>
            <div class="flex justify-between">
              <span>Rating:</span>
              <span>${competitor.rating}/5</span>
            </div>
            ${this.comparisonFeatures.map(feature => `
              <div class="flex justify-between items-center">
                <span class="text-sm">${feature.feature}:</span>
                ${this.renderCheckmark(false)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');

    return currentProductCard + competitorCards;
  }

  renderStars(rating, colorClass) {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const isFilled = i < fullStars;
      stars.push(`
        <svg class="w-4 h-4 ${isFilled ? `${colorClass} fill-current` : 'text-muted-foreground'}" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      `);
    }

    return `<div class="flex">${stars.join('')}</div>`;
  }

  renderCheckmark(isPositive) {
    if (isPositive) {
      return `
        <svg class="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      `;
    } else {
      return `
        <svg class="w-6 h-6 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      `;
    }
  }

  attachEvents() {
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('[data-toggle-comparison]')) {
        this.toggleComparison();
      } else if (e.target.closest('[data-close-comparison]')) {
        this.closeComparison();
      }
    });
  }

  toggleComparison() {
    this.isExpanded = !this.isExpanded;
    this.render();

    // Track interaction
    this.trackComparisonToggle();

    // Smooth scroll to comparison if expanding
    if (this.isExpanded) {
      setTimeout(() => {
        this.container.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }

    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('comparisonToggled', {
      detail: { expanded: this.isExpanded },
      bubbles: true
    }));
  }

  closeComparison() {
    this.isExpanded = false;
    this.render();

    this.trackComparisonToggle();

    this.container.dispatchEvent(new CustomEvent('comparisonClosed', {
      bubbles: true
    }));
  }

  trackComparisonToggle() {
    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'comparison_toggled', {
        action: this.isExpanded ? 'expanded' : 'collapsed'
      });
    }

    // Custom analytics
    if (typeof window !== 'undefined' && window.ProductEnhancements?.analytics) {
      window.ProductEnhancements.analytics.track('comparison_interaction', {
        action: this.isExpanded ? 'expand' : 'collapse'
      });
    }
  }

  // Public API
  expand() {
    if (!this.isExpanded) {
      this.toggleComparison();
    }
  }

  collapse() {
    if (this.isExpanded) {
      this.toggleComparison();
    }
  }

  isOpen() {
    return this.isExpanded;
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Export as ES6 module
export { ProductComparison };