FROM milenium1/alpine-lamp-base-image

MAINTAINER sealcharles77@gmail.com

RUN cd /

RUN mkdir -p /production/app

RUN mkdir -p /production/project 

WORKDIR /production/app

ADD app /production/app

RUN chmod -R 777 run.sh

RUN npm install && npm cache clean

EXPOSE 80 3000 3306

CMD ./run.sh
