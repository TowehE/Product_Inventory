import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User';
import Product from '../src/models/Product';
import Database from '../src/config/database';
import { Server } from 'http';

let token: string;
let userId: string;
let testProductId: string;
let server: Server;

const testUserEmail = 'product-test@example.com';
const testProductName = 'Sample Test Product';

beforeAll(async () => {
  await Database.connect();
  server = app.listen(0);
  await User.deleteMany({ email: testUserEmail });
  await Product.deleteMany({ name: testProductName });

  const user = new User({
    email: testUserEmail,
    firstName: 'Product',
    lastName: 'Tester',
    password: await require('bcrypt').hash('password123', 10),
    isVerified: true,
    role: 'admin' 
  });
  
  await user.save();
  userId = user.id;


  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: testUserEmail,
      password: 'password123'
    });
  
  
  token = loginRes.body.token;
  
  const product = new Product({
    name: testProductName,
    description: 'A test product for Electronics category',
    price: 299.99,
    category: 'Electronics',
    stock: 50,
    createdBy: userId
  });
  
  await product.save();
  testProductId = product.id;

});

afterAll(async () => {
 
  await User.deleteMany({ email: testUserEmail });
  await Product.deleteMany({ name: testProductName });
  await new Promise(resolve => setTimeout(resolve, 500));

  if (server) {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
  await Database.disconnect();
});

describe('Product Routes', () => {
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
     
      
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          description: 'A test product description',
          price: 99.99,
          category: 'Testing',
          stock: 10
        });


      expect(res.statusCode).toEqual(201);
      expect(res.body.product).toHaveProperty('_id');
      expect(res.body.product.name).toEqual('Test Product');
    });

    // TRying differnt format
    it('should identify correct auth format', async () => {
      const formats = [
        { name: "Bearer with space", header: `Bearer ${token}` },
        { name: "Bearer without space", header: `Bearer${token}` },
      ];
      
      
      for (const format of formats) {
      
        const res = await request(app)
          .post('/api/products')
          .set('Authorization', format.header)
          .send({
            name: `Test Format ${format.name}`,
            description: 'Testing auth format',
            price: 99.99, 
            category: 'Testing',
            stock: 10
          });
     
        
        if (res.statusCode === 201 || res.statusCode === 200) {
          break;
        }
      }
    });
  });


  describe('GET /api/products/:id', () => {
    it('should retrieve a single product by ID', async () => {
      const res = await request(app)
        .get(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.product).toHaveProperty('_id', testProductId);
    });
  });

 
  describe('GET /api/products', () => {
    it('should retrieve all products with authentication', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.products).toBeDefined();
      expect(Array.isArray(res.body.products)).toBeTruthy();
    });
  });
});