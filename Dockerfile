# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
# Cache mount + generous retry settings: on a flaky connection a retry reuses
# already-downloaded packages instead of restarting the install from zero.
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000
RUN --mount=type=cache,target=/root/.npm npm install

COPY . .

EXPOSE 5173

# --host so the dev server accepts connections from outside the container,
# not just localhost inside it.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
