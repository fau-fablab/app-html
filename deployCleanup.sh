#!/bin/bash
# this script should be called in repo base dir

rm -rvf index.html \
    docker \
    Dockerfile \
    .git \
    .travis.yml \
    build.sh \
    deployCleanup.sh \
    npm-debug.log

find ./ -name "*.ts" -exec rm -rvf {} +
