FROM node:22.12.0

WORKDIR /app/
COPY ./package.json ./package-lock.json* ./
RUN npm install

COPY --chmod=777 . .
RUN npm run generate

CMD ["npm", "start"]
