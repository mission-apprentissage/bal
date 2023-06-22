# Rebuild the source code only when needed
FROM bal_root:latest AS builder
WORKDIR /app

COPY .yarn .yarn
COPY ./ui ./ui
COPY ./shared ./shared

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn --cwd ui build
# Removing dev dependencies
RUN yarn workspaces focus --all --production

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/ui/public ./ui/public
COPY --from=builder /app/ui/package.json ./ui/package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/ui/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/ui/.next/static ./ui/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "ui/server"]
