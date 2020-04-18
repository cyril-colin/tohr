#!/usr/bin/env bash
set -e
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
BUILD_NAME="Tohr-${PACKAGE_VERSION}.tgz"
BIN_DIR="bin"
BUILD_DIR="${BIN_DIR}/$BUILD_NAME"
MODE=${1}

if [ ${MODE} = "--prod" ]
then
  git diff --exit-code || { echo "Some files are not commited !";  exit 1; }
fi


# Clear and prepare directories
rm -rf dist-*
rm -f ${BUILD_DIR}
mkdir -p dist-back dist-front
mkdir -p ${BIN_DIR}

# Build back-end
./node_modules/.bin/tsc --build tsconfig-back.json || { echo "Back build failed.";  exit 1; }
cp back/prod-package.json dist-back/package.json
(cd dist-back && npm install --only=production)
echo -e '#!/usr/bin/env node\n'$(cat dist-back/server.js) > dist-back/server.js

# Build front-end
ng build --prod || { echo "Front build failed.";  exit 1; }

# Create the package
echo "${PACKAGE_VERSION}" > dist-front/assets/version.txt
# zip to publish
tar zcf bin/${BUILD_NAME} dist-back dist-front || { echo "Tar failed";  exit 1; }


# Publish tag and docker
if [ ${MODE} = "--prod" ]
then
  git tag -a ${PACKAGE_VERSION} -m "${PACKAGE_VERSION}" || { echo "Cannot tag version ${PACKAGE_VERSION}";  exit 1; }
  git push origin --tags || { echo "Cannot push tags";  exit 1; }
  docker build . -t coyotetuba/tohr:${PACKAGE_VERSION} || { echo "Cannot build docker image";  exit 1; }
  docker push coyotetuba/tohr:${PACKAGE_VERSION} || { echo "Cannot push docker image";  exit 1; }
fi

set +e







