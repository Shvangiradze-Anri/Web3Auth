# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the backend port
EXPOSE 5000

# Command to run the backend
CMD ["npx", "nodemon", "server.js"]

