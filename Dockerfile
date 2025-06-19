ARG NODE_VERSION=23.9.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
EXPOSE 3000

FROM base as prod

# Copy dependency files first
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of your app
COPY . .

# Use non-root user
USER node

# Run the app
CMD ["node","--require","./instrumentation.js", "index.js"]
