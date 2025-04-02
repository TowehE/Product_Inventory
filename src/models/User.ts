import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isVerified: boolean;
  verificationOTP: string | null; 
  otpExpires: Date | null;
  createdAt: Date;
  blacklist: string[];
  role: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true, 
    index:true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user'
  },
  otpExpires: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  blacklist: {
    type: [String],
    default: [],
  }
});



export default mongoose.model<IUser & mongoose.Document>('User', userSchema);
