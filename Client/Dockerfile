# Step 1: Base image
FROM node:20.18.0 AS builder

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Step 4: Copy all source code
COPY . .

# Step 5: Expose port for Vite dev server
EXPOSE 5173

# Step 6: Enable file watching for hot reload
ENV CHOKIDAR_USEPOLLING=true

# Step 7: Run the Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
