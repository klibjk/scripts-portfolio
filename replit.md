# Script Portfolio Builder Guide

## Overview
This is a full-stack web application designed to showcase a portfolio of PowerShell and Bash scripts. The application allows users to browse, view, and potentially manage scripts with detailed metadata, code highlighting, and documentation display.

The application consists of a React frontend with a modern UI (using shadcn/ui components), an Express backend, and a PostgreSQL database managed through Drizzle ORM. The system is designed to display scripts with their associated metadata, versions, tags, and highlights.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application follows a traditional client-server architecture:

1. **Frontend**: React application with TypeScript, using the shadcn/ui component library for the UI
2. **Backend**: Express.js server with TypeScript
3. **Database**: PostgreSQL with Drizzle ORM for database interaction
4. **Styling**: Tailwind CSS for styling components
5. **State Management**: React Query for server state management
6. **Routing**: Wouter for client-side routing

The application is designed to be deployed on Replit, with configuration for development and production environments.

## Key Components

### Frontend
- **Client Directory Structure**: Main frontend code is in `client/src/`
- **Pages**: Home, ScriptDetailPage, Documentation, AdminDashboard
- **Components**: ScriptCard, ScriptDetail, FilterControls, Navbar, Footer
- **Theming**: Supports light/dark mode via ThemeProvider
- **UI Library**: Uses shadcn/ui components for consistent design

### Backend
- **Server Directory Structure**: Main backend code is in `server/`
- **API Endpoints**: RESTful endpoints for scripts CRUD operations
- **Database Connection**: Uses Neon Serverless Postgres via `@neondatabase/serverless`
- **Data Access Layer**: Storage class that abstracts database operations
- **Logging**: Custom logging functionality for tracking agent actions

### Database Schema
The database schema includes these main tables:
- `users`: For user authentication
- `scripts`: Stores script metadata, content, and readme information
- `script_tags`: Many-to-many relationship for script tags
- `script_highlights`: Key features or highlights of scripts
- `script_versions`: Version history for scripts

### Shared Code
The `shared/` directory contains code shared between frontend and backend:
- Database schema definitions
- TypeScript types
- Seed data for initial scripts

## Data Flow

1. **Script Display Flow**:
   - User visits the home page
   - Frontend makes a request to `/api/scripts` endpoint
   - Backend retrieves scripts from database via the storage layer
   - Frontend displays scripts in a grid of ScriptCard components
   - User can filter scripts by language or search by text

2. **Script Detail Flow**:
   - User clicks on a script card
   - Application navigates to `/scripts/:key` route
   - Frontend requests script details from `/api/scripts/key/:key` endpoint
   - Backend retrieves the specific script with associated tags, highlights, etc.
   - Frontend displays detailed script information with syntax highlighting

3. **Admin Flow** (partially implemented):
   - User navigates to admin dashboard
   - Authentication (currently placeholder)
   - Admin can view logs and potentially manage scripts

## External Dependencies

### Frontend Dependencies
- **React**: Core UI library
- **Wouter**: Lightweight routing library
- **React Query**: Data fetching and cache management
- **shadcn/ui**: Component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **date-fns**: Date formatting utility

### Backend Dependencies
- **Express**: Web server framework
- **Drizzle ORM**: Database ORM
- **@neondatabase/serverless**: PostgreSQL client
- **zod**: Schema validation

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development Mode**:
   - Runs with `npm run dev` command
   - Uses Vite for frontend development with hot module replacement
   - Backend runs with `tsx` for TypeScript execution

2. **Production Build**:
   - Frontend: Built with Vite (`vite build`)
   - Backend: Bundled with esbuild
   - Combined into a single deployment package

3. **Database**:
   - Uses Neon Serverless PostgreSQL
   - Connection details provided via environment variables
   - Schema defined using Drizzle ORM

4. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: Environment (development/production)

## Getting Started

1. Ensure the PostgreSQL database is provisioned in your Replit
2. Install dependencies with `npm install`
3. Run the database migrations with `npm run db:push`
4. Start the development server with `npm run dev`

## Key Files

- `server/index.ts`: Entry point for the Express server
- `server/routes.ts`: API endpoint definitions
- `server/storage.ts`: Database operations abstraction
- `client/src/main.tsx`: Frontend entry point
- `client/src/App.tsx`: Main application component and routing
- `shared/schema.ts`: Database schema and type definitions