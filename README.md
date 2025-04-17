# Product Management API

## Overview
A role-based RESTful API for creating and managing products using token-based authentication.

##BASE_URL: https://inventora-shopy.onrender.com

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
You can finf the API documetation here:
https://documenter.getpostman.com/view/31029158/2sB2cSfiHu


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


