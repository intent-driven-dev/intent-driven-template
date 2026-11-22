'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createApp } = require('../src/app');

async function withApp(run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pollcast-unit-'));
  const dataFile = path.join(dir, 'polls.json');
  fs.writeFileSync(dataFile, JSON.stringify({ polls: [{ id: 'lunch', title: 'Lunch', options: ['Soup', 'Salad'] }] }));
  const server = createApp({ dataFile }).listen(0);
  try {
    await run({ baseUrl: `http://127.0.0.1:${server.address().port}`, dataFile });
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function vote(baseUrl, option, email) {
  return fetch(`${baseUrl}/polls/lunch/votes`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ option, email }),
  });
}

const votesIn = (dataFile) => JSON.parse(fs.readFileSync(dataFile, 'utf8')).polls[0].votes;

test('concurrent submissions from one email keep exactly one accepted vote', async () => {
  await withApp(async ({ baseUrl, dataFile }) => {
    const responses = await Promise.all(Array.from({ length: 25 }, (_, i) => vote(baseUrl, i % 2 ? 'Soup' : 'Salad', 'alex@example.com')));
    const statuses = responses.map((r) => r.status).sort();
    assert.equal(statuses.filter((s) => s === 201).length, 1);
    assert.equal(statuses.filter((s) => s === 409).length, 24);
    assert.equal(votesIn(dataFile).length, 1);
  });
});

test('concurrent submissions from different emails are all kept', async () => {
  await withApp(async ({ baseUrl, dataFile }) => {
    const responses = await Promise.all(Array.from({ length: 25 }, (_, i) => vote(baseUrl, 'Soup', `voter${i}@example.com`)));
    assert.ok(responses.every((r) => r.status === 201));
    assert.equal(votesIn(dataFile).length, 25);
  });
});

test('a retry after a successful vote is rejected as a duplicate', async () => {
  await withApp(async ({ baseUrl, dataFile }) => {
    assert.equal((await vote(baseUrl, 'Soup', 'alex@example.com')).status, 201);
    assert.equal((await vote(baseUrl, 'Soup', 'alex@example.com')).status, 409);
    assert.equal(votesIn(dataFile).length, 1);
  });
});
