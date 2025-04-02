# Use the official Node.js image as a base
FROM node:14

# Set working directory
WORKDIR /src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Argument for env
ARG MONGODB_URI

# env
ENV MONGODB_URI=${MONGODB_URI}

# Start the application
CMD ["npm", "run", "dev"]