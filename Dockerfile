FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies first to leverage layer caching
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# MONGO_URI, JWT_SECRET, MAP_API_KEY and CORS_ORIGIN are supplied at runtime
ENV PORT=8080
EXPOSE 8080

USER node
CMD ["node", "index.js"]
