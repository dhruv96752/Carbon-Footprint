# Stage 1: Build the Vite React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the app (Vite outputs to /app/dist)
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the custom Nginx template
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy the build artifacts from the build stage to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default, but Cloud Run will map $PORT dynamically)
EXPOSE 80
