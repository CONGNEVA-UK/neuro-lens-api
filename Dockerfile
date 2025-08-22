FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm install --only=production

# Copy the rest
COPY . .

# Koyeb expects the app to listen on 0.0.0.0 and the port it maps.
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
