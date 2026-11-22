'use strict';

const { setWorldConstructor } = require('@cucumber/cucumber');
const pollStore = require('./poll-store');
const { PollPage } = require('./pages/poll-page');

class PollCastWorld {
  constructor() {
    this.baseUrl = global.__pollcast.baseUrl;
    this.dataFile = global.__pollcast.dataFile;
    this.pollIds = new Map();
    this.pollStore = pollStore;
    this.pollPage = new PollPage(this.baseUrl);
  }
}

setWorldConstructor(PollCastWorld);
