import express from 'express';
import passport from '../config/passport.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import User from '../models/UserSchema.js';

const router = express.Router();

// Test route to verify auth routes are working
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth routes are working!',
    googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: process.env.NODE_ENV === 'production'
      ? "https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api/v1/auth/google/callback"
      : "http://localhost:3000/api/v1/auth/google/callback",
    currentURL: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    environment: process.env.NODE_ENV,
    frontendURL: process.env.FRONTEND_URL,
    timestamp: new Date().toISOString()
  });
});

// Debug route to test callback without OAuth
router.get('/debug-callback', async (req, res) => {
  try {
    console.log('🧪 Debug callback route hit');

    // Test JWT generation
    const testToken = generateToken('test-user-id');
    console.log('🔑 Test token generated:', !!testToken);

    // Test user data encoding
    const testUserData = encodeURIComponent(JSON.stringify({
      _id: 'test-id',
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com'
    }));

    console.log('📦 Test user data encoded successfully');

    res.json({
      success: true,
      message: 'Debug callback working',
      tokenGenerated: !!testToken,
      frontendURL: process.env.FRONTEND_URL
    });
  } catch (error) {
    console.error('❌ Debug callback error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Simple test route for callback debugging
router.get('/callback-test', (req, res) => {
  console.log('🧪 Callback test route hit');
  res.json({
    success: true,
    message: 'Callback test route working',
    timestamp: new Date().toISOString()
  });
});

// Google OAuth Routes - Only if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('✅ Google OAuth routes are being registered');

  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'consent'
    })
  );

  // Simple callback route for debugging
  router.get('/google/callback', (req, res) => {
    console.log('🔄 SIMPLE Google OAuth callback route hit');
    console.log('📍 Request URL:', req.url);
    console.log('📍 Query params:', req.query);

    // Return simple JSON response to see if route works
    res.json({
      success: true,
      message: 'Callback route reached successfully',
      url: req.url,
      query: req.query,
      timestamp: new Date().toISOString()
    });
  });

} else {
  // Fallback routes when Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Google OAuth not configured on server'
    });
  });

  router.get('/google/callback', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_not_configured`);
  });
}

// Facebook OAuth Routes - Removed (will be added in future updates)

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
});

export default router;
