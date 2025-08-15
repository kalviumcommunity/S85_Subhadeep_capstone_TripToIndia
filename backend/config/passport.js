import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/UserSchema.js';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.authProvider = 'google';
      user.isEmailVerified = true;
      if (profile.photos && profile.photos[0]) {
        user.profilePicture = profile.photos[0].value;
      }
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    const newUser = new User({
      googleId: profile.id,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      email: profile.emails[0].value,
      phone: '', // Will be updated later if needed
      authProvider: 'google',
      isEmailVerified: true,
      profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
      role: 'user'
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/v1/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'name', 'emails', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Facebook ID
    let user = await User.findOne({ facebookId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
    if (email) {
      user = await User.findOne({ email: email });
      
      if (user) {
        // Link Facebook account to existing user
        user.facebookId = profile.id;
        user.authProvider = 'facebook';
        user.isEmailVerified = true;
        if (profile.photos && profile.photos[0]) {
          user.profilePicture = profile.photos[0].value;
        }
        await user.save();
        return done(null, user);
      }
    }
    
    // Create new user
    const newUser = new User({
      facebookId: profile.id,
      firstname: profile.name.givenName || profile.displayName.split(' ')[0],
      lastname: profile.name.familyName || profile.displayName.split(' ')[1] || '',
      email: email,
      phone: '', // Will be updated later if needed
      authProvider: 'facebook',
      isEmailVerified: !!email,
      profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
      role: 'user'
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}));

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
