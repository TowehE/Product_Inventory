import mongoose from 'mongoose';
import env from './env';

class Database {
  private static isConnected = false;
  public static async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        console.log('Already connected to MongoDB');
        return;
      }

      if (!env.mongodbUri) {
        throw new Error('MongoDB URI is missing in environment variables.');
      }
      await mongoose.connect(env.mongodbUri);
      this.isConnected = true;
      console.log('Connected to MongoDB Successfully!');

       } catch (error) {
            console.error('MongoDB connection error:', error);
            this.isConnected = false;
          
            if (process.env.NODE_ENV !== 'test') {
              process.exit(1);
            } else {
              throw error; 
            }
          }
        }

 

  public static async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close(true);
      await mongoose.disconnect(); 
      console.log('Disconnected from DB');
    } catch (error) {
      console.error('Error disconnecting from DB:', error);
    }
  }
}

export default Database;