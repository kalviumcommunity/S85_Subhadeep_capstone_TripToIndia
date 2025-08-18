import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/UserSchema.js';

// Enhanced Google OAuth Configuration
const configureGoogleOAuth = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️ Google OAuth credentials missing. Google authentication disabled.');
    return;
  }

  console.log('🔧 Initializing Google OAuth Strategy');
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔑 Google Client ID:', process.env.GOOGLE_CLIENT_ID.substring(0, 6) + '...');
  
  const callbackURL = process.env.NODE_ENV === 'production'
    ? `${process.env.BACKEND_URL}/api/v1/auth/google/callback`
    : 'http://localhost:3000/api/v1/auth/google/callback';

  console.log('🔄 Callback URL:', callbackURL);

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    scope: ['profile', 'email'],
    passReqToCallback: true // Allows access to req object
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Received Google profile:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName
      });

      // Validate essential profile data
      if (!profile.emails?.[0]?.value) {
        const error = new Error('No email found in Google profile');
        error.name = 'GoogleAuthError';
        throw error;
      }

      const email = profile.emails[0].value;
      const googleId = profile.id;

      // Transaction-like processing
      let user = await User.findOne({ 
        $or: [
          { googleId },
          { email, authProvider: 'google' }
        ]
      });

      // Existing user found
      if (user) {
        if (!user.googleId) {
          console.log('🔗 Linking Google account to existing user');
          user.googleId = googleId;
          user.authProvider = 'google';
          await user.save();
        }
        return done(null, user);
      }

      // Check for email collision with local account
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        const error = new Error('Email already registered with local account');
        error.name = 'AccountConflictError';
        throw error;
      }

      // Create new user
      const newUser = new User({
        googleId,
        email,
        firstname: profile.name?.givenName || 'Google',
        lastname: profile.name?.familyName || 'User',
        authProvider: 'google',
        isEmailVerified: true,
        profilePicture: profile.photos?.[0]?.value || '',
        role: 'customer'
      });

      await newUser.save();
      console.log('✅ Created new Google-authenticated user:', newUser.email);
      return done(null, newUser);

    } catch (error) {
      console.error('❌ Google OAuth Processing Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Special handling for duplicate key errors
      if (error.code === 11000) {
        error.message = 'Account already exists with these credentials';
      }
      
      return done(error, null, { 
        message: error.message,
        type: error.name || 'GoogleAuthError'
      });
    }
  }));
};

configureGoogleOAuth();

// Session Serialization
passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    provider: user.authProvider
  });
});

passport.deserializeUser(async (serializedUser, done) => {
  try {
    const user = await User.findById(serializedUser.id);
    if (!user) {
      throw new Error('User not found');
    }
    done(null, user);
  } catch (error) {
    console.error('❌ Deserialization Error:', error);
    done(error);
  }
});

export default passport;