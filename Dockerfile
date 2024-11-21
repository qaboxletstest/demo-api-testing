FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:latest

WORKDIR /app
RUN npm install -g nodemon

COPY --from=build /app .

EXPOSE 5002

CMD ["sh", "/app/entry_point.sh"]