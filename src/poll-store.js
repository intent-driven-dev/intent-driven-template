'use strict';

const fs = require('node:fs/promises');

// Serializes every read-modify-write of the JSON store within this process.
let queue = Promise.resolve();
function serialized(task) {
  const result = queue.then(task);
  queue = result.catch(() => {});
  return result;
}

async function readData(dataFile) {
  return JSON.parse(await fs.readFile(dataFile, 'utf8'));
}

// Persist a complete replacement through a temporary file and an atomic rename.
async function writeData(dataFile, data) {
  const temporary = `${dataFile}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(data));
  await fs.rename(temporary, dataFile);
}

function votesOf(poll) {
  return poll.votes || [];
}

// Totals are derived from the accepted votes; there is no separate counter.
function withTotals(poll) {
  const votes = votesOf(poll);
  return { ...poll, totals: Object.fromEntries(poll.options.map((o) => [o, votes.filter((v) => v.option === o).length])) };
}

async function findPoll(dataFile, pollId) {
  const data = await readData(dataFile);
  const poll = data.polls.find((p) => p.id === pollId);
  return poll ? withTotals(poll) : null;
}

// Email identity within a poll: surrounding whitespace ignored, case-insensitive.
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// The duplicate check and the write happen in one serialized unit.
// Resolves to 'recorded' or 'duplicate'; an accepted vote is never modified.
function recordVote(dataFile, pollId, option, email) {
  return serialized(async () => {
    const data = await readData(dataFile);
    const poll = data.polls.find((p) => p.id === pollId);
    const identity = normalizeEmail(email);
    if (votesOf(poll).some((v) => normalizeEmail(v.email) === identity)) return 'duplicate';
    poll.votes = [...votesOf(poll), { option, email: identity }];
    await writeData(dataFile, data);
    return 'recorded';
  });
}

async function hasVoted(dataFile, pollId, email) {
  const data = await readData(dataFile);
  const poll = data.polls.find((p) => p.id === pollId);
  return votesOf(poll).some((v) => normalizeEmail(v.email) === normalizeEmail(email));
}

module.exports = { findPoll, recordVote, hasVoted };
