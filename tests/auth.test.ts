import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User';
import Database from '../src/config/database';
import bcrypt from 'bcrypt';
import { Server } from 'http';

jest.setTimeout(30000);

let userId: string;
let token: string;
let server: Server;

const testUser = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'password123'
};

const newUser = {
  email: 'newuser@example.com',
  firstName: 'New',
  lastName: 'User',
  password: 'password123'
};

beforeAll(async () => {
  await Database.connect();

  server = app.listen(0); 
  await User.deleteMany({
    email: { $in: [testUser.email, newUser.email, 'unverified@example.com'] }
  });
  
 
  const user = new User({
    email: testUser.email,
    firstName: testUser.firstName,
    lastName: testUser.lastName,
    password: await bcrypt.hash(testUser.password, 10),
    isVerified: true 
  });
  
  await user.save();
  userId = user.id;
});

afterAll(async () => {
  await User.deleteMany({
    email: { $in: [testUser.email, newUser.email, 'unverified@example.com'] }
  });
  await new Promise(resolve => setTimeout(resolve, 500));
  if (server) {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
  await Database.disconnect();
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          password: newUser.password
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('userId');
    });
    
    it('should not register a user with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('error', 'User already exists');
    });
    
    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          firstName: 'Test',
          lastName: 'User',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
   
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
    });
    
    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
    });
    
    it('should require email verification', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'unverified@example.com',
          firstName: 'Unverified',
          lastName: 'User',
          password: 'password123'
        });
      
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unverified@example.com',
          password: 'password123'
        });
      
      expect(loginRes.statusCode).toEqual(403);
      expect(loginRes.body.error).toContain('Email not verified');
    });
  });
});