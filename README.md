# Product Management API

## Overview
A RESTful API for managing products with token-based authentication.

## Prerequisites
- Node.js
- Docker
- MongoDB
-JWT

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/product-management-api.git
   cd product-management-api
   ```

2. Install dependencies:

   npm install
   ```

3. Create a `.env` file with the following environment variables:
   PORT=your_port_number
   MONGODB_URI=mongodb://localhost:27017/product_store
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email_user                      
   EMAIL_PASSWORD=your_email_password
   ```

4. Run the application:
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   
   # Run with Docker
   docker-compose up --build
   ```

## API Documentation
For detailed API documentation, use Postman to explore the endpoints.

### Authentication Endpoints
#### Register a User
- **Endpoint:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `201`: User created
  - `400`: Validation error

#### Login a User
- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `200`: JWT Token
  - `401`: Invalid credentials

### Product Endpoints
#### Create a Product
- **Endpoint:** `POST /products`
- **Requires:** Authorization Header (JWT Token)
- **Request Body:**
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 19.99,
    "category": "Electronics",
    "stock": 100
  }
  ```
- **Responses:**
  - `201`: Product created
  - `400`: Validation error

#### Get All Products
- **Endpoint:** `GET /products`
- **Query Params:** `page`, `limit`, `category`, `minPrice`, `maxPrice`
- **Requires:** Authorization Header
- **Responses:**
  - `200`: List of products
  - `500`: Server error

#### Update a Product
- **Endpoint:** `PUT /products/:id`
- **Requires:** Authorization Header
- **Request Body:** Same as `POST /products`
- **Responses:**
  - `200`: Product updated
  - `404`: Product not found

#### Delete a Product
- **Endpoint:** `DELETE /products/:id`
- **Requires:** Authorization Header
- **Responses:**
  - `200`: Product deleted
  - `404`: Product not found

#### Purchase a Product
- **Endpoint:** `POST /products/buy`
- **Requires:** Authorization Header
- **Request Body:**
  ```json
  {
    "productId": "12345",
    "quantity": 2
  }
  ```
- **Responses:**
  - `200`: Purchase successful
  - `400`: Insufficient stock or validation error
  - `404`: Product not found

## Testing
To run tests:
```sh
npm test
```

## Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Input validation with Joi
- MongoDB query optimization
- Error logging with Winston

## Performance Considerations
- Indexed MongoDB collections
- Pagination for product listings
- Connection pool management
- Efficient querying with filters


