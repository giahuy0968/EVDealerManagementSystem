FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force
COPY tsconfig.json ./
COPY src ./src
RUN npm run build || npx tsc
EXPOSE 3000
CMD ["node", "dist/server.js"]
