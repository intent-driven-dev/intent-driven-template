'use strict';

const path = require('node:path');
const { createApp } = require('./app');

const dataFile = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'polls.json');
const app = createApp({ dataFile });

const server = app.listen(Number(process.env.PORT || 3000), () => {
  console.log(`PollCast listening on ${server.address().port}`);
});
