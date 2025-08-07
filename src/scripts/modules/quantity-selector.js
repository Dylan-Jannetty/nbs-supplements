/**
 * Quantity Selector Module
 * Handles bulk pricing, quantity selection, and purchase options
 */

class QuantitySelector {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.options = {
      basePrice: 39.99,
      gumroadUrl: 'https://gumroad.com/l/nbs-catalyst',
      onQuantityChange: () => {},
      ...options
    };
    
    this.selectedQuantity = 1;
    this.pricingTiers = [
      {
        quantity: 1,
        price: this.options.basePrice,
        savings: 0,
      },
      {
        quantity: 2,
        price: this.options.basePrice * 1.85, // 7.5% discount
        savings: this.options.basePrice * 0.15,
        badge: "Save 7.5%"
      },
      {
        quantity: 3,
        price: this.options.basePrice * 2.7, // 10% discount
        savings: this.options.basePrice * 0.3,
        popular: true,
        badge: "Most Popular"
      },
      {
        quantity: 6,
        price: this.options.basePrice * 5.1, // 15% discount
        savings: this.options.basePrice * 0.9,
        badge: "Best Value"
      }
    ];
    
    this.init();
  }

  init() {
    if (!this.container) {
      console.warn('QuantitySelector: Container not found');
      return;
    }
    
    this.render();
    this.attachEvents();
    this.updateSelection(1); // Default to 1 container
  }

  render() {
    this.container.innerHTML = `
      <div class="quantity-selector space-y-4">
        <div class="text-center mb-4">
          <h3 class="text-lg font-semibold mb-2">Choose Your Supply</h3>
          <p class="text-sm text-muted-foreground">
            Larger quantities save you more money and ensure you never run out
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" data-quantity-options>
          ${this.pricingTiers.map(tier => this.renderTierCard(tier)).join('')}
        </div>

        <div class="quantity-summary" data-quantity-summary>
          ${this.renderSummaryCard()}
        </div>

        <div class="bulk-benefits" data-bulk-benefits style="display: none;">
          ${this.renderBulkBenefits()}
        </div>

        <div class="shipping-info text-center text-sm text-muted-foreground space-y-1">
          <div class="flex items-center justify-center gap-4">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span>Free shipping over $50</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>30-day guarantee</span>
            </div>
          </div>
          <div class="text-xs">
            Secure checkout powered by Gumroad • Ships within 1-2 business days
          </div>
        </div>
      </div>
    `;
  }

  renderTierCard(tier) {
    const isSelected = this.selectedQuantity === tier.quantity;
    const popularClass = tier.popular ? 'scale-105 relative' : '';
    const selectedClass = isSelected ? 'ring-2 ring-nbs-primary bg-nbs-primary/5' : 'hover:ring-1 hover:ring-nbs-primary/50';
    
    return `
      <div class="card cursor-pointer transition-all duration-200 hover:shadow-md ${selectedClass} ${popularClass}" 
           data-quantity="${tier.quantity}">
        ${tier.popular ? `
          <div class="absolute -top-2 left-1/2 -translate-x-1/2">
            <div class="badge bg-nbs-accent text-white px-3 py-1">Most Popular</div>
          </div>
        ` : ''}
        
        <div class="card-content p-4 text-center">
          <div class="mb-2">
            <div class="text-2xl font-bold">${tier.quantity}</div>
            <div class="text-sm text-muted-foreground">
              ${tier.quantity === 1 ? 'Container' : 'Containers'}
            </div>
          </div>

          <div class="mb-3">
            <div class="text-lg font-semibold text-nbs-primary">
              $${tier.price.toFixed(2)}
            </div>
            ${tier.savings > 0 ? `
              <div class="text-sm text-green-600 font-medium">
                Save $${tier.savings.toFixed(2)}
              </div>
            ` : ''}
            <div class="text-xs text-muted-foreground">
              $${(tier.price / tier.quantity).toFixed(2)} each
            </div>
          </div>

          <div class="space-y-1 text-xs text-muted-foreground">
            <div>${this.getSupplyDuration(tier.quantity)} supply</div>
            ${tier.badge && tier.badge !== "Most Popular" ? `
              <div class="badge badge-secondary text-xs">${tier.badge}</div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  renderSummaryCard() {
    const currentTier = this.getCurrentTier();
    return `
      <div class="card bg-gradient-to-r from-nbs-primary/5 to-nbs-secondary/5">
        <div class="card-content p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold" data-summary-title>
                ${this.selectedQuantity} ${this.selectedQuantity === 1 ? 'Container' : 'Containers'} Selected
              </div>
              <div class="text-sm text-muted-foreground" data-summary-description>
                ${this.getSupplyDuration(this.selectedQuantity)} of premium pre-workout
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-nbs-primary" data-summary-price>
                $${currentTier.price.toFixed(2)}
              </div>
              <div class="text-sm text-green-600 font-medium" data-summary-savings style="${currentTier.savings > 0 ? '' : 'display: none;'}">
                You save $${currentTier.savings.toFixed(2)}!
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderBulkBenefits() {
    return `
      <div class="card border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800">
        <div class="card-content p-4">
          <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Bulk Purchase Benefits
          </h4>
          <ul class="text-sm text-green-700 dark:text-green-300 space-y-1" data-benefits-list>
            <li>• Never run out of your pre-workout</li>
            <li>• Lock in current pricing</li>
            <li>• Free shipping (orders over $50)</li>
          </ul>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Handle quantity selection clicks
    this.container.addEventListener('click', (e) => {
      const quantityCard = e.target.closest('[data-quantity]');
      if (quantityCard) {
        const quantity = parseInt(quantityCard.dataset.quantity);
        this.updateSelection(quantity);
      }
    });
  }

  updateSelection(quantity) {
    this.selectedQuantity = quantity;
    const currentTier = this.getCurrentTier();
    
    // Update visual selection
    this.updateVisualSelection();
    
    // Update summary
    this.updateSummary();
    
    // Show/hide bulk benefits
    this.updateBulkBenefits();
    
    // Track selection
    this.trackQuantitySelection(quantity, currentTier);
    
    // Notify callback
    this.options.onQuantityChange(quantity, currentTier.price, currentTier.savings);
    
    // Dispatch custom event
    this.container.dispatchEvent(new CustomEvent('quantityChanged', {
      detail: { quantity, tier: currentTier },
      bubbles: true
    }));
  }

  updateVisualSelection() {
    // Remove selection from all cards
    this.container.querySelectorAll('[data-quantity]').forEach(card => {
      card.classList.remove('ring-2', 'ring-nbs-primary', 'bg-nbs-primary/5');
      card.classList.add('hover:ring-1', 'hover:ring-nbs-primary/50');
    });
    
    // Add selection to current card
    const selectedCard = this.container.querySelector(`[data-quantity="${this.selectedQuantity}"]`);
    if (selectedCard) {
      selectedCard.classList.add('ring-2', 'ring-nbs-primary', 'bg-nbs-primary/5');
      selectedCard.classList.remove('hover:ring-1', 'hover:ring-nbs-primary/50');
    }
  }

  updateSummary() {
    const currentTier = this.getCurrentTier();
    
    // Update summary text
    const titleEl = this.container.querySelector('[data-summary-title]');
    const descriptionEl = this.container.querySelector('[data-summary-description]');
    const priceEl = this.container.querySelector('[data-summary-price]');
    const savingsEl = this.container.querySelector('[data-summary-savings]');
    
    if (titleEl) {
      titleEl.textContent = `${this.selectedQuantity} ${this.selectedQuantity === 1 ? 'Container' : 'Containers'} Selected`;
    }
    
    if (descriptionEl) {
      descriptionEl.textContent = `${this.getSupplyDuration(this.selectedQuantity)} of premium pre-workout`;
    }
    
    if (priceEl) {
      priceEl.textContent = `$${currentTier.price.toFixed(2)}`;
    }
    
    if (savingsEl) {
      if (currentTier.savings > 0) {
        savingsEl.textContent = `You save $${currentTier.savings.toFixed(2)}!`;
        savingsEl.style.display = '';
      } else {
        savingsEl.style.display = 'none';
      }
    }
  }

  updateBulkBenefits() {
    const bulkBenefits = this.container.querySelector('[data-bulk-benefits]');
    if (!bulkBenefits) return;
    
    if (this.selectedQuantity > 1) {
      bulkBenefits.style.display = '';
      
      // Update benefits list based on quantity
      const benefitsList = bulkBenefits.querySelector('[data-benefits-list]');
      if (benefitsList) {
        let benefits = [
          '• Never run out of your pre-workout',
          '• Lock in current pricing',
          '• Free shipping (orders over $50)'
        ];
        
        if (this.selectedQuantity >= 3) {
          benefits.push('• Priority customer support');
        }
        
        if (this.selectedQuantity >= 6) {
          benefits.push('• Early access to new products');
        }
        
        benefitsList.innerHTML = benefits.map(benefit => `<li>${benefit}</li>`).join('');
      }
    } else {
      bulkBenefits.style.display = 'none';
    }
  }

  getCurrentTier() {
    return this.pricingTiers.find(tier => tier.quantity === this.selectedQuantity) || this.pricingTiers[0];
  }

  getSupplyDuration(quantity) {
    const daysPerContainer = 30;
    const totalDays = quantity * daysPerContainer;
    if (totalDays < 60) {
      return `${totalDays} days`;
    } else {
      const months = Math.floor(totalDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  }

  trackQuantitySelection(quantity, tier) {
    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quantity_selected', {
        quantity: quantity,
        total_price: tier.price,
        savings: tier.savings
      });
    }
    
    // Custom analytics
    if (typeof window !== 'undefined' && window.ProductEnhancements?.analytics) {
      window.ProductEnhancements.analytics.track('quantity_selected', {
        quantity,
        price: tier.price,
        savings: tier.savings
      });
    }
  }

  // Public API
  getSelectedQuantity() {
    return this.selectedQuantity;
  }

  getSelectedTier() {
    return this.getCurrentTier();
  }

  setQuantity(quantity) {
    if (this.pricingTiers.some(tier => tier.quantity === quantity)) {
      this.updateSelection(quantity);
    }
  }

  destroy() {
    // Clean up event listeners and DOM
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Export as ES6 module
export { QuantitySelector };