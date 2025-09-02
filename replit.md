# BlueMedia - Video Marketing Agency

## Overview

BlueMedia is a professional video marketing agency website designed to help small businesses create viral content for Instagram Reels, TikTok videos, and YouTube Shorts. The platform serves as a marketing website and service booking platform, featuring portfolio showcases, pricing calculators, blog content, and integrated payment processing. The site targets small businesses across multiple industries including restaurants, fitness, retail, real estate, and professional services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Site Generation**: Built with Jekyll static site generator using Liquid templating engine
- **Component Structure**: Modular layout system with reusable templates (default.html, post.html, blog.html)
- **Styling Approach**: CSS custom properties-based design system with dark theme and gradient accents
- **Responsive Design**: Mobile-first responsive design with container-based grid system
- **Typography System**: Inter and Open Sans font families loaded from Google Fonts CDN
- **Icon System**: Font Awesome 6.0 for consistent iconography across the platform

### Interactive Components
- **Video Portfolio**: Modal-based video player system for showcasing work samples with category filtering
- **Contact Forms**: Multiple lead capture forms with client-side validation
- **Testimonials**: Carousel component for displaying client testimonials with smooth transitions
- **Navigation**: Fixed header with smooth scrolling navigation and mobile hamburger menu
- **Pricing Calculator**: Interactive pricing estimation tools for service packages

### Content Management System
- **Blog System**: Jekyll-powered blog with markdown posts organized by categories (Business, Trends, Tips)
- **SEO Optimization**: Built-in Jekyll SEO plugin integration with meta tags and structured data
- **Asset Management**: Static asset serving with relative URL linking for images and resources
- **Content Organization**: Category-based content filtering and tagging system for blog posts

### User Experience Features
- **Smooth Scrolling**: JavaScript-powered smooth navigation between page sections
- **Modal Systems**: Video previews and content overlays for enhanced user engagement
- **Form Handling**: Client-side form validation with success/error feedback states
- **Animation System**: CSS-based animations for floating elements and transitions

## External Dependencies

### Payment Processing
- **PayPal SDK**: Client-side PayPal integration for payment processing and service bookings
- **PayPal Server SDK**: Backend payment processing capabilities through @paypal/paypal-server-sdk npm package
- **Express.js**: Server framework for handling payment webhooks and API endpoints

### Third-Party Services
- **Tawk.to**: Live chat widget integration for real-time customer support and lead qualification
- **Google Fonts**: Web font delivery service for typography (Inter and Open Sans font families)
- **Font Awesome**: Icon library delivered via CDN for UI elements and social media icons
- **Unsplash**: External image hosting service for blog post featured images and portfolio content

### Development Tools
- **Jekyll**: Static site generator for blog functionality and templating
- **Bundler**: Ruby gem dependency management for Jekyll plugins
- **Node.js Dependencies**: Express server and PayPal SDK for backend payment processing

### External APIs
- **Social Media Platforms**: Integration touchpoints for Instagram, TikTok, YouTube, LinkedIn, Facebook, Twitter, Snapchat, Pinterest, Discord, Telegram, and WhatsApp
- **Contact Forms**: Designed for integration with form handling services like Formspree
- **Analytics**: Prepared for Google Analytics or similar tracking service integration