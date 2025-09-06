import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'oxngxeaiitwjqbot') {
    return null; // Return null instead of throwing error
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    // Check if email is properly configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'oxngxeaiitwjqbot') {
      // Mock email service for development
      console.log('📧 MOCK EMAIL SERVICE - Password Reset');
      console.log('To:', email);
      console.log('Subject: Password Reset Request - TripToIndia');
      console.log('Reset URL:', `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);
      console.log('User:', userName);
      console.log('Token:', resetToken);

      return {
        success: true,
        message: 'Password reset email sent successfully (mock mode)'
      };
    }

    const transporter = createTransporter();

    // If transporter is null, it means credentials are not configured
    if (!transporter) {
      console.log('📧 MOCK EMAIL SERVICE - Password Reset (Fallback)');
      console.log('To:', email);
      console.log('Reset URL:', `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);
      return {
        success: true,
        message: 'Password reset email sent successfully (mock mode)'
      };
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
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
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              We received a request to reset your password for your TripToIndia account. 
              If you didn't make this request, you can safely ignore this email.
            </p>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              To reset your password, click the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Reset My Password
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              This link will expire in 1 hour for security reasons.
            </p>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This email was sent by TripToIndia. If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send password reset email' };
  }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmation = async (email, userName) => {
  try {
    // Check if email is properly configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'oxngxeaiitwjqbot') {
      // Mock email service for development
      console.log('📧 MOCK EMAIL SERVICE - Password Reset Confirmation');
      console.log('To:', email);
      console.log('Subject: Password Reset Successful - TripToIndia');
      console.log('User:', userName);

      return {
        success: true,
        message: 'Password reset confirmation email sent (mock mode)'
      };
    }

    const transporter = createTransporter();

    // If transporter is null, it means credentials are not configured
    if (!transporter) {
      console.log('📧 MOCK EMAIL SERVICE - Password Reset Confirmation (Fallback)');
      console.log('To:', email);
      console.log('Subject: Password Reset Successful - TripToIndia');
      return {
        success: true,
        message: 'Password reset confirmation email sent (mock mode)'
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
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
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Your password has been successfully reset. You can now log in to your TripToIndia account with your new password.
            </p>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              If you didn't make this change, please contact our support team immediately.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/login" 
                 style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);">
                Login to Your Account
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This email was sent by TripToIndia. If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Password reset confirmation email sent' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};
