#!/bin/bash

# run drupal-docker
docker run -d -p 80:80 -p 443:443 --name="fablab-html-apache" -t fablab-html  
