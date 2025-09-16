# EmotiWise - AI-Powered Emotional Journaling App

## Overview

EmotiWise is a comprehensive emotional wellness application that combines personal journaling with AI-powered mentorship. The app features two distinct AI personalities (Sage and Jax) that provide personalized guidance based on users' MBTI personality types and emotional patterns. Users can track their emotional journey through interactive journaling, take MBTI assessments, and monitor their progress with detailed analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, utilizing a modern component-based architecture:
- **UI Framework**: Uses shadcn/ui components built on top of Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with a custom design system featuring calming colors (deep navy, sage green, warm terracotta)
- **State Management**: TanStack Query for server state management and React Hook Form for form handling
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The backend follows a RESTful API design with Express.js:
- **Framework**: Express.js with TypeScript for type safety
- **Authentication**: Replit Auth integration with OpenID Connect for secure user sessions
- **API Design**: RESTful endpoints with input validation using Zod schemas
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple

### AI Integration
- **OpenAI Integration**: Uses OpenAI GPT-5 for generating mentor responses and emotional analysis
- **Dual AI Personalities**: 
  - Sage: Compassionate, psychology-focused mentor for emotional validation
  - Jax: Direct, action-oriented mentor for practical solutions
- **MBTI Analysis**: Custom MBTI assessment system with 16 personality type insights for personalized guidance

### Data Architecture
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Normalized schema with tables for users, journal entries, MBTI assessments, and sessions
- **Data Validation**: Runtime validation using Zod schemas shared between client and server
- **Migrations**: Drizzle Kit for database schema migrations

### Authentication & Security
- **OAuth Integration**: Replit Auth with OpenID Connect for secure authentication
- **Session Security**: Secure HTTP-only cookies with proper expiration and CSRF protection
- **Input Sanitization**: HTML sanitization and input validation on all user-generated content
- **Authorization**: Route-level authentication middleware protecting sensitive endpoints

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL database for data persistence
- **OpenAI API**: GPT-5 model for AI mentor responses and emotional analysis
- **Replit Auth**: OAuth provider for user authentication and session management

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **UI Components**: Radix UI primitives, shadcn/ui component library, Lucide icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Charts**: Recharts for progress visualization and analytics
- **Date Handling**: date-fns for date manipulation and formatting

### Backend Libraries
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple for sessions
- **Authentication**: OpenID Client, Passport.js for auth strategies
- **Validation**: Zod for schema validation, memoizee for caching
- **Utilities**: Express middleware, CORS handling, session management

### Development Tools
- **Build Tools**: Vite with React plugin, esbuild for production builds
- **TypeScript**: Full TypeScript support across client and server
- **Code Quality**: ESLint, Prettier (implied from modern setup)
- **Development**: tsx for TypeScript execution, hot module replacement