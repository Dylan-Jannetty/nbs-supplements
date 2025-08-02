# NBS Supplements E-commerce Website

A modern, professional e-commerce website for **NBS (No Bullsh*t) Supplements**, a clean natural supplements company run by pharmacists. Built with Astro, React, and Tailwind CSS, featuring their flagship pre-workout product "Catalyst" with emphasis on transparency, quality, and natural ingredients.

## 🚀 Live Demo

**Coming Soon** - Deployed on Netlify at `https://supplements-nbs.com`

## ✨ Features

### 🛍️ E-commerce Functionality
- **Single Product Focus**: Streamlined experience featuring Catalyst pre-workout ($39.99)
- **Gumroad Integration**: Secure payment processing with hosted checkout
- **Professional Product Pages**: Detailed ingredient breakdowns and clinical dosing information

### 📞 Professional Contact System
- **Advanced Contact Form**: Netlify Forms integration with real-time validation
- **Accessibility Compliant**: WCAG 2.1 AA standards with comprehensive ARIA support
- **GDPR Compliant**: Privacy protection and secure form handling
- **Interactive Features**: Auto-save drafts, character counting, progressive validation
- **Comprehensive FAQ**: Addresses common customer inquiries

### 🎨 Modern Design System
- **Dual Theme Support**: Automatic light/dark mode with system preference detection
- **CSS Custom Properties**: Sophisticated theming system with brand colors
- **Responsive Design**: Mobile-first approach with optimal viewing on all devices
- **shadcn/ui Components**: Consistent, accessible UI component library

### 📈 SEO & Performance
- **Technical SEO**: Comprehensive meta tags, Open Graph, Twitter Cards
- **Schema.org Markup**: Structured data for enhanced search results
- **Performance Optimized**: Static generation for optimal loading speeds
- **Core Web Vitals**: Targeting 95+ Lighthouse scores

### 📝 Content Management
- **Blog System**: MDX-powered content with TypeScript validation
- **Content Collections**: Organized blog posts with automatic RSS generation
- **Newsletter Integration**: Netlify Forms for subscriber management

## 🛠️ Technology Stack

