'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { globSync } = require('glob');

const RULE_RE = /^\s*Rule:\s*(.+)$/;
const MARKER_RE = /@openspec:\s*(ADDED|MODIFIED|REMOVED|RENAMED)/;
const SCENARIO_RE = /^\s*Scenario(?: Outline)?:\s*(.*)$/;

function readLines(featurePath) {
  return fs.readFileSync(path.resolve(__dirname, featurePath), 'utf8').split(/\r?\n/);
}

function sourceOf(featurePath) {
  return featurePath.replace(/^\.extracted\//, '../openspec/').replace(/spec\.feature$/, 'spec.md');
}

function capabilityOf(featurePath) {
  const parts = featurePath.split('/');
  return parts[parts.lastIndexOf('specs') + 1];
}

function changeIdOf(deltaPath) {
  const parts = deltaPath.split('/');
  return parts[parts.indexOf('changes') + 1];
}

function collectSupersededRules(deltaPaths) {
  const superseded = new Map();
  for (const deltaPath of deltaPaths) {
    const capability = capabilityOf(deltaPath);
    const changeId = changeIdOf(deltaPath);
    let pendingOp = null;
    for (const line of readLines(deltaPath)) {
      const marker = MARKER_RE.exec(line);
      if (marker) {
        pendingOp = marker[1];
        continue;
      }
      const rule = RULE_RE.exec(line);
      if (!rule) continue;
      const name = rule[1].trim();
      if (pendingOp === 'MODIFIED' || pendingOp === 'REMOVED') {
        if (!superseded.has(capability)) superseded.set(capability, new Map());
        const byRule = superseded.get(capability);
        const otherChange = byRule.get(name);
        if (otherChange && otherChange !== changeId) {
          throw new Error(
            `Active changes "${otherChange}" and "${changeId}" both supersede rule "${name}" of capability "${capability}".`
          );
        }
        byRule.set(name, changeId);
      }
    }
  }
  return superseded;
}

function filterSourceOfTruthSpec(specPath, supersededByRule) {
  const seenRules = new Set();
  const keptScenarioLines = [];
  const excluded = [];
  let currentExclusion = null;
  readLines(specPath).forEach((line, idx) => {
    const rule = RULE_RE.exec(line);
    if (rule) {
      const name = rule[1].trim();
      seenRules.add(name);
      if (supersededByRule.has(name)) {
        currentExclusion = { rule: name, changeId: supersededByRule.get(name), scenarios: [] };
        excluded.push(currentExclusion);
      } else {
        currentExclusion = null;
      }
      return;
    }
    const scenario = SCENARIO_RE.exec(line);
    if (!scenario) return;
    if (currentExclusion) {
      currentExclusion.scenarios.push({ name: scenario[1].trim() || '(unnamed scenario)', line: idx + 1 });
    } else {
      keptScenarioLines.push(idx + 1);
    }
  });
  if (excluded.length === 0) return { entry: specPath, seenRules, excluded };
  if (keptScenarioLines.length === 0) return { entry: null, seenRules, excluded };
  return { entry: `${specPath}:${keptScenarioLines.join(':')}`, seenRules, excluded };
}

function printCompositionReport(exclusions) {
  let leftOut = 0;
  for (const { specPath, capability, rules } of exclusions) {
    for (const { rule, changeId, scenarios } of rules) {
      console.error(`[effective-spec] ${capability} / Rule: ${rule}`);
      console.error(`[effective-spec]   superseded by change: ${changeId}`);
      for (const { name, line } of scenarios) {
        console.error(`[effective-spec]   left out: ${name} (${sourceOf(specPath)}:${line})`);
        leftOut += 1;
      }
    }
  }
  console.error(`[effective-spec] ${leftOut} source-of-truth scenario(s) excluded; delta versions run from openspec/changes/`);
}

function effectivePaths() {
  const deltaPaths = globSync('.extracted/changes/*/specs/**/*.feature', {
    cwd: __dirname,
    posix: true,
  }).filter((p) => !p.includes('changes/archive/'));
  const sotPaths = globSync('.extracted/specs/**/*.feature', {
    cwd: __dirname,
    posix: true,
  });

  const superseded = collectSupersededRules(deltaPaths);
  const paths = [];
  const seenRulesByCapability = new Map();
  const exclusions = [];

  for (const specPath of sotPaths) {
    const capability = capabilityOf(specPath);
    const supersededByRule = superseded.get(capability);
    if (!supersededByRule) {
      paths.push(specPath);
      continue;
    }
    const { entry, seenRules, excluded } = filterSourceOfTruthSpec(specPath, supersededByRule);
    if (entry) paths.push(entry);
    seenRulesByCapability.set(capability, seenRules);
    if (excluded.length > 0) exclusions.push({ specPath, capability, rules: excluded });
  }
  if (exclusions.length > 0) printCompositionReport(exclusions);

  for (const [capability, byRule] of superseded) {
    const seenRules = seenRulesByCapability.get(capability) ?? new Set();
    for (const [name, changeId] of byRule) {
      if (!seenRules.has(name)) {
        console.error(`[effective-spec] WARNING: change "${changeId}" marks rule "${name}" of capability "${capability}" as MODIFIED/REMOVED, but no such rule exists in openspec/specs.`);
      }
    }
  }

  paths.push(...deltaPaths);
  return paths;
}

module.exports = { effectivePaths };
