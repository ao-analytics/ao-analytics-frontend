#!/bin/sh

sed -i "s|REPLACE_PUBLIC_BACKEND_URL|${PUBLIC_BACKEND_URL}|g" /usr/share/nginx/html/_app/env.js
sed -i "s|REPLACE_PUBLIC_RENDER_URL|${PUBLIC_RENDER_URL}|g"  /usr/share/nginx/html/_app/env.js
