# Portfolio Application

## Overview

This is a full-stack portfolio application built with React, Express, and PostgreSQL. The system allows users to view projects and a resume, while providing admin functionality to manage content. The application uses modern web technologies including TypeScript, Tailwind CSS, and shadcn/ui components for a polished user experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Comprehensive set of Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Simple admin secret-based authentication
- **Development**: Hot reload with Vite integration in development

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon serverless PostgreSQL with connection pooling

## Key Components

### Database Schema
- **Projects Table**: Stores portfolio projects with title, markdown content, and image arrays
- **Settings Table**: Key-value store for application settings (resume URL, etc.)
- **Users Table**: Basic user authentication (currently unused but prepared)

### API Routes
- `GET /api/projects` - Fetch all projects (public)
- `GET /api/projects/:id` - Fetch single project (public)
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `GET /api/resume` - Fetch resume URL from settings
- `POST /api/resume` - Update resume URL (admin only)

### Frontend Pages
- **Home**: Portfolio showcase with hero section and project grid
- **Resume**: PDF viewer for resume display
- **Project Detail**: Individual project view with markdown rendering
- **Admin Panel**: Content management interface for projects and resume
- **404**: Not found page

### UI Components
- Custom project cards with image thumbnails
- Responsive navigation bar
- Comprehensive form components for admin panel
- Toast notifications for user feedback
- Loading states and error handling

## Data Flow

1. **Public Access**: Users can browse projects and view resume without authentication
2. **Admin Access**: Admin routes protected by `X-Admin-Secret` header or query parameter
3. **Content Management**: Admins can create, edit, and delete projects through the admin panel
4. **Image Handling**: Projects support multiple images stored as URL arrays
5. **Resume Management**: Resume URL stored in settings table, displayed via PDF viewer

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation and type safety

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Development server and build tool

## Deployment Strategy

### Development
- Uses Vite dev server with hot module replacement
- Express server serves API routes
- Database migrations via `npm run db:push`
- Environment variables for database connection

### Production
- Static assets built with Vite and served by Express
- Server bundle created with esbuild
- Deployment on Replit with autoscale configuration
- PostgreSQL database provisioned automatically

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `ADMIN_SECRET`: Admin authentication secret (defaults to "admin123")
- `NODE_ENV`: Environment mode (development/production)

## Changelog

- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.