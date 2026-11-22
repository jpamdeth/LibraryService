FROM node:26.13.1 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.build.json ./tsconfig.build.json
COPY nest-cli.json ./nest-cli.json

RUN npm ci --ignore-scripts

RUN CHECKPOINT_DISABLE=1 npx prisma generate

COPY . .

RUN npm run build

FROM node:26.13.1

WORKDIR /app

ENV NODE_ENV=production
ENV CHECKPOINT_DISABLE=1

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN npm ci --ignore-scripts --omit=dev && npx prisma generate

EXPOSE 3000

CMD [ "npm", "run", "start:prod:migrate" ]