### Core Framework
- **[Astro](https://astro.build/)** - Static site generator with islands architecture
- **[React](https://reactjs.org/)** - Interactive components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Deployment & Forms
- **[Netlify](https://www.netlify.com/)** - Static hosting and form handling
- **[Netlify Forms](https://docs.netlify.com/forms/)** - Serverless form processing
- **[Gumroad](https://gumroad.com/)** - Payment processing integration

### Content & SEO
- **[MDX](https://mdxjs.com/)** - Markdown with JSX for rich content
- **Content Collections** - Type-safe content management
- **Automatic Sitemap** - XML sitemap generation

## 🏁 Quick Start

### Prerequisites
- Node.js 18.20.8+ or 20.3.0+ or 22.0.0+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dylan-Jannetty/nbs-supplements.git
   cd nbs-supplements
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Access Astro CLI
npm run astro
```

## 📁 Project Structure

```
nbs-supplements/
├── public/
│   ├── images/           # Product and content images
│   └── favicon.ico       # Site favicon
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── ContactForm.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Newsletter.astro
│   ├── content/         # Content collections
│   │   └── blog/        # Blog posts (MDX)
│   ├── layouts/         # Page layouts
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   ├── lib/             # Utility functions
│   ├── pages/           # Route pages
│   │   ├── blog/        # Blog routes
│   │   ├── products/    # Product pages
│   │   ├── contact.astro
│   │   ├── about.astro
│   │   └── index.astro
│   ├── styles/          # Global styles
│   └── images/          # Optimized images
├── CLAUDE.md            # AI assistant instructions
├── PRD.md              # Product requirements document
├── components.json      # shadcn/ui configuration
├── tailwind.config.mjs  # Tailwind configuration
└── astro.config.mjs     # Astro configuration
```

## 🎨 Design System

### Brand Colors
- **Primary**: Clean blue (`--nbs-primary`) - Trust and professionalism
- **Secondary**: Natural green (`--nbs-secondary`) - Health and nature
- **Accent**: Energetic orange (`--nbs-accent`) - Energy and motivation
- **Natural**: Earth tone (`--nbs-natural`) - Natural ingredients

### Typography
- **Font Family**: Inter - Clean, modern, highly legible
- **Scale**: Semantic heading hierarchy with consistent spacing
- **Responsive**: Optimal reading experience across all devices

### Theme System
- **Automatic Detection**: Respects user's system preference
- **Manual Toggle**: User can override system settings
- **CSS Variables**: Consistent theming throughout the application
- **Persistent**: Theme choice saved in localStorage

## 📞 Contact System Features

### Form Capabilities
- **Required Fields**: Full Name, Email, Message
- **Optional Fields**: Subject dropdown with common inquiry types
- **Real-time Validation**: Immediate feedback on input errors
- **Progressive Enhancement**: Works without JavaScript
- **Spam Protection**: Honeypot fields and server-side validation

### Accessibility Features
- **WCAG 2.1 AA Compliant**: Comprehensive accessibility support
- **ARIA Labels**: Proper semantic markup for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear visual focus indicators
- **Error Handling**: Accessible error messages and recovery

### Advanced Features
- **Auto-save Drafts**: Prevents data loss during form completion
- **Character Counting**: Real-time feedback for message length
- **GDPR Compliance**: Privacy protection and consent management
- **Success States**: Clear confirmation and next steps

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Configure build settings: `npm run build` / `dist`

2. **Environment Variables**
   - No additional environment variables required for basic functionality

3. **Form Configuration**
   - Netlify Forms automatically detects and processes contact forms
   - Spam protection included by default

4. **Domain Configuration**
   - Configure custom domain: `supplements-nbs.com`
   - SSL certificate automatically provisioned

### Build Optimization
- **Static Generation**: All pages pre-rendered for optimal performance
- **Asset Optimization**: Automatic image optimization and compression
- **Bundle Splitting**: Efficient JavaScript loading with code splitting

## 🔧 Configuration

### Astro Configuration (`astro.config.mjs`)
```javascript
export default defineConfig({
  site: 'https://supplements-nbs.com',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    mdx()
  ],
  output: 'static',
  adapter: netlify(),
});
```

### Tailwind Configuration (`tailwind.config.mjs`)
- Custom color system with CSS variables
- Typography scale and spacing system
- Component-specific styling utilities

### shadcn/ui Configuration (`components.json`)
- Astro-optimized component installation
- Consistent styling with design system
- Accessibility-first component library

## 📝 Content Management

### Blog Posts
- **Format**: MDX files in `src/content/blog/`
- **Frontmatter**: Title, description, date, author metadata
- **Type Safety**: TypeScript validation for content schema
- **Rich Content**: Support for interactive components within posts

### Adding New Blog Posts
1. Create new `.mdx` file in `src/content/blog/`
2. Include required frontmatter fields
3. Write content using Markdown with optional JSX components
4. Build automatically includes post in blog index and RSS feed

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following existing code conventions
4. Test thoroughly across different devices and browsers
5. Submit a pull request with detailed description

### Code Standards
- **TypeScript**: Type-safe development with strict configuration
- **Prettier**: Consistent code formatting
- **ESLint**: Code quality and best practices
- **Accessibility**: WCAG 2.1 AA compliance required

## 📊 Performance Targets

### Core Web Vitals
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

## 📄 License

This project is proprietary software for NBS Supplements. All rights reserved.

## 🆘 Support

For technical support or questions about the website:

- **Contact Form**: Use the contact page for general inquiries
- **Technical Issues**: Report via GitHub Issues
- **Business Inquiries**: Direct email through contact form

## 🙏 Acknowledgments

- **Astro Team** - For the excellent static site generator
- **shadcn** - For the beautiful component library
- **Tailwind Labs** - For the utility-first CSS framework
- **Netlify** - For seamless deployment and form handling

---

**Built with ❤️ by the NBS Supplements team**
