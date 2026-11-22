'use strict';

const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('an existing poll {string} has the option {string}', function (title, option) {
  this.pollIds.set(title, this.pollStore.seedPollWithOption(this.dataFile, title, option));
  this.currentPollId = this.pollIds.get(title);
});

When('a participant votes for {string} in {string} using {string}', async function (option, title, email) {
  this.currentPollId = this.pollIds.get(title);
  await this.pollPage.submitVote(this.currentPollId, option, email);
});

Then('the vote is accepted and confirmed', function () {
  assert.equal(this.pollPage.status(), 201);
  assert.ok(this.pollPage.confirmation(), 'expected a confirmation message');
});

Then('{string} has one vote in {string}', async function (option, title) {
  await this.pollPage.open(this.pollIds.get(title));
  assert.equal(this.pollPage.votesFor(option), 1);
});

Given('{string} has voted for {string} in the poll {string}', function (email, option, title) {
  this.pollIds.set(title, this.pollStore.seedVote(this.dataFile, title, option, email));
  this.currentPollId = this.pollIds.get(title);
  this.lastVoter = email;
});

Given('{string} has voted in the poll {string}', function (email, title) {
  this.pollIds.set(title, this.pollStore.seedVote(this.dataFile, title, 'Soup', email));
});

Then('the vote is rejected as a duplicate', function () {
  assert.equal(this.pollPage.status(), 409);
  assert.match(this.pollPage.rejection(), /already/i);
});

Then('the vote for {string} remains unchanged', async function (option) {
  await this.pollPage.open(this.currentPollId);
  assert.equal(this.pollPage.votesFor(option), 1);
  assert.equal(this.pollPage.totalVotes(), 1);
});

When('a participant attempts to change that vote to {string}', async function (option) {
  await this.pollPage.attemptChange(this.currentPollId, option, this.lastVoter);
});

Then('the change is rejected', function () {
  assert.equal(this.pollPage.status(), 405);
});
