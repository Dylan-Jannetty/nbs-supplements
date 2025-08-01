import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // NBS-specific badge variants
        ingredient:
          "ingredient-badge border-nbs-secondary/20 bg-nbs-secondary/10 text-nbs-secondary [a&]:hover:bg-nbs-secondary/20",
        dosage:
          "dosage-highlight border-nbs-primary/30 bg-nbs-primary/10 text-nbs-primary font-bold [a&]:hover:bg-nbs-primary/20",
        certification:
          "certification-badge border-certification-gold/30 bg-certification-gold/10 text-certification-gold [a&]:hover:bg-certification-gold/20",
        trust:
          "trust-signal border-nbs-success/20 bg-nbs-success/5 text-nbs-success [a&]:hover:bg-nbs-success/10",
        clinical:
          "border-nbs-clinical bg-nbs-clinical text-nbs-trust [a&]:hover:bg-nbs-clinical/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }