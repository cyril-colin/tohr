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
tar zcf bin/${BUILD_NAME} dist-back dist-front || { echo "Tar failed";  exit 1; }


if [ ${MODE} = "--prod" ]
then
  GH_TAGS="https://api.github.com/repos/cyril-colin/tohr/releases/tags/${PACKAGE_VERSION}"
  TOKEN=$(cat github-token.txt) || { echo "TOKEN file not found";  exit 1; }
  AUTH="Authorization: ${TOKEN}"
  curl -H "Authorization: token ${TOKEN}" "https://api.github.com/repos/cyril-colin/tohr" || { echo "Error: Invalid repo, token or network issue!";  exit 1; }

  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  curl -H "Authorization: token ${TOKEN}" "https://api.github.com/repos/cyril-colin/tohr/releases" \
  --data '{"tag_name": "'${PACKAGE_VERSION}'","target_commitish": "'${CURRENT_BRANCH}'", "name": "'${BUILD_NAME}'", "body": "Generated by script", "draft": false, "prerelease": true }' || { echo "Error on release creation";  exit 1; }

  # Read asset tags.
  response=$(curl -H "Authorization: token ${TOKEN}" $GH_TAGS)
  # Get ID of the asset based on given filename.
  eval $(echo "$response" | grep -m 1 "id.:" | grep -w id | tr : = | tr -cd '[[:alnum:]]=')
  [ "$id" ] || { echo "Error: Failed to get release id for tag: ${PACKAGE_VERSION}"; echo "$response" | awk 'length($0)<100' >&2; exit 1; }

  GH_ASSET="https://uploads.github.com/repos/cyril-colin/tohr/releases/${id}/assets?name=${BUILD_NAME}"
  curl -v --data-binary @"${BUILD_DIR}" -H "Authorization: token ${TOKEN}" -H "Content-Type: application/octet-stream" $GH_ASSET
fi

set +e







