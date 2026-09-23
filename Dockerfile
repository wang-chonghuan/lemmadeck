# Root Dockerfile and build context are the Render deployment contract.
# The web app is a standalone project in app/; no repo-root package.json exists.
FROM node:24-alpine AS build
WORKDIR /app
# install from the app's own manifest + lockfile (context paths are repo-root relative)
COPY app/package.json app/package-lock.json ./
RUN npm ci
COPY app/ ./
# Repo-level source of truth the app imports through the @ssot alias. Mirrors the
# repo layout — repo root → /, app/ → /app — so ../ssot-resources resolves here
# exactly as it does in a checkout.
COPY ssot-resources/ /ssot-resources/
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
# tanstack-start build output
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
