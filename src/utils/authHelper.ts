import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import env from '../config/env';
import bcrypt from 'bcrypt';

/**
 * Generate a JWT token for authentication
 * @param {string} userId 
 * @returns {string} 
 */
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    env.jwtSecret,
    { expiresIn: '24h' }
  );
};

/**
 * Send verification email with OTP
 * @param {string} email
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {string} otp 
 */
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  lastName: string,
  otp: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.emailUser,
      pass: env.emailPassword,
    },
  });

  const fullName = `${firstName} ${lastName}`;

  const mailOptions = {
    from: env.emailUser,
    to: email,
    subject: 'Your Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Hello ${fullName},</p>
        <p>Thank you for registering. Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; letter-spacing: 5px; font-weight: bold; background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
            ${otp}
          </div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not create an account, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Hash user password
 * @param {string} password 
 * @returns {Promise<string>} 
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Generate a random 6-digit OTP
 * @returns {string} 
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Set OTP expiration time (default 10 minutes from now)
 * @returns {Date}
 */
export const getOtpExpiration = (): Date => {
  const otpExpires = new Date();
  otpExpires.setMinutes(otpExpires.getMinutes() + 10);
  return otpExpires;
};
