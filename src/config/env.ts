
import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI ,
  jwtSecret: process.env.JWT_SECRET || 'toweh',
  emailUser: process.env.EMAIL_USER || 'toweh02',
  emailPassword: process.env.EMAIL_PASSWORD 

};