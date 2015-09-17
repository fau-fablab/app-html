FROM ubuntu:latest

ENV DEBIAN_FRONTEND noninteractive

# install packages
RUN apt-get update
RUN apt-get install -y apache2 libapache2-mod-php5 npm
RUN npm install -g typescript

RUN if [ ! -f "/usr/bin/node" ]; then ln -s /usr/bin/nodejs /usr/bin/node; fi

# copy all files to docker image
COPY docker/runApache.sh runApache.sh
COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf
COPY docker/apache-vhost-ssl.conf /etc/apache2/sites-available/default-ssl.conf
COPY docker/fablab_html_cert.pem /etc/ssl/certs/ssl-cert-snakeoil.pem
COPY docker/fablab_html_key.pem /etc/ssl/private/ssl-cert-snakeoil.key

# fix exec permissions
RUN chmod 755 /runApache.sh

# enable some apache settings
RUN a2ensite default-ssl
RUN a2enmod ssl
RUN a2enmod rewrite
RUN a2enmod proxy
RUN a2enmod proxy_http

# copy compile type script files
COPY ./ /var/www/html
RUN tsc --target es5 /var/www/html/js/*.ts /var/www/html/js/common/rest/*.ts /var/www/html/js/common/model/*.ts

#delete some files
RUN rm -rvf /var/www/html/index.html \
    /var/www/html/docker \
    /var/www/html/Dockerfile \
    /var/www/html/.git \
    /var/www/html/npm-debug.log

RUN find /var/www/html/ -name "*.ts" -exec rm -rvf {} +

EXPOSE 80 443

# run apache server
CMD ["/runApache.sh"]
