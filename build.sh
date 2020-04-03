#!/bin/bash
BUILD_NAME='Tohr-1.0.2-dev11.tgz'
rm -rf dist-*

mkdir -p dist-back dist-front
npm run back-build
cp back/prod-package.json dist-back/package.json
(cd dist-back && npm install --only=production)
echo -e '#!/usr/bin/env node\n'$(cat dist-back/server.js) > dist-back/server.js

(cd front && ng build --prod)

mkdir -p bin
tar zcf bin/${BUILD_NAME} dist-back dist-front



