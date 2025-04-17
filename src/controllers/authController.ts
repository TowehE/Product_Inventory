import { Request, Response } from 'express';
import AuthService from '../services/authService';

export default class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, firstName, lastName, password, role } = req.body;
      
  
      if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ error: 'Please provide email, firstName, lastName and password' });
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      const result = await AuthService.register(email, firstName, lastName, password, role);
      
      return res.status(201).json({
        message: 'User registered successfully. Please check your email for verification code.',
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'User already exists') {
          return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Unknown server error' });
    }
  }
  
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      return res.status(200).json({
        message: 'Login successful',
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Invalid credentials') {
          return res.status(401).json({ error: error.message });
        }
        if (error.message.includes('Email not verified')) {
          return res.status(403).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Unknown server error' });
    }
  }
  
  static async verifyEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const { otp } = req.body;
      
      if (!otp) {
        return res.status(400).json({ error: 'Verification code is required' });
      }
      
      const result = await AuthService.verifyEmail(userId, otp);
      
      return res.status(200).json({
        message: 'Email verified successfully',
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Invalid or expired verification code') {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === 'User not found') {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Unknown server error' });
    }
  }
  
  static async resendVerificationOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      
      await AuthService.resendVerificationOTP(userId);
      
      return res.status(200).json({
        message: 'Verification code resent',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Unknown server error' });
    }
  }
}