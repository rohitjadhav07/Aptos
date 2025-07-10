# AptosAI Grid - Decentralized AI Model Sharing & Execution Protocol

## Overview

AptosAI Grid is a decentralized platform built for sharing and executing AI models on the Aptos blockchain. The application allows users to upload AI models, share prompts, execute inference calls, and earn rewards through a comprehensive marketplace ecosystem. The platform features AI model discovery, prompt marketplaces, leaderboards, and user earnings tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling via class-variance-authority

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Handling**: Multer for file uploads (100MB limit)
- **API Design**: RESTful API with comprehensive error handling
- **Development Server**: Vite integration for hot module replacement

### Build System
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for Node.js bundle
- **TypeScript**: Shared type definitions across client/server/shared directories
- **Development**: tsx for TypeScript execution in development

## Key Components

### Database Schema (Drizzle ORM)
- **Users**: ID, username, wallet address, earnings, reputation
- **AI Models**: Model metadata, pricing, usage statistics, creator references
- **Prompts**: Prompt content, pricing, sales tracking, NFT token IDs
- **Model Inferences**: Execution logs with input/output data
- **Prompt Purchases**: Transaction records for prompt marketplace

### Core Features
1. **Model Discovery**: Search and filter AI models by category
2. **Model Upload**: File upload with metadata and pricing configuration
3. **Prompt Marketplace**: Buy/sell prompts as NFTs
4. **Inference Execution**: Run AI model predictions with cost tracking
5. **Leaderboards**: Top earners and most popular models
6. **Statistics Dashboard**: Platform-wide metrics and analytics

### API Endpoints
- `/api/stats` - Platform statistics
- `/api/models` - Model CRUD operations with search/filter
- `/api/models/:id/infer` - Execute model inference
- `/api/prompts` - Prompt marketplace operations
- `/api/leaderboard` - User and model rankings

## Data Flow

1. **Model Upload**: Users upload AI models via form → Multer processes files → Stored with metadata in PostgreSQL
2. **Model Discovery**: Frontend queries `/api/models` with filters → Backend returns paginated results
3. **Inference Execution**: User submits input → Backend processes through model → Results and costs tracked
4. **Prompt Trading**: Users create/purchase prompts → NFT tokens minted → Ownership tracked in database
5. **Earnings Tracking**: All transactions update user earnings and model usage statistics

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **UI Library**: @radix-ui/* components for accessible UI primitives
- **Validation**: zod for schema validation via drizzle-zod
- **File Upload**: multer for handling multipart form data

### Development Tools
- **Replit Integration**: @replit/vite-plugin-runtime-error-modal and cartographer
- **Build Tools**: vite, esbuild, tsx for development and production builds
- **Styling**: tailwindcss, autoprefixer, postcss

## Deployment Strategy

### Development
- Single command development with `npm run dev`
- Vite HMR for frontend development
- tsx for backend TypeScript execution
- Database schema management via `npm run db:push`

### Production
- Frontend: Vite build to `dist/public`
- Backend: esbuild bundle to `dist/index.js`
- Database: Drizzle migrations in `/migrations`
- Environment: NODE_ENV=production with DATABASE_URL configuration

### Database Management
- PostgreSQL as primary database (configured for Neon serverless)
- Drizzle Kit for schema migrations
- Schema definition in `shared/schema.ts` for type safety across client/server

The application follows a monorepo structure with clear separation between client, server, and shared code, enabling efficient development and deployment while maintaining type safety throughout the entire stack.