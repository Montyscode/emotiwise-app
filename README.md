# EmotiWise - AI-Powered Emotional Journaling App

EmotiWise is a comprehensive emotional wellness application that combines personal journaling with AI-powered mentorship. The app features two distinct AI personalities (Sage and Jax) that provide personalized guidance based on users' MBTI personality types and emotional patterns.

## Features

### 🧠 AI Mentorship System
- **Sage**: Compassionate, psychology-focused mentor for emotional validation and gentle guidance
- **Jax**: Direct, action-oriented mentor for practical solutions and straightforward advice
- Both mentors provide MBTI personality-aware responses for personalized guidance

### 📊 MBTI Assessment System
- Complete 60-question Myers-Briggs Type Indicator assessment
- Detailed personality insights and journaling recommendations
- AI mentors enhanced with personality context for better guidance

### 📝 Interactive Journaling
- Real-time journal entry creation with mood tracking
- AI mentor responses to journal entries
- Secure data persistence with PostgreSQL database

### 📈 Emotional Progress Tracking
- Comprehensive analytics and progress metrics
- Mood trends and emotional intelligence tracking
- Journaling streak counters and consistency scoring
- Interactive charts and visualizations

### 🔐 Authentication & Security
- Secure user authentication with Replit Auth
- Session-based security with HTTP-only cookies
- Input validation and sanitization throughout

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for state management
- **Recharts** for data visualization
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **OpenAI GPT-5** for AI mentor responses
- **Replit Auth** for authentication

### Infrastructure
- **Neon Database** for PostgreSQL hosting
- **Replit** for development and deployment

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Replit Auth setup (if deploying on Replit)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[username]/emotiwise-app.git
cd emotiwise-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
PGHOST=your_postgres_host
PGPORT=your_postgres_port
PGDATABASE=your_database_name
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
emotiwise-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── pages/         # Page components
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── aiMentors.ts       # AI mentorship logic
│   ├── mbtiAssessment.ts  # MBTI assessment system
│   └── storage.ts         # Database operations
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schema and types
└── drizzle/              # Database migrations
```

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user info
- `GET /api/auth/login` - Login redirect
- `GET /api/auth/logout` - Logout

### Journal Entries
- `GET /api/journal/entries` - Get user's journal entries
- `POST /api/journal/entries` - Create new journal entry

### MBTI Assessment
- `GET /api/assessments/mbti/questions` - Get assessment questions
- `POST /api/assessments/mbti/submit` - Submit assessment responses
- `GET /api/assessments/mbti/latest` - Get latest assessment results

### Progress Tracking
- `GET /api/insights/emotional` - Get emotional intelligence metrics
- `GET /api/progress/comprehensive` - Get comprehensive progress analytics

## Development

### Database Operations
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

### Building for Production
- `npm run build` - Build the application for production
- `npm start` - Start the production server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-5 API
- Replit for authentication and hosting infrastructure
- The open-source community for the excellent libraries used in this project