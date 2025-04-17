import bcrypt from 'bcrypt';
import User from '../models/User';
import { 
  generateToken, 
  sendVerificationEmail, 
  generateOTP, 
  getOtpExpiration, 
  hashPassword 
} from '../utils/authHelper';

export default class AuthService {
  static async register(email: string, firstName: string, lastName: string, password: string, role: string = 'user') {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();
    const otpExpires = getOtpExpiration();

    const user = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      verificationOTP: otp,
      otpExpires,
      isVerified: false,
      role: role
    });

    await user.save();
    await sendVerificationEmail(email, firstName, lastName, otp);

    return {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: false,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      const otp = generateOTP();
      user.verificationOTP = otp;
      user.otpExpires = getOtpExpiration();
      await user.save();
      await sendVerificationEmail(user.email, user.firstName, user.lastName, otp);
      throw new Error('Email not verified. Verification code has been resent.');
    }

    const token = generateToken(user.id);

    return {
      userId: user.id,
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: true,
    };
  }

  static async verifyEmail(userId: string, otp: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    if (!user.otpExpires || now > user.otpExpires) {
      throw new Error('Verification code has expired. Please request a new one.');
    }

    if (user.verificationOTP !== otp) {
      throw new Error('Invalid verification code.');
    }

    user.isVerified = true;
    user.verificationOTP = null;
    user.otpExpires = null;
    await user.save();

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: true,
    };
  }

  static async resendVerificationOTP(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const otp = generateOTP();
    user.verificationOTP = otp;
    user.otpExpires = getOtpExpiration();
    await user.save();

    await sendVerificationEmail(user.email, user.firstName, user.lastName, otp);

    return { message: 'Verification code resent' };
  }
}
