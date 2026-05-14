# Intent-Driven 工作流详解

> 把 _为什么_、_做什么_、_怎么做_、_长期决策_、_实现步骤_ 这五件事，**强制按顺序**写下来，让代码上线时仍然能解释自己。

```
proposal → specs → design → adr → tasks
```

每一步都依赖前一步。`/opsx-apply` 在 `tasks` 完成前会拒绝运行。
schema 把这套规则编码在 `openspec/schemas/intent-driven/schema.yaml` 里。

---

## 阶段总览

| 阶段 | 文件 | 关键问题 | 配套 skill |
| --- | --- | --- | --- |
| 1. proposal | `proposal.md` | 为什么现在做？影响什么 capability？ | `grill-me` |
| 2. specs | `specs/<capability>/spec.md` | 系统外部可观测的行为是什么？ | `gherkin-authoring` |
| 3. design | `design.md` | 怎么实现？权衡了什么？ | `c4-diagrams` |
| 4. adr | `<repo>/adr/NNNN-*.md` | 哪些是长期不可逆的架构决策？ | `architectural-decision-records` |
| 5. tasks | `tasks.md` | 怎么落到逐条可勾选的步骤？ | —— |

---

## 1. proposal — 写"为什么"

**目标**：让一个完全没上下文的同事/未来的自己，仅凭这份 proposal 就能判断这件事值不值得做。

**模板**（来自 schema）：

```markdown
## Why
<!-- 1-2 句话点明问题 / 机会 -->

## What Changes
<!-- bullet 列出新增 / 修改 / 删除；BREAKING 显式标注 -->

## Capabilities
### New Capabilities
- `user-auth`: 简述这个能力的范围
### Modified Capabilities
- `data-export`: 行为级的改动是什么

## Impact
<!-- 影响的代码、API、依赖、运维系统 -->
```

**`Capabilities` 是 proposal → specs 的契约**：每一个列出的 capability 都会在 specs 阶段
对应一个 `specs/<capability>/spec.md` 文件。

---

## 2. specs — 写"做什么"

**目标**：用 Gherkin 句式描述行为，避免泄漏 UI/数据库/HTTP 细节。

```markdown
## ADDED Requirements

### Requirement: User data export
Feature: User data export
Rule: Users can export their own data

#### Scenario: Successful CSV export
- **GIVEN** a user has saved data
- **WHEN**  the user exports their data as CSV
- **THEN** the system provides a CSV file containing the user's data
```

四种 delta header：

| Header | 用途 | 注意事项 |
| --- | --- | --- |
| `## ADDED Requirements` | 新增 requirement | 直接写 |
| `## MODIFIED Requirements` | 修改已有 requirement | **必须粘贴完整的修改后内容**，不能只贴 diff |
| `## REMOVED Requirements` | 删除 requirement | 必须含 `**Reason**` 和 `**Migration**` |
| `## RENAMED Requirements` | 仅改名 | `FROM: / TO:` 格式 |

`### Requirement: <name>` 和 `#### Scenario: <name>` 的标题层级是 OpenSpec archive 用来合并的契约，**不能改**。

---

## 3. design — 写"怎么做"

**目标**：把会被后续 review 的关键决策（why X over Y）固化下来；预防"半年后看代码不知道为什么这么写"。

`design.md` 包含：

- **Context**：现状、约束、相关人
- **Goals / Non-Goals**：明确做什么 + **明确不做什么**
- **Decisions**：每个决策都附 _备选方案_ 和 _选择理由_
- **Risks / Trade-offs**：`[Risk] → Mitigation`
- **Migration Plan**：上线 / 回滚步骤
- **Open Questions**：尚未解决的问题；如果建议变更某个 in-force ADR，写在这里，由 adr 阶段处理

**铁律**：写 design 前先读 `adr/`，构建 supersession 图，识别**当前生效**的 ADR 集合。
新 design 必须跟现行 ADR 一致；要推翻某个现行 ADR，只能在 Open Questions 提议并让 adr 阶段新建一个 supersede。

---

## 4. adr — 写"长期不可逆决策"

**铁律**：**ADR 一经 accepted 就不可改**。任何字段都不可改：Status、Date、Decision、Consequences 全部冻结。

要变更一个旧决策？新建一个 ADR：

```markdown
# 0042. 改用 Postgres 替代 MySQL 做目录服务

- Status: accepted, supersedes ADR-0017
- Date: 2026-05-13
- Supersedes: ADR-0017

## Context
...为什么要重新讨论 ADR-0017...
```

文件名：`NNNN-kebab-title.md`，NNNN 是仓库范围全局递增，**永不复用**。

何时建 ADR？满足三个条件全部：

1. 是**长期架构承诺**（pattern / 技术选型 / 模块边界 / 契约），不是战术实现细节
2. 会影响**当前变更之外**的未来工作
3. 当前没有 in-force ADR 已经覆盖，或者**有意推翻**某个 in-force ADR

不满足就别建 ADR，写在 design 里即可。

---

## 5. tasks — 写"怎么逐步实现"

```markdown
## 1. 数据层

- [ ] 1.1 新建 user_exports 表（migration）
- [ ] 1.2 增加 ExportJob 模型

## 2. API 层

- [ ] 2.1 POST /v1/exports 创建任务
- [ ] 2.2 GET  /v1/exports/:id 查询状态
```

**强制**：必须用 `- [ ]` checkbox 格式，否则 `/opsx-apply` 解析不到进度。

---

## Git 纪律

| 时机 | 规则 |
| --- | --- |
| propose 前 | 优先在 `main` 上；不在则警告并询问 |
| propose 后 | 提示用户 commit；可选建 PR 分支 |
| apply 前 | **proposal 必须已在 `main`**；之后可在 main / 分支 / worktree 实现 |
| archive 前 | **必须从 `main` 运行**；implementation 必须已合回 |
| archive 后 | 提示 commit archive 与 spec sync 改动 |

完整规则见 `.claude/skills/openspec-git-discipline/SKILL.md`。

---

## 端到端示例

```bash
# 在某项目根
cd ~/my-app

# 1. 启动 Claude Code，输入：
/opsx-propose add-user-export

# Claude 会：
#   - openspec new change add-user-export
#   - 生成 proposal.md, specs/user-export/spec.md, design.md, adr/0042-*.md, tasks.md

# 2. 用户审阅，提交到 PR，合到 main
git add openspec adr
git commit -m "propose: add-user-export"
git push  # 走 PR 合 main

# 3. 在 main 或 worktree 实现
git checkout -b feat/add-user-export
/opsx-apply add-user-export
# Claude 按 tasks 逐条实现，勾选 checkbox

# 4. 实现合回 main 后归档
git checkout main && git pull
/opsx-verify  add-user-export   # 一致性检查
/opsx-archive add-user-export   # 移到 openspec/changes/archive/YYYY-MM-DD-*
```

---

## 何时**不**用这个 schema

- 文档单改、依赖升级、临时性 hotfix：太重，用 commit message 就够
- 行为驱动但不涉及架构决策：考虑用 `behaviour-driven` schema 替代
- 内部脚本 / 玩具项目：YAGNI

参考：[schema 仓库](https://github.com/intent-driven-dev/openspec-schemas) 还提供 `spec-driven`、`behaviour-driven` 等更轻量 schema。
