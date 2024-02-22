FROM node:20 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./tsconfig.json

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:20

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json

RUN npm install prisma
ENV DATABASE_URL=mysql://root:rootTopsecret@nest-mysql:3306/beatsheet
ENV OPENAI_API_KEY=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

EXPOSE 3000

CMD [ "npm", "run", "startup" ]