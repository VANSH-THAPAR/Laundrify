# Use Node.js base image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose backend port (inside container)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
