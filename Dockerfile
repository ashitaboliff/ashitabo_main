FROM node:22-alpine3.21
WORKDIR /app/
COPY ./package.json ./package-lock.json* ./
RUN npm install
COPY --chmod=777 . .
RUN npm run generate