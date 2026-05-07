import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

// ==============================
// SEND LOGIN OTP
// ==============================
export const sendLoginOTP = async (email, otp, userName) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`🔐 LOGIN OTP for ${email}: ${otp}`);

      return {
        success: true,
        message: 'OTP generated successfully!',
        development: true
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Login Verification Code - TripToIndia',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello ${userName}!</h2>
          <p>Your login OTP is:</p>

          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            background:#667eea;
            color:white;
            padding:20px;
            border-radius:10px;
            width:fit-content;
          ">
            ${otp}
          </div>

          <p>This OTP expires in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Login OTP sent successfully'
    };

  } catch (error) {
    console.error('❌ Login OTP email error:', error);

    return {
      success: false,
      message: 'Failed to send login OTP'
    };
  }
};

// ==============================
// SEND SIGNUP OTP
// ==============================
export const sendSignupOTP = async (email, otp, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification Code - TripToIndia',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome ${userName}!</h2>

          <p>Your signup verification OTP is:</p>

          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            background:#4CAF50;
            color:white;
            padding:20px;
            border-radius:10px;
            width:fit-content;
          ">
            ${otp}
          </div>

          <p>This OTP expires in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Signup OTP sent successfully'
    };

  } catch (error) {
    console.error('❌ Signup OTP email error:', error);

    return {
      success: false,
      message: 'Failed to send signup OTP'
    };
  }
};

// ==============================
// SEND WELCOME EMAIL
// ==============================
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to TripToIndia!',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>🎉 Welcome ${userName}!</h2>

          <p>
            Your TripToIndia account has been successfully verified.
          </p>

          <a href="${process.env.FRONTEND_URL}"
             style="
               background:#4ECDC4;
               color:white;
               padding:12px 20px;
               border-radius:8px;
               text-decoration:none;
               display:inline-block;
             ">
             Explore India
          </a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Welcome email sent successfully'
    };

  } catch (error) {
    console.error('❌ Welcome email error:', error);

    return {
      success: false,
      message: 'Failed to send welcome email'
    };
  }
};
