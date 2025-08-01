# NBS Supplements E-commerce Site - Product Requirements Document

## Executive Summary

This PRD outlines the development of a modern, SEO-optimized e-commerce website for NBS (No Bullsh*t) Supplements, focusing on their flagship pre-workout product "Catalyst." The site will emphasize the company's core values of clean, natural ingredients, clinical dosing, and transparency while providing an exceptional user experience.

## Project Overview

### Company Mission
NBS Supplements is a team of four passionate pharmacists committed to delivering the highest-quality, all-natural supplements. Their philosophy centers on "natural is best" with clinically dosed formulas, third-party testing, and complete transparency.

### Current State
- Existing site: https://www.supplements-nbs.com/
- Single product: Catalyst (pre-workout)
- Image assets available for reuse
- Need for complete site redesign and functionality upgrade

### Key Differentiators
- Clean formulations with no additives
- Clinically dosed ingredients
- Third-party testing for quality and safety
- All-natural flavorings and sweeteners
- Pharmacist-formulated recipes
- Domestically produced in the USA

## Technical Requirements

### Technology Stack
- **Frontend Framework**: Astro
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS with CSS variables for theming
- **Hosting**: Netlify
- **Forms**: Netlify Forms integration
- **Cart Management**: Gumroad (Free + 3.5% + 30¢ per transaction)

### Alternative Cart Solutions
1. **Gumroad** (Selected)
   - Cost: Free + 3.5% + 30¢ per transaction
   - Features: Simple setup, good for digital/physical products, hosted checkout

2. **Snipcart**
   - Cost: $20/month + 2% transaction fee
   - Features: Easy integration, checkout overlay, inventory management

3. **Foxy.io**
   - Cost: $15/month + 1.5% + 15¢ per transaction
   - Features: Hosted cart, extensive customization

### Performance & Accessibility
- Lighthouse score target: 95+ on all metrics
- WCAG 2.1 AA compliance
- Responsive design (mobile-first approach)
- Core Web Vitals optimization

### Theme System
- Light/Dark mode toggle using CSS custom properties
- System preference detection
- Persistent user preference storage

## Site Architecture

### Navigation Structure
```
Home
├── Products
│   └── Catalyst (Pre-Workout)
├── About Us
├── Blog
├── Contact
└── Cart/Checkout (Snipcart overlay)
```

### URL Structure
- `/` - Homepage
- `/products/catalyst` - Product detail page
- `/about` - About us page
- `/blog` - Blog listing page
- `/blog/[slug]` - Individual blog posts
- `/contact` - Contact page

## Page Requirements

### 1. Homepage

#### Design Goals
- Attractive, simple, professional aesthetic
- Immediate wow factor for visitors
- Clear value proposition presentation
- Strong call-to-action placement

#### Key Sections
1. **Hero Section**
   - Compelling headline highlighting "Clean, Clinically Dosed Supplements"
   - Catalyst product image
   - Primary CTA: "Shop Catalyst"
   - Secondary CTA: "Learn More"

2. **Value Propositions**
   - Clean formulations (no additives)
   - Clinically dosed ingredients
   - Third-party tested
   - Pharmacist formulated
   - Made in USA

3. **Product Spotlight**
   - Catalyst overview
   - Key ingredients highlight
   - "No BS" messaging

4. **Testimonials Carousel**
   - Auto-advancing slides (5-second intervals)
   - Pause on hover
   - Navigation dots
   - Mobile-optimized

5. **Newsletter Signup**
   - Email capture for coupons/offers
   - Prominent placement
   - Value proposition for signing up

6. **Social Proof**
   - Third-party testing badges
   - Made in USA certification
   - Customer count/satisfaction metrics

#### SEO Requirements
- Primary keyword: "natural pre-workout supplements"
- Secondary keywords: "clean pre-workout", "pharmacist formulated supplements"
- Structured data markup (Organization, Product)
- Open Graph and Twitter Card meta tags

### 2. Product Page (Catalyst)

#### Content Sections
1. **Product Gallery**
   - High-quality product images
   - Zoom functionality
   - Multiple angles/views

2. **Product Information**
   - Detailed description
   - Ingredient breakdown with dosages
   - Benefits and features
   - Usage instructions

3. **Ingredients Deep Dive**
   - Creatine Monohydrate (5g)
   - L-Citrulline (2g)
   - Guarana Extract (400mg)
   - Beta-Alanine (2g)
   - Vitamin B12 and C
   - Monk fruit sweetener

4. **Add to Cart**
   - Snipcart integration
   - Quantity selector
   - Price display
   - Stock status

5. **Product Reviews**
   - Customer testimonials
   - Rating system
   - Review submission form

6. **FAQ Section**
   - Common questions about Catalyst
   - Usage guidelines
   - Safety information

#### SEO Optimization
- Product schema markup
- Detailed meta descriptions
- Alt text for all images
- Breadcrumb navigation

### 3. About Us Page

#### Content Structure
Based on provided content, organized into sections:

1. **Company Story**
   - Team introduction (four passionate pharmacists)
   - Mission statement
   - "Why We Started NBS" narrative

2. **Philosophy & Values**
   - Natural is best philosophy
   - Transparency commitment
   - Quality standards

3. **Why Choose Us**
   - Expert knowledge
   - All-natural ingredients
   - Transparent formulations

4. **Product Development**
   - Community involvement
   - Testing process
   - Quality assurance

5. **Location & Reach**
   - Based in NJ, ships nationwide
   - Local gym connections
   - Community involvement

6. **Future Products**
   - Flux (hydration formula)
   - Synapse (nootropic)
   - Development philosophy

### 4. Blog Page

