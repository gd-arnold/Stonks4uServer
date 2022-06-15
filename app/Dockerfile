# Build stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

# New build stage - copies only needed artifacts from the previous stage
FROM node:16-alpine

COPY --from=build --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/build /app/build

USER node

WORKDIR /app

ENV NODE_ENV=production

CMD [ "node", "build/index.js" ]