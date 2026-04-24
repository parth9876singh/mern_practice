# ===============================
# Stage 1: Build Dependencies
# ===============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy backend source code
COPY . .

# Optional: Run build/tests if needed
# RUN npm run build


# ===============================
# Stage 2: Production Runtime
# ===============================
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy application code from builder stage
COPY --from=builder /app ./

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose backend port
EXPOSE 3000

# Run as non-root user
USER node

# Start backend server
CMD ["npm", "start"]