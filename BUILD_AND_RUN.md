# Build and Run Instructions

## ✅ Pre-Build Checklist

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Verify Dependencies**:
   - ✅ @reduxjs/toolkit
   - ✅ react-redux
   - ✅ All other dependencies in package.json

## 🔨 Build the App

```bash
npm run build
```

This will:
- Type-check all TypeScript files
- Compile the app
- Create optimized production build in `dist/` folder

## 🚀 Run the Development Server

```bash
npm run dev
```

The app will start on: **http://localhost:8080** (or the next available port)

## 🐛 Check for Errors

### TypeScript Errors
```bash
npx tsc --noEmit
```

### Linting Errors
```bash
npm run lint
```

## 📋 Quick Start Commands

```bash
# Navigate to project
cd insightful-student-insights-main

# Install dependencies (first time only)
npm install

# Build for production
npm run build

# Run development server
npm run dev

# Preview production build
npm run preview
```

## ⚠️ Common Issues & Fixes

### Issue: Module not found errors
**Fix**: Run `npm install` to ensure all dependencies are installed

### Issue: TypeScript errors
**Fix**: All TypeScript issues have been resolved. If you see errors, run:
```bash
npx tsc --noEmit
```

### Issue: Port already in use
**Fix**: The dev server will automatically use the next available port, or change it in `vite.config.ts`

## ✅ Expected Build Output

When building successfully, you should see:
```
✓ built in X.XXs
```

The `dist/` folder will contain:
- `index.html`
- `assets/` folder with compiled JS and CSS

## 🎯 After Building

1. **Development**: Use `npm run dev` for hot-reload development
2. **Production**: Use `npm run build` then `npm run preview` to test production build
3. **Deploy**: Deploy the `dist/` folder to your hosting service

