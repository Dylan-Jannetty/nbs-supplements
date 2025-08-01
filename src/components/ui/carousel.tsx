"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  autoPlay?: boolean
  autoPlayInterval?: number
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  isPlaying: boolean
  togglePlayPause: () => void
  currentSlide: number
  slideCount: number
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  autoPlay = false,
  autoPlayInterval = 8000,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(autoPlay)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [slideCount, setSlideCount] = React.useState(0)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setCurrentSlide(api.selectedScrollSnap())
    setSlideCount(api.scrollSnapList().length)
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const startAutoPlay = React.useCallback(() => {
    if (!api || !autoPlay) return
    intervalRef.current = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0) // Loop back to first slide
      }
    }, autoPlayInterval)
  }, [api, autoPlay, autoPlayInterval])

  const stopAutoPlay = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const togglePlayPause = React.useCallback(() => {
    setIsPlaying(prev => {
      const newIsPlaying = !prev
      if (newIsPlaying) {
        startAutoPlay()
      } else {
        stopAutoPlay()
      }
      return newIsPlaying
    })
  }, [startAutoPlay, stopAutoPlay])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
        stopAutoPlay()
        setIsPlaying(false)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
        stopAutoPlay()
        setIsPlaying(false)
      } else if (event.key === " ") {
        event.preventDefault()
        togglePlayPause()
      }
    },
    [scrollPrev, scrollNext, stopAutoPlay, togglePlayPause]
  )

  const handleMouseEnter = React.useCallback(() => {
    if (autoPlay && isPlaying) {
      stopAutoPlay()
    }
  }, [autoPlay, isPlaying, stopAutoPlay])

  const handleMouseLeave = React.useCallback(() => {
    if (autoPlay && isPlaying) {
      startAutoPlay()
    }
  }, [autoPlay, isPlaying, startAutoPlay])

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  React.useEffect(() => {
    if (autoPlay && isPlaying) {
      startAutoPlay()
    }

    return () => {
      stopAutoPlay()
    }
  }, [autoPlay, isPlaying, startAutoPlay, stopAutoPlay])

  // Stop autoplay on any user interaction
  React.useEffect(() => {
    if (!api) return

    const handleUserInteraction = () => {
      stopAutoPlay()
      setIsPlaying(false)
    }

    api.on("pointerDown", handleUserInteraction)
    api.on("select", () => {
      // Announce slide changes to screen readers
      const slideElement = api.containerNode().querySelector(`[data-slide="${currentSlide}"]`)
      if (slideElement) {
        slideElement.setAttribute('aria-live', 'polite')
        setTimeout(() => slideElement.removeAttribute('aria-live'), 1000)
      }
    })

    return () => {
      api?.off("pointerDown", handleUserInteraction)
    }
  }, [api, stopAutoPlay, currentSlide])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        autoPlay,
        autoPlayInterval,
        isPlaying,
        togglePlayPause,
        currentSlide,
        slideCount,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ 
  className, 
  index,
  ...props 
}: React.ComponentProps<"div"> & { index?: number }) {
  const { orientation, currentSlide } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${(index || 0) + 1}`}
      data-slide={index}
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full bg-background/80 backdrop-blur-sm border-nbs-primary/20 hover:bg-nbs-primary/10 hover:border-nbs-primary/40",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4 text-nbs-primary" />
      <span className="sr-only">Previous testimonial</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full bg-background/80 backdrop-blur-sm border-nbs-primary/20 hover:bg-nbs-primary/10 hover:border-nbs-primary/40",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4 text-nbs-primary" />
      <span className="sr-only">Next testimonial</span>
    </Button>
  )
}

function CarouselPlayPause({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isPlaying, togglePlayPause, autoPlay } = useCarousel()

  if (!autoPlay) return null

  return (
    <Button
      data-slot="carousel-play-pause"
      variant={variant}
      size={size}
      className={cn(
        "absolute top-4 right-4 size-8 rounded-full bg-background/80 backdrop-blur-sm border-nbs-primary/20 hover:bg-nbs-primary/10 hover:border-nbs-primary/40",
        className
      )}
      onClick={togglePlayPause}
      aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      {...props}
    >
      {isPlaying ? (
        <Pause className="h-4 w-4 text-nbs-primary" />
      ) : (
        <Play className="h-4 w-4 text-nbs-primary" />
      )}
      <span className="sr-only">
        {isPlaying ? "Pause testimonial slideshow" : "Play testimonial slideshow"}
      </span>
    </Button>
  )
}

function CarouselDots({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { api, currentSlide, slideCount } = useCarousel()

  const scrollTo = React.useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  if (slideCount <= 1) return null

  return (
    <div 
      className={cn("flex justify-center space-x-2 mt-4", className)}
      role="tablist"
      aria-label="Testimonial navigation"
      {...props}
    >
      {Array.from({ length: slideCount }).map((_, index) => (
        <button
          key={index}
          role="tab"
          aria-selected={currentSlide === index}
          aria-label={`Go to testimonial ${index + 1}`}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-200",
            currentSlide === index 
              ? "bg-nbs-primary w-6" 
              : "bg-nbs-primary/30 hover:bg-nbs-primary/60"
          )}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselPlayPause,
  CarouselDots,
}