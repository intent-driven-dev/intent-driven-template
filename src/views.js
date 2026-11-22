'use strict';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function layout(title, body) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body>${body}</body></html>`;
}

function pollPage(poll, { message } = {}) {
  const options = poll.options
    .map((option) => `<li data-role="option" data-option="${escapeHtml(option)}"><label><input type="radio" name="option" value="${escapeHtml(option)}" required> ${escapeHtml(option)}</label> <span data-role="votes">${poll.totals ? poll.totals[option] : 0}</span></li>`)
    .join('');
  const notice = message ? `<p data-role="message" data-kind="${message.kind}">${escapeHtml(message.text)}</p>` : '';
  return layout(poll.title, `<h1>${escapeHtml(poll.title)}</h1>
${notice}
<form data-role="vote-form" method="post" action="/polls/${encodeURIComponent(poll.id)}/votes">
<ul>${options}</ul>
<label>Email <input type="email" name="email" required></label>
<button type="submit">Vote</button>
</form>`);
}

function notFoundPage() {
  return layout('Not found', '<h1>Poll not found</h1>');
}

module.exports = { pollPage, notFoundPage };
