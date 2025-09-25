# Yadnus Consultant Website

## Overview

This is a full-stack web application for Yadnus Consultant, a town planning and construction consulting company. The application serves as both a public-facing website and an administrative dashboard. It features a modern React frontend with Tailwind CSS styling, an Express.js backend, and PostgreSQL database with Drizzle ORM. The platform includes content management capabilities for blog posts, projects, and webinars, along with form submission handling and email notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with conditional navigation based on authentication state
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **File Structure**: Clean separation between pages, components, hooks, and utilities with TypeScript path aliases

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API endpoints with proper HTTP status codes and error handling
- **Authentication**: Replit's OpenID Connect (OIDC) integration with session-based authentication
- **Database Layer**: Drizzle ORM providing type-safe database operations with PostgreSQL
- **File Uploads**: Multer middleware for handling multipart form data and file attachments
- **Email Service**: SendGrid integration for transactional emails and notifications
- **Development**: Hot module replacement with Vite integration for seamless development experience

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon (serverless PostgreSQL)
- **ORM**: Drizzle with type-safe schema definitions and migrations
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **File Storage**: Local filesystem storage for uploaded files (suitable for development/small scale)
- **Schema Design**: Normalized relational schema with proper foreign key relationships

### Authentication and Authorization
- **Authentication Provider**: Replit OIDC for secure user authentication
- **Session Management**: Express sessions with PostgreSQL storage for persistence
- **Authorization Strategy**: Simple role-based access with authenticated vs public routes
- **Security**: CSRF protection via session-based authentication and secure cookie settings

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for PostgreSQL database operations
- **@sendgrid/mail**: Email service for transactional emails and notifications
- **express**: Web application framework for the backend API
- **react**: Frontend UI library with TypeScript support
- **@tanstack/react-query**: Server state management and data fetching

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Icon library for consistent iconography

### Form Handling and Validation
- **react-hook-form**: Performant form library with validation
- **@hookform/resolvers**: Resolvers for various validation libraries
- **zod**: Runtime type validation for forms and API inputs

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking for JavaScript
- **@replit/vite-plugin-***: Replit-specific development plugins for enhanced DX

### Third-Party Integrations
- **SendGrid**: Email delivery service for contact forms and notifications
- **Replit Auth**: OAuth2/OIDC authentication provider
- **Neon Database**: Serverless PostgreSQL hosting platform
- **Google Fonts**: Web font delivery for typography