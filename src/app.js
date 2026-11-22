'use strict';

const express = require('express');
const { findPoll, recordVote, hasVoted } = require('./poll-store');
const { pollPage, notFoundPage } = require('./views');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createApp({ dataFile }) {
  const app = express();
  app.locals.dataFile = dataFile;
  app.use(express.urlencoded({ extended: false }));

  app.get('/polls/:pollId', async (req, res) => {
    const poll = await findPoll(dataFile, req.params.pollId);
    if (!poll) return res.status(404).send(notFoundPage());
    res.send(pollPage(poll));
  });

  app.post('/polls/:pollId/votes', async (req, res) => {
    const poll = await findPoll(dataFile, req.params.pollId);
    if (!poll) return res.status(404).send(notFoundPage());
    const option = req.body.option;
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const duplicateMessage = { kind: 'error', text: 'A vote has already been recorded for this email address in this poll.' };
    if (EMAIL_PATTERN.test(email) && await hasVoted(dataFile, poll.id, email)) {
      return res.status(409).send(pollPage(poll, { message: duplicateMessage }));
    }
    if (!poll.options.includes(option)) {
      return res.status(400).send(pollPage(poll, { message: { kind: 'error', text: 'Choose one of the listed options.' } }));
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).send(pollPage(poll, { message: { kind: 'error', text: 'Enter a valid email address.' } }));
    }
    if (await recordVote(dataFile, poll.id, option, email) === 'duplicate') {
      return res.status(409).send(pollPage(poll, { message: duplicateMessage }));
    }
    const updated = await findPoll(dataFile, poll.id);
    res.status(201).send(pollPage(updated, { message: { kind: 'confirmation', text: 'Your vote has been recorded.' } }));
  });

  // Accepted votes are final: vote creation is the only operation offered.
  app.all('/polls/:pollId/votes', (req, res) => {
    res.set('Allow', 'POST').status(405).send('Accepted votes cannot be changed.');
  });

  return app;
}

module.exports = { createApp };
