FROM ubuntu:latest

ENV DEBIAN_FRONTEND noninteractive

# install packages
RUN apt-get update
RUN apt-get install -y apache2 libapache2-mod-php5

# copy all files to docker image
COPY docker/runApache.sh runApache.sh
COPY ./ /var/www/html

# fix exec permissions
RUN chmod 755 /runApache.sh

#delete some files
RUN rm -rvf /var/www/html/index.html
RUN rm -rvf /var/www/html/docker
RUN rm -rvf /var/www/html/Dockdefile
RUN rm -rvf /var/www/html/.git

EXPOSE 80 443

# execute .start.sh and the start bash -- it works!
CMD ["/runApache.sh"]
