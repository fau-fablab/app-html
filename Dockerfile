FROM ubuntu:latest

ENV DEBIAN_FRONTEND noninteractive

# install packages
RUN apt-get update && \
    apt-get install -y apache2 libapache2-mod-php5 npm && \
    npm install -g typescript

RUN if [ ! -f "/usr/bin/node" ]; then ln -s /usr/bin/nodejs /usr/bin/node; fi

# enable some apache settings
RUN a2ensite default-ssl
RUN a2enmod ssl rewrite proxy proxy_http

# copy all files to docker image
COPY ./docker/runApache.sh /runApache.sh
COPY ./docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf
COPY ./docker/apache-vhost-ssl.conf /etc/apache2/sites-available/default-ssl.conf
COPY ./docker/fablab_html_cert.pem /etc/ssl/certs/ssl-cert-snakeoil.pem
COPY ./docker/fablab_html_key.pem /etc/ssl/private/ssl-cert-snakeoil.key

# fix exec permissions
RUN chmod 755 /runApache.sh

# copy compile type script files
COPY ./ /var/www/html
RUN cd /var/www/html && ./build.sh

# delete some files
RUN cd /var/www/html && ./deployCleanup.sh

EXPOSE 80 443

# run apache server
CMD ["/runApache.sh"]
