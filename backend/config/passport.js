import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/UserSchema.js';

// Google OAuth Strategy - Only initialize if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('🔧 Configuring Google OAuth for:', process.env.NODE_ENV || 'development');
  console.log('🔑 Google Client ID:', process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...');
  console.log('🌍 NODE_ENV value:', process.env.NODE_ENV);
  console.log('🌍 NODE_ENV type:', typeof process.env.NODE_ENV);
  console.log('🌍 NODE_ENV === "production":', process.env.NODE_ENV === 'production');

  // Environment-based callback URL for deployment
  const callbackURL = process.env.NODE_ENV === 'production'
    ? "https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api/v1/auth/google/callback"
    : "http://localhost:3000/api/v1/auth/google/callback";

  console.log('� Using callback URL:', callbackURL);



  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 Google OAuth Strategy - Processing user:', profile.emails[0].value);

    // Validate profile data
    if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
      console.error('❌ No email found in Google profile');
      return done(new Error('No email found in Google profile'), null);
    }

    const email = profile.emails[0].value;
    console.log('📧 Processing email:', email);

    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      console.log('✅ Found existing user with Google ID:', user.email);
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({ email: email });

    if (user) {
      console.log('🔗 Linking Google account to existing user:', email);
      // Link Google account to existing user
      user.googleId = profile.id;
      user.authProvider = 'google';
      user.isEmailVerified = true;
      if (profile.photos && profile.photos[0]) {
        user.profilePicture = profile.photos[0].value;
      }
      await user.save();
      console.log('✅ Successfully linked Google account');
      return done(null, user);
    }

    // Create new user
    console.log('👤 Creating new user for:', email);
    const newUser = new User({
      googleId: profile.id,
      firstname: profile.name?.givenName || 'User',
      lastname: profile.name?.familyName || '',
      email: email,
      phone: '', // Will be updated later if needed
      authProvider: 'google',
      isEmailVerified: true,
      isOtpVerified: true,
      profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
      role: 'customer'
    });

    await newUser.save();
    console.log('✅ Successfully created new user:', newUser.email);
    return done(null, newUser);
  } catch (error) {
    console.error('❌ Google OAuth Strategy Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      profile: profile ? {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.name
      } : 'No profile'
    });
    return done(error, null);
  }
  }));
} else {
  console.log('Google OAuth credentials not found. Google authentication disabled.');
}

// Facebook OAuth Strategy - Removed (will be added in future updates)

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
