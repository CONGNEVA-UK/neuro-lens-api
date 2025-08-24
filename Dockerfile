# ---- base image ----
FROM node:20-alpine

# ---- app dir ----
WORKDIR /app

# ---- install deps (use lockfile if present) ----
COPY package*.json ./
# Try ci first (faster & reproducible), fallback to install
RUN npm ci --omit=dev || npm install --omit=dev

# ---- copy the rest of the source (INCLUDES public/) ----
COPY . .

# ---- runtime ----
ENV PORT=3000
EXPOSE 3000
CMD ["node", "index.js"]
