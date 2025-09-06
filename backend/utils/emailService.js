import nodemailer from 'nodemailer';

// --- START: CORE FIX ---
// Create a single, reusable transporter when the application starts.
// This is more efficient and secure.

// Check for required environment variables at startup to prevent runtime errors.
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ FATAL ERROR: EMAIL_USER and EMAIL_PASS environment variables are not set.');
  // In a real app, you might want to exit if email is critical
  // process.exit(1); 
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your full Gmail address from .env
    pass: process.env.EMAIL_PASS, // Your 16-character Google App Password from .env
  },
});

// Verify the transporter configuration once on startup.
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error with email transporter configuration:', error);
  } else {
    console.log('✅ Email transporter is configured and ready to send emails.');
  }
});

// --- END: CORE FIX ---


// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: `"TripToIndia" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - TripToIndia',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌏 TripToIndia</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">We received a request to reset your password for your TripToIndia account. If you didn't make this request, you can safely ignore this email.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">Reset My Password</a>
          </div>
          <p style="color: #999; font-size: 14px; line-height: 1.6;">This link will expire in 1 hour for security reasons.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Password reset email sent to ${email}`);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error(`🚨 Failed to send password reset email to ${email}:`, error);
    return { success: false, message: 'Failed to send password reset email' };
  }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmation = async (email, userName) => {
  const mailOptions = {
    from: `"TripToIndia" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Successful - TripToIndia',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌏 TripToIndia</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Password Reset Successful</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">Your password has been successfully reset. You can now log in to your TripToIndia account with your new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/login" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);">Login to Your Account</a>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset confirmation sent to ${email}`);
    return { success: true, message: 'Password reset confirmation email sent' };
  } catch (error) {
    console.error(`🚨 Failed to send confirmation email to ${email}:`, error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};