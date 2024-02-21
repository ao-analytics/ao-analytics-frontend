FROM node:20-alpine
WORKDIR /ao-analytics-frontend

EXPOSE 80
EXPOSE 443

COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
COPY .env.prod .env
RUN npm run build

CMD ["node", "-r", "dotenv/config", "build" ]