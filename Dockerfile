# Use an extremely lightweight Node Alpine image
FROM node:20-alpine

WORKDIR /app

# Only copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm install --production

# Copy the server code
COPY server.js .

# Expose the port
EXPOSE 3000

# Start the stateless engine
CMD ["npm", "start"]
