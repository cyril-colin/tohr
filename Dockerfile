FROM coyotetuba/ts-node-dev:latest AS builder
WORKDIR /tohr
COPY . .
RUN mkdir -p dist-back dist-front
RUN npm install

# Build the backend
RUN tsc --build back/tsconfig.json
RUN cp back/prod-package.json dist-back/package.json
RUN (cd dist-back && npm install --only=production)

# Run backend tests
RUN ./node_modules/.bin/jest --coverage --config=back/jest.config.js

# Build the frontend
RUN /tohr/node_modules/@angular/cli/bin/ng build --prod
RUN cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]' > dist-front/assets/version.txt


# Build the application from previous compiled files
FROM node:13
WORKDIR /tohr
RUN mkdir ./dist-back
RUN mkdir ./dist-front
COPY --from=builder /tohr/dist-back ./dist-back
COPY --from=builder /tohr/dist-front ./dist-front

CMD [ "node", "./dist-back/server.js" ]


