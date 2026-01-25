# Taken from https://www.docker.com/blog/how-to-dockerize-react-app/

# Stage 1: Build the React app
FROM node:24-trixie-slim AS build
WORKDIR /app

# Leverage caching by installing dependencies first
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application code and build for production
COPY . ./
RUN npm run build

# Stage 3: Production environment
FROM nginx:alpine AS production

# Copy the production build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]