FROM ubuntu:latest

ENV DEBIAN_FRONTEND noninteractive

# install packages
RUN apt-get update
RUN apt-get install -y apache2 libapache2-mod-php5 npm
RUN npm install -g typescript

RUN if [ ! -f "/usr/bin/node" ]; then ln -s /usr/bin/nodejs /usr/bin/node; fi

# copy all files to docker image
COPY docker/runApache.sh runApache.sh
COPY ./ /var/www/html

# fix exec permissions
RUN chmod 755 /runApache.sh

# compile type script files
RUN tsc --target es5 /var/www/html/js/*.ts

#delete some files
RUN rm -rvf /var/www/html/index.html
RUN rm -rvf /var/www/html/docker
RUN rm -rvf /var/www/html/Dockdefile
RUN rm -rvf /var/www/html/.git
RUN rm -rvf /var/www/html/js/*.ts

EXPOSE 80 443

# execute .start.sh and the start bash -- it works!
CMD ["/runApache.sh"]
