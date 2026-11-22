const { extractAll } = require('./extract-gherkin.cjs');
const { effectivePaths } = require('./openspec-effective-paths.cjs');

extractAll();

const common = {
  paths: effectivePaths(),
  import: ['support/**/*.js', 'step-definitions/**/*.js'],
  format: ['progress-bar', ['html', 'reports/cucumber-report.html']],
};

const specs = {
  ...common,
  paths: ['.extracted/specs/**/*.feature'],
};

module.exports = { default: common, specs };
