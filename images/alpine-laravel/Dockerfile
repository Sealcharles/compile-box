FROM milenium1/alpine-laravel-base
MAINTAINER sealcharles77 <sealcharles77@gmail.com>

RUN apk add --update nodejs nodejs-npm

ADD . /var/www/

RUN mkdir /var/www/project

WORKDIR /var/www/localhost/htdocs/nodeJsTree/

RUN npm install && npm cache  --force clean

EXPOSE 80 3306 3000 22
  
CMD node server.js