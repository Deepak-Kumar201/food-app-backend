FROM node:22.4.1-alpine
WORKDIR /home/server
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 5000