# Basis-Image für Node.js
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

# Install debugging tools
RUN apt-get update && apt-get install -y iputils-ping netcat-openbsd

# Copy public assets to the appropriate location
COPY public /usr/src/app/public

EXPOSE 29101

CMD ["node", "server.js"]
