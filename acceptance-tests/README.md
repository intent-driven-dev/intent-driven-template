# PollCast acceptance tests

Executable Gherkin specs from `openspec/` run against the real application,
which the hooks boot as a child process with a temporary JSON data file.

```sh
npm install              # repo root: application dependencies
cd acceptance-tests
npm install
npm test                 # effective spec: specs + active change deltas
npm run test:specs       # source-of-truth specs only (regression)
npm run lint:specs       # extract, then gherkin-lint
```

The HTML report is written to `reports/cucumber-report.html`.
`.extracted/` and `reports/` are generated and gitignored.
