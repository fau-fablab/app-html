# fablab-html [![Build Status](https://travis-ci.org/FAU-Inf2/fablab-html.svg)](https://travis-ci.org/FAU-Inf2/fablab-html)
fablab-html is an TypeScript and HTML5 based web application that uses a [Dropwizard](http://www.dropwizard.io) based [REST-server](https://github.com/FAU-Inf2/fablab-server).

## How to install

It can be installed using two different methods.

###1. Using Docker container

Docker container can be created and started using scripts in the "[docker](https://github.com/FAU-Inf2/fablab-html/blob/master/docker)" subdirectory. Inside the docker container an apache server will be started using the configuration provided. It will start a web server listening on port 80 (http) and 443 (https). mod_rewrite will be used to forward http requests to https. mod_proxy will be used to forward requests to the [REST-Server](https://github.com/FAU-Inf2/fablab-server). URL to REST-Server should be changed in [apache-vhost-ssl.conf](https://github.com/FAU-Inf2/fablab-html/blob/master/docker/apache-vhost-ssl.conf).

SSL Certificates for apache web server should be placed in [docker](https://github.com/FAU-Inf2/fablab-html/blob/master/docker) subdirectory. There is a [helper script](https://github.com/FAU-Inf2/fablab-html/blob/master/docker/export_cert.sh) available to export a certificate from a Java keystore.

###2. Using existing apache instance

Required is an apache server with following modules (other web servers should work as well, if they support redirecting requests similar to mod_proxy):
- mod_php
- mod_proxy

For use with ssl (recommended) there might be additional modules required:
- mod_ssl
- mod_rewrite

To forward all requests to the [REST-Server](https://github.com/FAU-Inf2/fablab-server) configuration of mod_proxy is required. Example configuration:
```
SSLProxyEngine On
ProxyRequests Off
ProxyPreserveHost On

# specify endpoint to rest server vis mod_proxy:
ProxyPass /api https://url.to.rest.server.de:433
ProxyPassReverse /api https://url.to.rest.server.de:433
```

TypeScript files need to be compiled by the TypeScript compiler.
```
tsc --target es5 js/*.ts js/common/rest/*.ts js/common/model/*.ts
```

To cleanup the mess before deploying the sources to the web server root some files and directories can be removed
```
rm -rvf docker Dockerfile .git
find ./ -name "*.ts" -exec rm -rvf {} +
```
## License
    
## Contact
Feel free to contact us: fablab@i2.cs.fau.de
