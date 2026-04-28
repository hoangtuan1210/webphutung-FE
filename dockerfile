# ─────────────────────────────────────────────
# Stage 1: Dependencies
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies only (leverages Docker layer cache)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# ─────────────────────────────────────────────
# Stage 2: Builder
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .


RUN npx next build

# ─────────────────────────────────────────────
# Stage 3: Runner (minimal production image)
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy built artifacts
COPY --from=builder /app/public      ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static  ./.next/static

# Set ownership
USER nextjs

EXPOSE 3000

ENV PORT=4112
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]