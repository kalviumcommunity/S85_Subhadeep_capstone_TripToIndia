# OAuth Setup Guide for TripToIndia

## 🔐 Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### 2. Create OAuth 2.0 Credentials
1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure the consent screen first if prompted
4. Choose "Web application" as application type
5. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/v1/auth/google/callback`
   - Production: `https://your-domain.com/api/v1/auth/google/callback`

### 3. Get Client ID and Secret
- Copy the Client ID and Client Secret
- Add them to your `.env` file:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📘 Facebook OAuth Setup

### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App" → "Consumer" → "Next"
3. Enter app name and contact email

### 2. Configure Facebook Login
1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" platform
4. Add your site URL: `http://localhost:5173` (development)

### 3. Configure OAuth Redirect URIs
1. Go to Facebook Login → Settings
2. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:5000/api/v1/auth/facebook/callback`
   - Production: `https://your-domain.com/api/v1/auth/facebook/callback`

### 4. Get App ID and Secret
1. Go to Settings → Basic
2. Copy App ID and App Secret
3. Add them to your `.env` file:
```
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

## 🔑 Environment Variables

Create a `.env` file in the backend directory with:

```env
# Database
MONGO_URI=mongodb://localhost:27017/triptoindia

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Session Secret (use a strong, random string)
SESSION_SECRET=your-super-secret-session-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Google Maps API
GOOGLE_API_KEY=your-google-maps-api-key
```

## 🚀 Testing OAuth

### Development URLs:
- Google Login: `http://localhost:5000/api/v1/auth/google`
- Facebook Login: `http://localhost:5000/api/v1/auth/facebook`

### Production URLs:
- Google Login: `https://your-domain.com/api/v1/auth/google`
- Facebook Login: `https://your-domain.com/api/v1/auth/facebook`

## 🔧 Features Implemented

### Backend:
- ✅ JWT tokens with 5-hour expiration
- ✅ Google OAuth 2.0 integration
- ✅ Facebook OAuth integration
- ✅ User schema updated for social auth
- ✅ Automatic user creation/linking
- ✅ Protected routes with JWT middleware

### Frontend:
- ✅ Social login buttons on Login/Signup pages
- ✅ OAuth callback handling
- ✅ Automatic token storage
- ✅ Redux state management
- ✅ Error handling

## 🛡️ Security Features

1. **JWT Tokens**: 5-hour expiration for security
2. **CORS Protection**: Configured for specific origins
3. **Session Management**: Secure session configuration
4. **Password Hashing**: bcrypt for local authentication
5. **Email Verification**: Track verification status
6. **Provider Linking**: Link social accounts to existing users

## 📱 User Flow

1. User clicks Google/Facebook button
2. Redirected to OAuth provider
3. User authorizes the application
4. Provider redirects back with authorization code
5. Backend exchanges code for user info
6. User created/found in database
7. JWT token generated
8. User redirected to frontend with token
9. Frontend stores token and updates state
10. User is logged in automatically

## 🔍 Troubleshooting

### Common Issues:
1. **Invalid redirect URI**: Check OAuth app settings
2. **CORS errors**: Verify FRONTEND_URL in .env
3. **Token errors**: Check JWT_SECRET configuration
4. **Database errors**: Ensure MongoDB is running
5. **Missing scopes**: Verify OAuth app permissions
