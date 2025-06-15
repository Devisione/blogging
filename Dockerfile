FROM node:18-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ./apps/frontend .
RUN yarn install

ENV PORT 8000

RUN yarn build

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 8000

CMD ["yarn", "start"]

