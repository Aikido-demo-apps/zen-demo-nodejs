# Base image
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Create the necessary folder
RUN mkdir -p /usr/uploads/tenant/1/files/

RUN chown -R node:node /usr/uploads/tenant/1/files/
RUN chmod -R 755 /usr/uploads/tenant/1/files/


EXPOSE 3000

ENV NODE_ENV production

# Start the server using the production build
CMD ["npm", "run", "start:prod"]