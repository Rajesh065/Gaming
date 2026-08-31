# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/game-engine/package*.json ./packages/game-engine/
COPY apps/server/package*.json ./apps/server/
COPY apps/web/package*.json ./apps/web/

RUN npm install

# Copy source code
COPY . .

# Build all monorepo workspaces
RUN npm run build --workspaces --if-present

# Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=base /app ./

EXPOSE 3000 4000

CMD ["npm", "start"]
