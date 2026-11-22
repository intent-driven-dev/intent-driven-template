'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { startApp, stopApp } = require('./app-process');

let app;
let dataDir;

BeforeAll({ timeout: 15000 }, async function () {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pollcast-'));
  const dataFile = path.join(dataDir, 'polls.json');
  fs.writeFileSync(dataFile, JSON.stringify({ polls: [] }));
  app = await startApp({ dataFile });
  global.__pollcast = { baseUrl: app.baseUrl, dataFile };
});

AfterAll(async function () {
  if (app) await stopApp(app.child);
  if (dataDir) fs.rmSync(dataDir, { recursive: true, force: true });
});
