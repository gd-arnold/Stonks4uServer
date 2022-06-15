# Build stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

# New build stage - copies only the needed artifacts from the previous stage
FROM node:16-alpine

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/.env /app/.env

WORKDIR /app

ENV NODE_ENV=production

CMD [ "node", "build/index.js" ]