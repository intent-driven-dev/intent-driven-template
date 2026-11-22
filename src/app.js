'use strict';

const express = require('express');

function createApp({ dataFile }) {
  const app = express();
  app.locals.dataFile = dataFile;
  return app;
}

module.exports = { createApp };
