FROM node:20-alpine
WORKDIR /ao-analytics-frontend

EXPOSE 80
EXPOSE 443

COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

CMD ["node", "build" ]
