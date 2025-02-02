FROM oven/bun:canary-alpine AS build
WORKDIR /ao-analytics-frontend

COPY package.json .
COPY bun.lock .
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:latest
COPY --from=build /ao-analytics-frontend/build /usr/share/nginx/html
