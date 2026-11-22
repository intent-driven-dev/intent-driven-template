'use strict';

const cheerio = require('cheerio');

// Page object for a poll's voting page. Owns routes, field names, and selectors.
class PollPage {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.response = null;
    this.$ = null;
  }

  async #load(response) {
    this.response = response;
    this.$ = cheerio.load(await response.text());
  }

  async open(pollId) {
    await this.#load(await fetch(`${this.baseUrl}/polls/${pollId}`));
  }

  // Fills in the rendered voting form and submits it, as a participant would.
  async submitVote(pollId, option, email) {
    await this.open(pollId);
    const form = this.$('form[data-role="vote-form"]');
    if (!form.length) throw new Error(`poll page for "${pollId}" has no vote form (status ${this.response.status})`);
    const body = new URLSearchParams();
    body.set(form.find('input[type="radio"]').attr('name'), option);
    body.set(form.find('input[type="email"]').attr('name'), email);
    const action = new URL(form.attr('action'), `${this.baseUrl}/polls/${pollId}`);
    await this.#load(await fetch(action, {
      method: (form.attr('method') || 'post').toUpperCase(),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      redirect: 'follow',
    }));
  }

  // Attempts to modify an accepted vote by sending an update for the voter's email.
  async attemptChange(pollId, option, email) {
    const body = new URLSearchParams({ option, email });
    await this.#load(await fetch(`${this.baseUrl}/polls/${pollId}/votes`, {
      method: 'PUT',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    }));
  }

  confirmation() {
    const message = this.$('[data-role="message"][data-kind="confirmation"]');
    return message.length ? message.text() : null;
  }

  votesFor(option) {
    const row = this.$('[data-role="option"]').filter((_, el) => this.$(el).attr('data-option') === option);
    return row.length ? Number(row.find('[data-role="votes"]').text()) : null;
  }

  totalVotes() {
    return this.$('[data-role="votes"]').toArray().reduce((sum, el) => sum + Number(this.$(el).text()), 0);
  }

  rejection() {
    const message = this.$('[data-role="message"][data-kind="error"]');
    return message.length ? message.text() : null;
  }

  status() {
    return this.response.status;
  }
}

module.exports = { PollPage };
