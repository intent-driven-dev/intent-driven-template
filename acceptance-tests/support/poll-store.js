'use strict';

const fs = require('node:fs');

// Test setup only: writes poll fixtures straight to the application's JSON store.
// Poll creation is outside this change, so polls are seeded rather than created via the UI.
function slug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function read(dataFile) {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function reset(dataFile) {
  fs.writeFileSync(dataFile, JSON.stringify({ polls: [] }));
}

function seedPollWithOption(dataFile, title, option) {
  const data = read(dataFile);
  let poll = data.polls.find((p) => p.title === title);
  if (!poll) {
    poll = { id: slug(title), title, options: [] };
    data.polls.push(poll);
  }
  poll.options.push(option);
  fs.writeFileSync(dataFile, JSON.stringify(data));
  return poll.id;
}

// Records a previously cast vote, creating the poll with that option when it does not exist yet.
function seedVote(dataFile, title, option, email) {
  let data = read(dataFile);
  if (!data.polls.some((p) => p.title === title)) {
    seedPollWithOption(dataFile, title, option);
    data = read(dataFile);
  }
  const poll = data.polls.find((p) => p.title === title);
  if (!poll.options.includes(option)) poll.options.push(option);
  poll.votes = [...(poll.votes || []), { option, email }];
  fs.writeFileSync(dataFile, JSON.stringify(data));
  return poll.id;
}

module.exports = { reset, seedPollWithOption, seedVote };
