# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Build the frontend
RUN npm run build

# Expose port for frontend
EXPOSE 5173

# Serve frontend using a simple HTTP server
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
