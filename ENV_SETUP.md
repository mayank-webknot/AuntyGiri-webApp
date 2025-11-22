# Environment Configuration

## ✅ .env File Created

The `.env` file has been configured with the following settings:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Environment
VITE_ENV=development
```

## 📝 Manual Setup (if needed)

If the `.env` file wasn't created automatically, create it manually:

1. **Create `.env` file** in the project root:
   ```bash
   cd /Users/mayankmishra/Desktop/AuntyGiri/AuntyGiri-Desktop/Web-App/insightful-student-insights-main
   touch .env
   ```

2. **Add the following content** to `.env`:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api/v1

   # Environment
   VITE_ENV=development

   # Mock Data Fallback (enable/disable mock data when backend fails)
   VITE_USE_MOCK_FALLBACK=true
   ```

## ✅ Verification

The frontend will use this configuration:

- **Base URL**: `http://localhost:3000/api/v1`
- **Backend Port**: `3000`
- **API Path**: `/api/v1`

## 🔄 Restart Required

After creating/updating the `.env` file:

1. **Stop the dev server** (if running): `Ctrl+C`
2. **Restart the dev server**: `npm run dev`

Vite will automatically load the environment variables from `.env`.

## 📋 Current Configuration

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | Backend API base URL |
| `VITE_ENV` | `development` | Environment mode |
| `VITE_USE_MOCK_FALLBACK` | `true` | Enable mock data fallback when backend fails |

## 🔒 Security Note

The `.env` file is already added to `.gitignore` to prevent committing sensitive data.

---

**Status**: ✅ Configuration Ready

