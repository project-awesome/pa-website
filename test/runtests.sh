#!/usr/bin/env bash
mocha test/node-unit/env_vars.js && \
mocha test/node-unit/models/*.js && \
mocha test/node-unit/api/*.js  --timeout 10000 && \
protractor test/e2e/config.js && \
./node_modules/.bin/karma start --single-run --browsers PhantomJS