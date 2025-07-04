FROM node:22-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*json tsconfig.json src  ./

RUN npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/ /app/
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
COPY static/ /app/dist/static/

WORKDIR /app/dist/

ENV AIKIDO_BLOCK="true"

USER hono
EXPOSE 3000

CMD ["node", "index.js"]
