FROM node:16

WORKDIR /app
COPY . .
RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]