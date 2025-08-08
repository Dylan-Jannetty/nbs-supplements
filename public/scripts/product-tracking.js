/**
 * Product Page Analytics Client-Side Script
 * Handles product view tracking, purchase events, ingredient interactions, and more
 */

// Product view tracking - exposed globally
window.trackProductView = function (productData = {}) {
  const defaultData = {
    currency: 'USD',
    value: 30.00,
    items: [{
      item_id: 'catalyst-preworkout',
      item_name: 'Catalyst Pre-Workout',
      category: 'Supplements',
      price: 30.00,
      quantity: 1
    }]
  };

  const eventData = { ...defaultData, ...productData };

  if (typeof gtag !== 'undefined') {
    gtag('event', 'view_item', eventData);
  } else if (window.location.hostname === 'localhost') {
    console.log('Product view tracked (gtag not available):', eventData);
  }
};

// Purchase intent tracking
window.trackAddToCart = function (productData = {}) {
  const defaultData = {
    currency: 'USD',
    value: 30.00,
    items: [{
      item_id: 'catalyst-preworkout',
      item_name: 'Catalyst Pre-Workout',
      category: 'Supplements',
      price: 30.00,
      quantity: 1
    }]
  };

  const eventData = { ...defaultData, ...productData };

  if (typeof gtag !== 'undefined') {
    gtag('event', 'add_to_cart', eventData);
  }
};

// Begin checkout tracking
window.trackBeginCheckout = function (productData = {}) {
  const defaultData = {
    currency: 'USD',
    value: 30.00,
    items: [{
      item_id: 'catalyst-preworkout',
      item_name: 'Catalyst Pre-Workout',
      category: 'Supplements',
      price: 30.00,
      quantity: 1
    }]
  };

  const eventData = { ...defaultData, ...productData };

  if (typeof gtag !== 'undefined') {
    gtag('event', 'begin_checkout', eventData);
  }
};

// Purchase button click tracking
window.trackPurchaseButtonClick = function (buttonText, quantity = 1, price = 30.00) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'purchase_intent', {
      content_type: 'product',
      content_id: 'catalyst-preworkout',
      button_text: buttonText,
      quantity: quantity,
      value: price,
      currency: 'USD',
      engagement_time_msec: Date.now() - performance.timeOrigin
    });
  }
};

// Ingredient interaction tracking
window.trackIngredientInteraction = function (ingredientName, action = 'click') {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'ingredient_interaction', {
      content_type: 'product_ingredient',
      ingredient_name: ingredientName,
      action: action,
      product_id: 'catalyst-preworkout'
    });
  }
};

// Product image interaction tracking
window.trackImageInteraction = function (imageIndex, imageSrc, action = 'view') {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'product_image_interaction', {
      content_type: 'product_image',
      image_index: imageIndex,
      image_src: imageSrc,
      action: action,
      product_id: 'catalyst-preworkout'
    });
  }
};

// Quantity selection tracking
window.trackQuantitySelection = function (quantity, pricePerUnit, totalPrice) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'quantity_selected', {
      content_type: 'product_quantity',
      quantity: quantity,
      price_per_unit: pricePerUnit,
      total_price: totalPrice,
      product_id: 'catalyst-preworkout'
    });
  }
};

// Review form tracking
window.trackReviewSubmission = function (rating, hasText = false) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'review_submission', {
      content_type: 'product_review',
      rating: rating,
      has_text: hasText,
      product_id: 'catalyst-preworkout'
    });
  }
};

// FAQ interaction tracking
window.trackProductFAQ = function (question, action = 'expand') {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'product_faq_interaction', {
      content_type: 'product_faq',
      faq_question: question,
      action: action,
      product_id: 'catalyst-preworkout'
    });
  }
};

// Product comparison tracking
window.trackProductComparison = function (action = 'toggle') {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'product_comparison', {
      content_type: 'product_comparison',
      action: action,
      product_id: 'catalyst-preworkout'
    });
  }
};

// Wishlist tracking
window.trackWishlistAction = function (action = 'add', productName = 'Catalyst Pre-Workout') {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'wishlist_action', {
      content_type: 'product',
      product_name: productName,
      action: action,
      product_id: 'catalyst-preworkout'
    });
  }
};

