FROM node:20 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./tsconfig.json

# Install app dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:20

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN npm install prisma
ENV DATABASE_URL=mysql://library:library@nest-mysql:3306/library

EXPOSE 3000

CMD [ "npm", "run", "startup" ]