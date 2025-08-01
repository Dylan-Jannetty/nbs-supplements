"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import { Label } from "./label"

// For Astro integration, we'll create a simplified version without react-hook-form dependency
// This will be used for basic form structure and styling

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-item"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function FormLabel({
  className,
  error,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { error?: boolean }) {
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      {...props}
    />
  )
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-control"
      className={className}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-message"
      className={cn("text-destructive text-sm", className)}
      {...props}
    />
  )
}

export {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}