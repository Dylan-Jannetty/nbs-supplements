import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImage {
  src: string;
  alt: string;
  thumbnail?: string;
  webp?: string;
  avif?: string;
  sizes?: string;
  priority?: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductImageGallery({ 
  images, 
  productName, 
  className 
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentImageIndex];
  const minSwipeDistance = 50;

  // Preload adjacent images for smooth navigation
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < images.length && !loadedImages.has(index)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
        img.src = images[index].src;
      }
    };

    // Preload current, next, and previous images
    preloadImage(currentImageIndex);
    preloadImage((currentImageIndex + 1) % images.length);
    preloadImage((currentImageIndex - 1 + images.length) % images.length);
  }, [currentImageIndex, images, loadedImages]);

  // Handle main image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (image: ProductImage) => {
    const srcSet = [];
    if (image.avif) srcSet.push(`${image.avif} 1x`);
    if (image.webp) srcSet.push(`${image.webp} 1x`);
    srcSet.push(`${image.src} 1x`);
    return srcSet.join(', ');
  };

  // Navigate to next/previous image
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle zoom mode
      if (isZoomed) {
        switch (e.key) {
          case 'Escape':
            setIsZoomed(false);
            setScale(1);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            goToPrevious();
            break;
          case 'ArrowRight':
            e.preventDefault();
            goToNext();
            break;
          case '+':
          case '=':
            e.preventDefault();
            setScale(prev => Math.min(prev * 1.2, 3));
            break;
          case '-':
            e.preventDefault();
            setScale(prev => Math.max(prev / 1.2, 1));
            break;
        }
        return;
      }
      
      // Handle normal mode
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          toggleZoom();
          break;
        case 'Home':
          e.preventDefault();
          setCurrentImageIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentImageIndex(images.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, scale, images.length]);

  // Enhanced touch gestures with pinch-to-zoom
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [isPinching, setIsPinching] = useState(false);

  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return null;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    
    if (e.touches.length === 2) {
      // Pinch gesture
      setIsPinching(true);
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
      e.preventDefault();
    } else if (e.touches.length === 1) {
      // Single touch for swipe
      setTouchStart(e.targetTouches[0].clientX);
      setIsPinching(false);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching && lastTouchDistance) {
      // Handle pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      if (currentDistance) {
        const scaleChange = currentDistance / lastTouchDistance;
        const newScale = Math.min(Math.max(scale * scaleChange, 1), 3);
        setScale(newScale);
        setIsZoomed(newScale > 1);
        setLastTouchDistance(currentDistance);
      }
      e.preventDefault();
    } else if (e.touches.length === 1 && !isPinching) {
      // Handle swipe
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isPinching) {
      setIsPinching(false);
      setLastTouchDistance(null);
      return;
    }

    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Handle mouse zoom
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed || !imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setScale(1);
    } else {
      setIsZoomed(true);
      setScale(2);
    }
  };

  // Reset zoom when changing images
  useEffect(() => {
    setIsZoomed(false);
    setScale(1);
    setIsLoading(true);
  }, [currentImageIndex]);

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsZoomed(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image Display */}
      <div 
        ref={containerRef}
        className="relative group bg-muted rounded-lg overflow-hidden aspect-square"
        onMouseMove={handleMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="img"
        aria-label={`${productName} image ${currentImageIndex + 1} of ${images.length}`}
        tabIndex={0}
      >
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-nbs-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Main Image */}
        <picture>
          {currentImage.avif && (
            <source srcSet={currentImage.avif} type="image/avif" />
          )}
          {currentImage.webp && (
            <source srcSet={currentImage.webp} type="image/webp" />
          )}
          <img
            ref={imageRef}
            src={currentImage.src}
            alt={currentImage.alt}
            loading={currentImage.priority ? "eager" : "lazy"}
            decoding="async"
            sizes={currentImage.sizes || "(max-width: 768px) 100vw, 50vw"}
            className={cn(
              "w-full h-full object-cover transition-all duration-300 cursor-zoom-in",
              isZoomed && "cursor-zoom-out",
              isLoading && "opacity-0"
            )}
            style={{
              transform: isZoomed ? `scale(${scale})` : 'scale(1)',
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
            onClick={toggleZoom}
            onLoad={handleImageLoad}
            onError={() => setIsLoading(false)}
          />
        </picture>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-nbs-primary"
              aria-label={`Previous image. Currently viewing image ${currentImageIndex + 1} of ${images.length}`}
              disabled={images.length <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-nbs-primary"
              aria-label={`Next image. Currently viewing image ${currentImageIndex + 1} of ${images.length}`}
              disabled={images.length <= 1}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Enhanced Zoom Indicator */}
        <div className="absolute top-2 right-2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center space-x-1">
            {isZoomed ? (
              <>
                <X className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{Math.round(scale * 100)}%</span>
              </>
            ) : (
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded text-sm text-muted-foreground">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div 
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nbs-primary relative",
                index === currentImageIndex
                  ? "border-nbs-primary ring-2 ring-nbs-primary/20"
                  : "border-border hover:border-nbs-primary/50"
              )}
              role="tab"
              aria-selected={index === currentImageIndex}
              aria-label={`View ${image.alt}. Image ${index + 1} of ${images.length}`}
              tabIndex={index === currentImageIndex ? 0 : -1}
            >
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              <picture>
                {image.webp && (
                  <source srcSet={image.webp} type="image/webp" />
                )}
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-200",
                    loadedImages.has(index) ? "opacity-100" : "opacity-0"
                  )}
                  loading="lazy"
                  onLoad={() => setLoadedImages(prev => new Set([...prev, index]))}
                />
              </picture>
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-nbs-primary/10" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Zoom Modal for Mobile */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
          onClick={() => setIsZoomed(false)}
        >
          <div className="flex items-center justify-center h-full p-4">
            <div 
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <picture>
                {currentImage.avif && (
                  <source srcSet={currentImage.avif} type="image/avif" />
                )}
                {currentImage.webp && (
                  <source srcSet={currentImage.webp} type="image/webp" />
                )}
                <img
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${scale})` }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                />
              </picture>
              
              {/* Close button */}
              <button
                onClick={() => {
                  setIsZoomed(false);
                  setScale(1);
                }}
                className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                aria-label="Close zoom view"
                autoFocus
              >
                <X className="w-6 h-6" />
              </button>

              {/* Scale indicator */}
              {scale > 1 && (
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 text-white rounded-full text-sm">
                  {Math.round(scale * 100)}%
                </div>
              )}

              {/* Navigation in zoom mode */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Previous image in zoom view"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-16 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Next image in zoom view"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Screen Reader Instructions */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        <p>
          Image gallery for {productName}. Currently viewing image {currentImageIndex + 1} of {images.length}.
          {currentImage.alt} 
          Use arrow keys to navigate between images, Enter or Space to zoom in, and Escape to exit zoom mode.
          {isZoomed ? ' Zoom mode is active. ' : ''}
          {isLoading ? ' Image is loading. ' : ''}
        </p>
      </div>

      {/* Live region for announcing image changes */}
      <div 
        className="sr-only" 
        aria-live="assertive" 
        aria-atomic="true"
        key={`${currentImageIndex}-${isZoomed}`}
      >
        {`Now viewing: ${currentImage.alt}${isZoomed ? ' (zoomed)' : ''}`}
      </div>
    </div>
  );
}