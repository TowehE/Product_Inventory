
import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://toweh02:oxPlViYIpb4I7GwB@cluster0.61j3xbb.mongodb.net/productmanagement',
  jwtSecret: process.env.JWT_SECRET || 'toweh',
  emailUser: process.env.EMAIL_USER || 'toweh02',
  emailPassword: process.env.EMAIL_PASSWORD || 'pxbm vtaz ktgo ukvv',

};