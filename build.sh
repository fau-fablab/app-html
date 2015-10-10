#!/bin/bash

echo Calling TypeScript compiler...
tsc -target es5 js/*.ts js/common/rest/*.ts js/common/model/*.ts
