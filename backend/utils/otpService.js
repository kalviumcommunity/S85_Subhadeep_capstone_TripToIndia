import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Create email transporter
const createTransporter = () => {
// <<<<<<< branch_118
  return nodemailer.createTransport({
// =======
  return nodemailer.createTransporter({
// >>>>>>> main
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email for login
export const sendLoginOTP = async (email, otp, userName) => {
  try {
// <<<<<<< branch_118
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      // Development mode - log OTP to console
      console.log(`🔐 LOGIN OTP for ${email}: ${otp}`);
      console.log(`📧 Email: ${email}`);
      console.log(`👤 User: ${userName}`);
      console.log(`⏰ Valid for 10 minutes`);
      console.log(`🚀 In production, this would be sent via email`);

      return {
        success: true,
        message: 'OTP generated successfully! Check server console for development OTP.',
        development: true
      };
    }

    const transporter = createTransporter();

// =======
    const transporter = createTransporter();
    
// >>>>>>> main
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Login Verification Code - TripToIndia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌏 TripToIndia</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Login Verification</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              We received a login request for your TripToIndia account. To complete your login, please use the verification code below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 20px 30px; 
                          border-radius: 10px; 
                          font-size: 32px; 
                          font-weight: bold; 
                          letter-spacing: 8px;
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                ${otp}
              </div>
            </div>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
              This code will expire in <strong>10 minutes</strong> for security reasons.
            </p>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
              If you didn't request this login, please ignore this email and secure your account.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This email was sent by TripToIndia. Never share your verification codes with anyone.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Login OTP sent successfully' };
  } catch (error) {
    console.error('Login OTP email error:', error);
    return { success: false, message: 'Failed to send login OTP' };
  }
};

// Send OTP email for signup
export const sendSignupOTP = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification Code - TripToIndia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌏 TripToIndia</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Welcome to TripToIndia!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Welcome ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Thank you for joining TripToIndia! To complete your account setup and verify your email address, please use the verification code below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                          color: white; 
                          padding: 20px 30px; 
                          border-radius: 10px; 
                          font-size: 32px; 
                          font-weight: bold; 
                          letter-spacing: 8px;
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px; text-align: center;">
              Once verified, you'll be able to explore amazing destinations across India and plan your perfect trip!
            </p>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
              This code will expire in <strong>10 minutes</strong> for security reasons.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This email was sent by TripToIndia. Never share your verification codes with anyone.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Signup OTP sent successfully' };
  } catch (error) {
    console.error('Signup OTP email error:', error);
    return { success: false, message: 'Failed to send signup OTP' };
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to TripToIndia - Account Verified!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌏 TripToIndia</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Account Successfully Verified!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">🎉 Welcome to TripToIndia, ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Congratulations! Your email has been successfully verified and your TripToIndia account is now active.
            </p>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              You can now:
            </p>
            
            <ul style="color: #666; line-height: 1.8; font-size: 16px; padding-left: 20px;">
              <li>🗺️ Explore amazing destinations across India</li>
              <li>📝 Add your favorite places and experiences</li>
              <li>💬 Share feedback and reviews</li>
              <li>🎯 Plan your perfect Indian adventure</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/login" 
                 style="background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);">
                Start Exploring India
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Thank you for choosing TripToIndia. We're excited to be part of your journey!
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, message: 'Failed to send welcome email' };
  }
};
