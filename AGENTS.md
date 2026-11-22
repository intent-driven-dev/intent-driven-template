# AGENTS.md

- For OpenSpec propose/apply/verify/archive workflows, use the local `openspec-git-discipline` skill to enforce proposal commits before apply and merge-before-archive discipline.
- In Codex CLI, before spawning `adversarial-author`, `adversarial-reviewer`, `senior-dev`, or `senior-qa`, read `.agents/agents/<role>.md` from this repository and include its full instructions in the delegation message alongside the task.
- In Copilot CLI, use the matching repository agent in `.github/agents/` for these roles; each profile directs the agent to read and follow the shared instructions in `.agents/agents/`.
