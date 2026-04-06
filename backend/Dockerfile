# ── Stage 1: Build ───────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first for layer caching
COPY package.json nest-cli.json tsconfig.json ./
COPY apps/gateway ./apps/gateway
COPY apps/auth    ./apps/auth
COPY apps/catalog ./apps/catalog
COPY apps/orders  ./apps/orders
COPY apps/content ./apps/content
COPY apps/social  ./apps/social
COPY libs         ./libs

RUN npm install --ignore-scripts

# Build the gateway (entry point)
RUN npx nest build gateway

# ── Stage 2: Production image ─────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Only copy production deps + built output
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/apps/gateway/src/main"]
