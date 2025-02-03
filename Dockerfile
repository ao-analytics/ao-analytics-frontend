FROM oven/bun:canary-alpine AS build
WORKDIR /ao-analytics-frontend

COPY package.json .
COPY bun.lock .
RUN bun install --frozen-lockfile
COPY . .

ENV PUBLIC_BACKEND_URL=REPLACE_PUBLIC_BACKEND_URL
ENV PUBLIC_RENDER_URL=REPLACE_PUBLIC_RENDER_URL
RUN bun run build

FROM nginx:latest
WORKDIR /etc/nginx

COPY docker/nginx.conf nginx.conf
COPY docker/entrypoint /docker-entrypoint.d

COPY --from=build /ao-analytics-frontend/build /usr/share/nginx/html
