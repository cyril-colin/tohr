#!/bin/bash
VERSION='1.0.0'
rm -rf dist-*

npm run back-build
cp package.json dist-back
(cd dist-back && npm install --only=production)
echo -e '#!/usr/bin/env node\n'$(cat dist-back/server.js) > dist-back/server.js

(cd front && ng build --prod)

mkdir -p bin
tar zcf bin/Tohr-${VERSION}.tar.gz dist-back dist-front



