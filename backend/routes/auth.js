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
    callbackURL: 'http://localhost:3000/auth/google/callback',
    currentURL: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
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

  router.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`
    }),
    async (req, res) => {
      try {
        console.log('🔄 Google OAuth callback - Processing user:', req.user?.email);

        // Validate user object
        if (!req.user) {
          console.error('❌ No user object found in request');
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_user`);
        }

        if (!req.user._id) {
          console.error('❌ No user ID found');
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_user_id`);
        }

        console.log('🔑 Generating JWT token for user:', req.user._id);
        // Generate JWT token
        const token = generateToken(req.user._id);

        if (!token) {
          console.error('❌ Failed to generate JWT token');
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=token_generation_failed`);
        }

        console.log('📦 Preparing user data for frontend');
        // Redirect to frontend with token and user data
        const userData = encodeURIComponent(JSON.stringify({
          _id: req.user._id,
          firstname: req.user.firstname || 'User',
          lastname: req.user.lastname || '',
          email: req.user.email,
          phone: req.user.phone || '',
          role: req.user.role || 'customer',
          profilePicture: req.user.profilePicture || '',
          authProvider: req.user.authProvider || 'google'
        }));

        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?token=${token}&user=${userData}&auth=success`;
        console.log('🚀 Redirecting to frontend:', process.env.FRONTEND_URL || 'http://localhost:5173');

        res.redirect(redirectUrl);
      } catch (error) {
        console.error('❌ Google OAuth callback error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          user: req.user ? {
            id: req.user._id,
            email: req.user.email
          } : 'No user'
        });
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=callback_error`);
      }
    }
  );

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