// Initialize product page tracking on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  // Track initial product view
  if (typeof window.trackProductView === 'function') {
    window.trackProductView();
  }

  // Track purchase button clicks
  const purchaseButtons = document.querySelectorAll('.purchase-button, button[onclick*="gumroad"]');
  purchaseButtons.forEach(button => {
    button.addEventListener('click', function () {
      const buttonText = this.textContent.trim();
      const quantityMatch = buttonText.match(/(\d+)/);
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;

      if (typeof window.trackPurchaseButtonClick === 'function') {
        window.trackPurchaseButtonClick(buttonText, quantity);
      }

      if (typeof window.trackAddToCart === 'function') {
        window.trackAddToCart();
      }
    });
  });

  // Track ingredient card interactions
  const ingredientCards = document.querySelectorAll('.ingredient-card, [data-ingredient]');
  ingredientCards.forEach(card => {
    card.addEventListener('click', function () {
      const ingredientName = this.dataset.ingredient ||
        this.querySelector('h4')?.textContent?.trim() ||
        'Unknown Ingredient';

      if (typeof window.trackIngredientInteraction === 'function') {
        window.trackIngredientInteraction(ingredientName, 'expand');
      }
    });
  });

  // Track quantity selector interactions
  const quantityCards = document.querySelectorAll('[data-quantity]');
  quantityCards.forEach(card => {
    card.addEventListener('click', function () {
      const quantity = parseInt(this.dataset.quantity) || 1;
      const priceElement = this.querySelector('.text-lg.font-semibold');
      const priceMatch = priceElement?.textContent.match(/\$([\d.]+)/);
      const totalPrice = priceMatch ? parseFloat(priceMatch[1]) : 30.00;
      const pricePerUnit = totalPrice / quantity;

      if (typeof window.trackQuantitySelection === 'function') {
        window.trackQuantitySelection(quantity, pricePerUnit, totalPrice);
      }
    });
  });

  // Track product image gallery interactions
  const imageGallery = document.querySelector('[data-product-gallery]');
  if (imageGallery) {
    imageGallery.addEventListener('click', function (e) {
      const imageElement = e.target.closest('img');
      if (imageElement) {
        const imageIndex = Array.from(this.querySelectorAll('img')).indexOf(imageElement);
        const imageSrc = imageElement.src;

        if (typeof window.trackImageInteraction === 'function') {
          window.trackImageInteraction(imageIndex, imageSrc, 'click');
        }
      }
    });
  }

  // Track review form submissions
  const reviewForm = document.querySelector('form[name="catalyst-review"]');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function () {
      const ratingInput = this.querySelector('input[name="rating"]:checked');
      const reviewText = this.querySelector('textarea[name="review"]');
      const rating = ratingInput ? parseInt(ratingInput.value) : 0;
      const hasText = reviewText && reviewText.value.trim().length > 0;

      if (typeof window.trackReviewSubmission === 'function') {
        window.trackReviewSubmission(rating, hasText);
      }
    });
  }

  // Track FAQ interactions
  const faqDetails = document.querySelectorAll('#faq details');
  faqDetails.forEach(details => {
    details.addEventListener('toggle', function () {
      const question = this.querySelector('h3')?.textContent?.trim() || 'Unknown Question';
      const action = this.open ? 'expand' : 'collapse';

      if (typeof window.trackProductFAQ === 'function') {
        window.trackProductFAQ(question, action);
      }
    });
  });

  // Track product comparison interactions
  const comparisonToggle = document.querySelector('[data-toggle-comparison]');
  if (comparisonToggle) {
    comparisonToggle.addEventListener('click', function () {
      if (typeof window.trackProductComparison === 'function') {
        window.trackProductComparison('toggle');
      }
    });
  }

  // Track wishlist interactions
  const wishlistButtons = document.querySelectorAll('.wishlist-button');
  wishlistButtons.forEach(button => {
    button.addEventListener('click', function () {
      const productName = this.dataset.product || 'Catalyst Pre-Workout';
      const isActive = this.classList.contains('active');
      const action = isActive ? 'remove' : 'add';

      if (typeof window.trackWishlistAction === 'function') {
        window.trackWishlistAction(action, productName);
      }

      // Toggle visual state
      this.classList.toggle('active');
      const heartIcon = this.querySelector('.wishlist-heart');
      const buttonText = this.querySelector('.wishlist-text');

      if (heartIcon && buttonText) {
        if (this.classList.contains('active')) {
          heartIcon.style.fill = 'currentColor';
          buttonText.textContent = 'Remove from Wishlist';
        } else {
          heartIcon.style.fill = 'none';
          buttonText.textContent = 'Add to Wishlist';
        }
      }
    });
  });

  // Track scroll-based product sections
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id || 'unknown_section';

        if (typeof gtag !== 'undefined') {
          gtag('event', 'product_section_view', {
            content_type: 'product_section',
            section_id: sectionId,
            product_id: 'catalyst-preworkout'
          });
        }
      }
    });
  }, observerOptions);

  // Observe key product sections
  const productSections = document.querySelectorAll('[data-observe]');
  productSections.forEach(section => sectionObserver.observe(section));
});