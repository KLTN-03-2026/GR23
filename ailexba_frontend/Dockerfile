FROM node:22-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=development

EXPOSE 3000

CMD ["bash", "-lc", "if [ -f package-lock.json ]; then npm ci; else npm install; fi && exec npm run dev -- --hostname 0.0.0.0 --port 3000"]
