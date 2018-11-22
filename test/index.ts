/// <reference types="webpack-env" />

// require all modules ending in ".test.ts" from the
// current directory and all subdirectories
const testsContext = require.context(".", true, /\.test\.ts$/);

testsContext.keys().forEach(testsContext);
