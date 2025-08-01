"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "../../lib/utils"

// Simplified select component for Astro integration
// Uses basic HTML select for better SSR compatibility

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

function Select({
  className,
  placeholder,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  )
}

interface SelectOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

function SelectOption({ className, ...props }: SelectOptionProps) {
  return (
    <option
      className={cn("py-1.5 pl-2 pr-8", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectOption,
}