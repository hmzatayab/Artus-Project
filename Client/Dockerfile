# Step 1: Base image
FROM node:20.18.0 AS builder

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files
COPY package.json package-lock.json ./

# Step 4: Change npm registry for better connectivity
RUN npm config set registry http://registry.npmjs.org/
RUN npm install --legacy-peer-deps --force

# Step 5: Copy all source code
COPY . .

# Step 6: Expose port for Vite dev server
EXPOSE 5173

# Step 7: Enable file watching for hot reload
ENV CHOKIDAR_USEPOLLING=true

# Step 8: Run the Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
