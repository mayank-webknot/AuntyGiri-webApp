# AuntyGiri Analytics Dashboard

A comprehensive Teacher/Parent/Admin Analytics Dashboard web application built with modern React technologies.

## 🚀 Tech Stack

- **React 18+** with TypeScript
- **Vite** as build tool
- **Redux Toolkit + RTK Query** for state management
- **React Router v6** for routing
- **Tailwind CSS + shadcn/ui** for styling and components
- **Recharts** for data visualization
- **Axios** for API calls
- **Socket.io-client** for real-time updates
- **React Hook Form + Zod** for form validation

## 📁 Project Structure

```
src/
├── app/                    # Store and router configuration
│   ├── store/             # Redux store setup
│   └── router/            # App routing configuration
├── features/              # Feature-based modules
│   ├── auth/              # Authentication module
│   ├── dashboard/         # Dashboard components
│   ├── students/          # Student management
│   ├── analytics/         # Analytics features
│   ├── teachers/          # Teacher management
│   ├── parents/           # Parent features
│   └── admin/             # Admin features
├── shared/                # Shared components and utilities
│   ├── components/        # Reusable components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── services/         # API services
├── config/               # Configuration files
│   ├── api.ts           # API endpoints
│   ├── routes.ts        # Route constants
│   ├── colors.ts        # Global color configuration
│   └── env.ts           # Environment variables
└── main.tsx             # App entry point
```

## 🔐 Authentication Features

- **JWT Token Authentication** with automatic refresh
- **Role-based Access Control** (ADMIN, TEACHER, PARENT, STUDENT)
- **Protected Routes** with role validation
- **Axios Interceptors** for token management and 401 error handling
- **Persistent Authentication** using localStorage

## 🎨 UI Components

The project uses shadcn/ui components with custom Tailwind configuration:

- **Colors**: Primary Blue (#3B82F6), Success Green (#10B981), Warning Orange (#F59E0B), Danger Red (#EF4444)
- **Components**: Button, Card, Input, Alert, and more
- **Responsive Design** with mobile-first approach

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AuntyGiri-webApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in root directory
   echo "VITE_API_BASE_URL=http://localhost:3000/api/v1" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

Use these credentials to test different user roles:

- **Admin**: admin@example.com / password123
- **Teacher**: teacher@example.com / password123  
- **Parent**: parent@example.com / password123
- **Student**: student@example.com / password123

## 🌐 API Integration

The application is configured to work with a REST API at `http://localhost:3000/api/v1` with the following endpoints:

### Authentication Endpoints
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token

### Features
- **Automatic token refresh** on 401 errors
- **Request/Response interceptors** for error handling
- **Type-safe API calls** with TypeScript
- **Loading states** and error handling

## 🛡️ Security Features

- **JWT token storage** in localStorage
- **Automatic token refresh** mechanism
- **Role-based route protection**
- **CSRF protection** ready
- **Input validation** with Zod schemas

## 📱 Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** for consistent styling
- **Custom color palette** following design system
- **Accessible** components with proper ARIA labels

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks (if configured)

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure environment variables** for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a demonstration project. The API endpoints are not connected to a real backend. For production use, implement the corresponding backend API endpoints.