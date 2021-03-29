FROM registry.access.redhat.com/ubi8/nodejs-12:1-36

USER root

RUN useradd --uid 1000 --gid 0 --shell /bin/bash --create-home node

WORKDIR "/project/user-app"

COPY package.json .
RUN npm install --production  && chown -hR node:0 /project  && chmod -R g=u /project

COPY . .

ENV NODE_ENV production

USER node

EXPOSE 3000 3000

CMD ["npm", "start"]
