/**
 * Vanilla JS Product Image Gallery
 * Replaces the React ProductImageGallery component
 */
class ProductImageGallery {
  constructor(container, options = {}) {
    this.container = container;
    this.images = options.images || [];
    this.productName = options.productName || '';
    
    // State
    this.currentImageIndex = 0;
    this.isZoomed = false;
    this.scale = 1;
    this.zoomPosition = { x: 50, y: 50 };
    this.loadedImages = new Set([0]);
    this.isLoading = true;
    
    // Touch handling
    this.touchStart = null;
    this.touchEnd = null;
    this.minSwipeDistance = 50;
    
    // Elements
    this.mainImage = null;
    this.thumbnails = [];
    this.loadingSpinner = null;
    
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
    this.preloadImages();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="space-y-4">
        <!-- Main Image Display -->
        <div class="relative group bg-muted rounded-lg overflow-hidden aspect-square">
          <!-- Loading Spinner -->
          <div class="loading-spinner absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-nbs-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <!-- Main Image -->
          <img 
            class="main-image w-full h-full object-contain transition-all duration-300 cursor-zoom-in opacity-0"
            src="${this.images[0]?.src || ''}"
            alt="${this.images[0]?.alt || ''}"
            loading="eager"
          />
          
          <!-- Navigation Arrows -->
          ${this.images.length > 1 ? `
            <button class="nav-btn nav-prev absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button class="nav-btn nav-next absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          ` : ''}
          
          <!-- Zoom Indicator -->
          <div class="zoom-indicator absolute top-2 right-2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
            </svg>
          </div>
          
          <!-- Image Counter -->
          ${this.images.length > 1 ? `
            <div class="image-counter absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded text-sm text-muted-foreground">
              <span class="current">1</span> / ${this.images.length}
            </div>
          ` : ''}
        </div>
        
        <!-- Thumbnail Navigation -->
        ${this.images.length > 1 ? `
          <div class="thumbnails flex space-x-2 overflow-x-auto pb-2">
            ${this.images.map((image, index) => `
              <button class="thumbnail flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${index === 0 ? 'border-nbs-primary' : 'border-border hover:border-nbs-primary/50'}" data-index="${index}">
                <img 
                  src="${image.thumbnail || image.src}" 
                  alt="${image.alt}"
                  class="w-full h-full object-contain"
                  loading="lazy"
                />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
    // Cache element references
    this.mainImage = this.container.querySelector('.main-image');
    this.loadingSpinner = this.container.querySelector('.loading-spinner');
    this.thumbnails = this.container.querySelectorAll('.thumbnail');
    this.imageCounter = this.container.querySelector('.image-counter .current');
    this.zoomIndicator = this.container.querySelector('.zoom-indicator svg');
  }
  
  bindEvents() {
    // Main image events
    if (this.mainImage) {
      this.mainImage.addEventListener('load', () => this.handleImageLoad());
      this.mainImage.addEventListener('error', () => this.handleImageError());
      this.mainImage.addEventListener('click', () => this.toggleZoom());
      this.mainImage.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    // Navigation buttons
    const prevBtn = this.container.querySelector('.nav-prev');
    const nextBtn = this.container.querySelector('.nav-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.goToPrevious());
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToNext());
    
    // Thumbnail navigation
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.selectImage(index));
    });
    