#### Blog Structure
- Featured post section
- Recent posts grid
- Category filtering
- Search functionality
- Pagination

#### Required Blog Posts

**Post 1: "Natural Doesn't Mean Weak: Why Clean Pre-Workouts Still Hit Hard"**
- Debunk misconceptions about natural supplements
- Highlight Catalyst's clinical dosing
- Include ingredient science

**Post 2: "How to Time Your Pre-Workout for Maximum Effect"**
- Optimal timing guidelines
- Absorption information
- Usage tips for Catalyst

**Post 3: "What Makes a Pre-Workout Truly Natural?"**
- Define "natural" in supplement context
- Compare artificial vs. natural ingredients
- Highlight Catalyst's natural profile

**Post 4: "The Science Behind Guarana: Nature's Answer to Synthetic Caffeine"**
- Guarana benefits and research
- Comparison to synthetic caffeine
- Why it's used in Catalyst

**Post 5: "Why Most Pre-Workouts Are Junk (And What To Look For Instead)"**
- Industry critique
- Quality indicators
- Catalyst as the solution

#### Blog SEO
- Category and tag system
- Related posts suggestions
- Social sharing buttons
- Comment system (Netlify Identity + functions)

### 5. Contact Page

#### Contact Form (Netlify Forms)
- Full Name (required)
- Email Address (required)  
- Subject/Topic (dropdown)
- Message (required, textarea)
- Form validation
- Success/error states
- Spam protection (honeypot)

#### Additional Contact Information
- Business hours
- Location (NJ-based)
- Response time expectations
- Alternative contact methods

## E-commerce Integration

### Gumroad Implementation
```html
<!-- Product purchase button -->
<a href="https://gumroad.com/l/catalyst-preworkout" 
   class="gumroad-button" 
   data-gumroad-single-product="true">
  Buy Catalyst Pre-Workout - $39.99
</a>

<!-- Gumroad embed script -->
<script src="https://gumroad.com/js/gumroad.js"></script>
```

### Integration Features
- Hosted checkout process
- Automatic order fulfillment emails
- Customer management
- Analytics dashboard
- Mobile-optimized checkout
- Multiple payment methods
- No monthly fees (transaction-based only)

## SEO Strategy

### Technical SEO
- Sitemap.xml generation
- Robots.txt optimization
- Schema.org markup implementation
- Core Web Vitals optimization
- Image optimization and lazy loading

### Content SEO
**Primary Keywords:**
- Natural pre-workout supplements
- Clean pre-workout
- Pharmacist formulated supplements
- Third-party tested supplements

**Long-tail Keywords:**
- Best natural pre-workout without artificial ingredients
- Clean pre-workout with creatine and beta-alanine
- Pharmacist formulated natural supplements
- Third-party tested pre-workout supplements

### Local SEO (NJ-based)
- Google My Business optimization
- Local schema markup
- NJ supplement store optimization

## Design System

### Color Palette
**Light Mode:**
- Primary: Clean blues and greens
- Secondary: Natural earth tones
- Accent: Energetic orange/yellow
- Text: Dark grays and blacks

**Dark Mode:**
- Primary: Muted blues and greens
- Secondary: Warm grays
- Accent: Bright accent colors
- Text: Light grays and whites

### Typography
- Headlines: Bold, modern sans-serif
- Body: Clean, readable sans-serif
- Accent: Stylized font for brand elements

### Component Library
- Buttons (primary, secondary, outline)
- Cards (product, testimonial, blog)
- Forms (input, textarea, select)
- Navigation (header, footer, breadcrumbs)
- Modals and overlays

## Email Marketing Integration

### Newsletter Signup
- Mailchimp or ConvertKit integration
- Double opt-in process
- Welcome email sequence
- Segmentation capabilities

### Email Automation
- Welcome series for new subscribers
- Product education emails
- Promotional campaigns
- Abandoned cart recovery

## Performance Requirements

### Loading Speed
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- First Input Delay: <100ms

### Optimization Strategies
- Image optimization (WebP format)
- Lazy loading implementation
- Critical CSS inlining
- JavaScript code splitting
- CDN implementation through Netlify

## Analytics & Tracking

### Required Tracking
- Google Analytics 4
- Google Search Console
- Hotjar or similar heatmap tool
- Conversion tracking
- Newsletter signup tracking

### Key Metrics
- Page load times
- Conversion rates
- Cart abandonment rates
- Email signup rates
- Blog engagement metrics



## Success Metrics

### Immediate (First Month)
- Site launch with 95+ Lighthouse scores
- All core pages indexed by Google
- Newsletter signup rate >5%
- Mobile traffic >60%

### Short-term (3 Months)
- Organic traffic increase of 200%
- Conversion rate >2%
- Average session duration >2 minutes
- Bounce rate <50%

### Long-term (6+ Months)
- Top 3 rankings for primary keywords
- 1000+ newsletter subscribers
- Established blog readership
- Expansion to additional products

## Risk Assessment

### Technical Risks
- Third-party service dependencies (Snipcart)
- Netlify form limitations
- SEO migration challenges

### Mitigation Strategies
- Backup payment processing options
- Form fallback systems
- Careful 301 redirect planning
- Comprehensive testing protocols

## Conclusion

This PRD provides a comprehensive roadmap for developing a modern, high-performing e-commerce site for NBS Supplements. The focus on clean design, technical excellence, and SEO optimization will support the company's growth while maintaining their core values of transparency and quality.

The phased approach ensures steady progress while allowing for feedback and iteration throughout the development process. Success will be measured through both technical metrics and business outcomes, ensuring the site serves both user needs and business objectives effectively.