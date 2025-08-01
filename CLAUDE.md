# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce website for NBS (No Bullsh*t) Supplements, a clean natural supplements company run by pharmacists. The site focuses on their flagship pre-workout product "Catalyst" and emphasizes transparency, quality, and natural ingredients. See `PRD.md` for complete project specifications, brand guidelines, and content requirements.

## Development Commands

```bash
# Development server (localhost:4321)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Access Astro CLI
npm run astro
```

## Architecture & Design System

### Theming System
The project uses a sophisticated CSS custom properties system with automatic light/dark mode switching:

- **CSS Variables**: All colors defined as HSL values in `src/styles/globals.css`
- **Brand Colors**: `--nbs-primary` (clean blue), `--nbs-secondary` (natural green), `--nbs-accent` (energetic orange), `--nbs-natural` (earth tone)
- **Theme Detection**: JavaScript in BaseLayout automatically detects system preference and persists user choice
- **Dark Mode**: Applied via `.dark` class on `<html>` element

### Layout Architecture
Two primary layouts handle different content types:

- **BaseLayout.astro**: Master layout with comprehensive SEO (meta tags, Schema.org, Open Graph), theme system, and slot-based content insertion
- **BlogLayout.astro**: Article-specific layout extending BaseLayout with breadcrumbs, social sharing, reading time, and newsletter CTAs

### Content Management
- **Content Collections**: Blog posts managed in `src/content/blog/` with TypeScript validation
- **MDX Support**: Rich interactive content capability for blog posts
- **SEO Integration**: Automatic meta tag generation and structured data for articles

## Technology Stack Integration

### Astro Configuration
Key integrations in `astro.config.mjs`:
- **Tailwind**: Custom base styles disabled to use design system
- **Netlify**: Static output with adapter for deployment
- **Sitemap**: Automatic XML generation
- **MDX**: Blog post processing

### shadcn/ui Setup
Component library configured via `components.json`:
- **Components**: Install to `src/components/ui/`
- **Utils**: Centralized in `src/lib/utils.ts` with `cn()` helper
- **Styling**: Integrated with Tailwind and CSS variables

### Form Handling Strategy
- **Netlify Forms**: Contact forms and newsletter signups
- **Client-side Validation**: Accessibility-compliant patterns
- **Spam Protection**: Honeypot fields for form security

## E-commerce Integration

### Gumroad Implementation
The site uses Gumroad for payment processing:
- **Hosted Checkout**: No complex cart state management needed
- **Product Integration**: Simple embed buttons for Catalyst pre-workout ($39.99)
- **Transaction Model**: 3.5% + 30¢ per transaction fee structure

### Product Pages
Single product focus (Catalyst) with detailed ingredient breakdowns, clinical dosing information, and quality certifications as specified in PRD.md.

## SEO & Performance Architecture

### Technical SEO
- **Meta Tags**: Comprehensive Open Graph, Twitter Cards, canonical URLs
- **Schema.org**: Organization and BlogPosting structured data
- **Sitemap**: Auto-generated XML sitemap for search engines

### Performance Optimizations
- **Static Generation**: Pre-rendered pages for optimal loading
- **Core Web Vitals**: Optimized for 95+ Lighthouse scores target
- **Image Strategy**: Prepared for WebP format and lazy loading
- **CSS Strategy**: Custom properties avoid JavaScript-dependent theming

## Development Patterns

### Component Architecture
- **Astro Components**: Server-side rendered with islands for interactivity
- **TypeScript Props**: Interface definitions for all component props
- **Slot System**: Flexible content insertion in layouts
- **Accessibility**: WCAG 2.1 AA compliance with skip links and focus management

### Styling Conventions
- **Utility-First**: Tailwind CSS for rapid development
- **Design Tokens**: CSS custom properties for consistent theming
- **Typography Scale**: Semantic heading hierarchy with Inter font
- **Responsive Design**: Mobile-first approach with container queries

## Content Requirements

### Brand Voice & Messaging
- **Tone**: Professional yet approachable, emphasizing expertise and transparency
- **Key Messages**: Clean formulations, clinically dosed, third-party tested, pharmacist-formulated
- **Content Structure**: Follow PRD.md specifications for homepage, about, product, and blog content

### Blog Content Strategy
Five required blog posts specified in PRD.md covering natural supplements, timing, ingredient science, and industry critique. All posts should emphasize NBS's commitment to quality and transparency.

## Production Considerations

### Performance Targets
- **Lighthouse Scores**: 95+ on all metrics
- **Core Web Vitals**: FCP <1.5s, LCP <2.5s, CLS <0.1, FID <100ms
- **Accessibility**: WCAG 2.1 AA compliance throughout

### Deployment
- **Platform**: Netlify with automatic builds from git
- **Forms**: Netlify Forms for contact and newsletter
- **Domain**: supplements-nbs.com (configured in astro.config.mjs)

## Component Development Priority

Based on PRD.md requirements, develop components in this order:
1. Header with navigation and theme toggle
2. Footer with company links and newsletter signup
3. Newsletter component with Netlify Forms integration
4. TestimonialCarousel with auto-advancing slides
5. Product components for Catalyst integration
6. Blog content and related articles system