    // Touch events
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }
  
  preloadImages() {
    // Preload current and adjacent images
    const indicesToPreload = [
      this.currentImageIndex,
      (this.currentImageIndex + 1) % this.images.length,
      (this.currentImageIndex - 1 + this.images.length) % this.images.length
    ];
    
    indicesToPreload.forEach(index => {
      if (!this.loadedImages.has(index) && this.images[index]) {
        const img = new Image();
        img.onload = () => this.loadedImages.add(index);
        img.src = this.images[index].src;
      }
    });
  }
  
  handleImageLoad() {
    this.isLoading = false;
    if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
    if (this.mainImage) this.mainImage.style.opacity = '1';
  }
  
  handleImageError() {
    this.isLoading = false;
    if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
    console.error('Failed to load image:', this.images[this.currentImageIndex]?.src);
  }
  
  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    this.scale = this.isZoomed ? 2 : 1;
    this.updateImageTransform();
    this.updateZoomIndicator();
    
    if (this.mainImage) {
      this.mainImage.style.cursor = this.isZoomed ? 'zoom-out' : 'zoom-in';
    }
  }
  
  updateImageTransform() {
    if (this.mainImage) {
      this.mainImage.style.transform = this.isZoomed 
        ? `scale(${this.scale})` 
        : 'scale(1)';
      this.mainImage.style.transformOrigin = `${this.zoomPosition.x}% ${this.zoomPosition.y}%`;
    }
  }
  
  updateZoomIndicator() {
    if (this.zoomIndicator) {
      this.zoomIndicator.innerHTML = this.isZoomed 
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>';
    }
  }
  
  handleMouseMove(e) {
    if (!this.isZoomed) return;
    
    const rect = this.mainImage.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    this.zoomPosition = { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    this.updateImageTransform();
  }
  
  goToNext() {
    this.selectImage((this.currentImageIndex + 1) % this.images.length);
  }
  
  goToPrevious() {
    this.selectImage((this.currentImageIndex - 1 + this.images.length) % this.images.length);
  }
  
  selectImage(index) {
    if (index === this.currentImageIndex || !this.images[index]) return;
    
    this.currentImageIndex = index;
    this.isZoomed = false;
    this.scale = 1;
    this.isLoading = true;
    
    // Update main image
    if (this.mainImage) {
      this.mainImage.style.opacity = '0';
      this.mainImage.src = this.images[index].src;
      this.mainImage.alt = this.images[index].alt;
      this.mainImage.style.cursor = 'zoom-in';
    }
    
    // Show loading spinner
    if (this.loadingSpinner) this.loadingSpinner.style.display = 'flex';
    
    // Update thumbnails
    this.updateThumbnails();
    
    // Update counter
    if (this.imageCounter) {
      this.imageCounter.textContent = index + 1;
    }
    
    // Update zoom indicator
    this.updateZoomIndicator();
    this.updateImageTransform();
    
    // Preload adjacent images
    this.preloadImages();
  }
  
  updateThumbnails() {
    this.thumbnails.forEach((thumb, index) => {
      if (index === this.currentImageIndex) {
        thumb.className = thumb.className.replace('border-border hover:border-nbs-primary/50', 'border-nbs-primary');
      } else {
        thumb.className = thumb.className.replace('border-nbs-primary', 'border-border hover:border-nbs-primary/50');
      }
    });
  }
  
  handleTouchStart(e) {
    if (e.touches.length === 1) {
      this.touchStart = e.touches[0].clientX;
      this.touchEnd = null;
    }
  }
  
  handleTouchMove(e) {
    if (e.touches.length === 1) {
      this.touchEnd = e.touches[0].clientX;
    }
  }
  
  handleTouchEnd(e) {
    if (!this.touchStart || !this.touchEnd) return;
    
    const distance = this.touchStart - this.touchEnd;
    const isLeftSwipe = distance > this.minSwipeDistance;
    const isRightSwipe = distance < -this.minSwipeDistance;
    
    if (isLeftSwipe && this.images.length > 1) {
      this.goToNext();
    } else if (isRightSwipe && this.images.length > 1) {
      this.goToPrevious();
    }
    
    this.touchStart = null;
    this.touchEnd = null;
  }
  
  handleKeyDown(e) {
    // Only handle if this gallery is in viewport or focused
    if (!this.isInViewport()) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (this.images.length > 1) this.goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (this.images.length > 1) this.goToNext();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.toggleZoom();
        break;
      case 'Escape':
        if (this.isZoomed) {
          e.preventDefault();
          this.toggleZoom();
        }
        break;
    }
  }
  
  isInViewport() {
    const rect = this.container.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
  
  destroy() {
    // Clean up event listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    // Note: Other event listeners are automatically cleaned up when the container is removed
  }
}

// Auto-initialize galleries on page load
document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('[data-product-gallery]');
  galleries.forEach(container => {
    const imagesData = container.dataset.images ? JSON.parse(container.dataset.images) : [];
    const productName = container.dataset.productName || '';
    
    new ProductImageGallery(container, {
      images: imagesData,
      productName: productName
    });
  });
});

// Export for manual initialization
window.ProductImageGallery = ProductImageGallery;