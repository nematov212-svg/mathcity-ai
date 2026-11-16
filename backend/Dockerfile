# ==============================================================================
# MathCity AI — Production Multi-Stage Dockerfile (Node.js + TypeScript)
# ==============================================================================

# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy source code and build
COPY src ./src
RUN npx prisma generate
RUN npm run build


# STAGE 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Security: Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and compiled output from builder
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npx prisma generate

COPY --from=builder /app/dist ./dist

# Set user permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Health probe check
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health/live || exit 1

CMD ["node", "dist/server.js"]
