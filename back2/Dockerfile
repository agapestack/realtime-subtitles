FROM node:18.10.0
WORKDIR /src
COPY package.json .
RUN npm install\
    && npm install typescript -g
COPY . .
RUN tsc
RUN npm run build
CMD ["npm", "run" , "start"]
