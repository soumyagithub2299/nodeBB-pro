# FROM node:16-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --production
# COPY . .
# CMD ["./nodebb", "start"]


FROM node:18
WORKDIR /app
# Copy ALL files (except those in .dockerignore)
COPY . .
RUN npm install --omit=dev
CMD ["node", "loader.js"]