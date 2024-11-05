FROM node:18

WORKDIR /app

RUN npm install -g http-server

COPY . .

EXPOSE 9090

CMD ["http-server", ".", "-p", "9090", "-a", "0.0.0.0"]