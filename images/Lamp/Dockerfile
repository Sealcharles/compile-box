FROM sealcharles77/lamp-alpine

MAINTAINER <sealcharles77@gmail.com>

RUN mkdir -p /usr/share/webapps/

RUN cd /usr/share/webapps

RUN curl -sL http://files.directadmin.com/services/all/phpMyAdmin/phpMyAdmin-4.5.0.2-all-languages.tar.gz && \
    tar zxvf phpMyAdmin-4.5.0.2-all-languages.tar.gz && \
    rm phpMyAdmin-4.5.0.2-all-languages.tar.gz && \
    mv phpMyAdmin-4.5.0.2-all-languages phpmyadmin && \
    chmod -R 777 /usr/share/webapps/ && \
    ln -s /usr/share/webapps/phpmyadmin/ /var/www/phpmyadmin

RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \ apk add nodejs -y

EXPOSE 80

CMD httpd -V











    