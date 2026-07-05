FROM node:26 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.build.json ./tsconfig.build.json
COPY nest-cli.json ./nest-cli.json

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:26

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN npm ci --omit=dev && npx prisma generate

ENV DATABASE_URL=mysql://library:library@nest-mysql:3306/library

EXPOSE 3000

CMD [ "npm", "run", "start:prod:migrate" ]
