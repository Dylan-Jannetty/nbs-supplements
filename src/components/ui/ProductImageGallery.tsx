import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImage {
  src: string;
  alt: string;
  thumbnail?: string;
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
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentImageIndex];
  const minSwipeDistance = 50;

  // Navigate to next/previous image
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') {
          setIsZoomed(false);
        }
        return;
      }
      
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
          setIsZoomed(true);
          break;
        case 'Escape':
          setIsZoomed(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  // Handle touch gestures for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
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
    setIsZoomed(!isZoomed);
  };

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
      >
        {/* Main Image */}
        <img
          ref={imageRef}
          src={currentImage.src}
          alt={currentImage.alt}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300 cursor-zoom-in",
            isZoomed && "scale-200 cursor-zoom-out"
          )}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
          onClick={toggleZoom}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-nbs-primary"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-nbs-primary"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-2 right-2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isZoomed ? (
            <X className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded text-sm text-muted-foreground">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Loading State Placeholder */}
        <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" style={{ display: 'none' }} />
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nbs-primary",
                index === currentImageIndex
                  ? "border-nbs-primary ring-2 ring-nbs-primary/20"
                  : "border-border hover:border-nbs-primary/50"
              )}
              aria-label={`View ${image.alt}`}
            >
              <img
                src={image.thumbnail || image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal for Mobile */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-center h-full p-4">
            <div className="relative max-w-full max-h-full">
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-2 right-2 p-2 bg-background/80 hover:bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-nbs-primary"
                aria-label="Close zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Instructions */}
      <div className="sr-only">
        <p>
          Image gallery for {productName}. Use arrow keys to navigate between images, 
          Enter or Space to zoom, and Escape to exit zoom mode.
        </p>
      </div>
    </div>
  );
}