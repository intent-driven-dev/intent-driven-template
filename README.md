# intent-driven-claude-code

> A Claude Code adaptation of the [intent-driven OpenSpec workflow](https://intent-driven.dev/).
> 上游 [intent-driven-dev/intent-driven-template](https://github.com/intent-driven-dev/intent-driven-template) 是为 OpenCode 设计的，
> 本仓库把它的命令、技能、schema 适配到 **Claude Code**（`.claude/commands` 和 `.claude/skills`），并提供一键安装脚本。

```
proposal → specs → design → adr → tasks
```

每个变更按这 5 个 artifact 顺序流转：先说清楚 _为什么_，再用 Gherkin 描述 _做什么_，
再讨论 _怎么做_，把不可逆的架构决策固化为 ADR，最后才落到 _按怎样的步骤实现_。
所有 artifact 都是带版本的纯 Markdown，与 git 协作天然契合。

---

## 前置依赖

| 工具 | 版本 | 安装 |
| --- | --- | --- |
| [Claude Code](https://claude.com/claude-code) | 最新即可 | 官方 CLI / Desktop / Web / IDE 任一即可 |
| Node.js | ≥ 18 | nvm / fnm / volta / brew |
| OpenSpec CLI | ≥ 1.3 | `npm install -g @fission-ai/openspec`（或 pnpm / bun add 全局） |

可选：[Superpowers](https://github.com/obra/superpowers) 已被自动 reuse（若你 ~/.claude 装过）。

---

## 一键安装

### 方式 A：克隆后运行（推荐 — 可审计）

```bash
git clone https://github.com/akarizo/intent-driven-claude-code.git /tmp/idt
/tmp/idt/install.sh ~/path/to/your-project
```

### 方式 B：curl 一行（极简）

```bash
curl -fsSL https://raw.githubusercontent.com/akarizo/intent-driven-claude-code/main/install.sh \
  | bash -s -- ~/path/to/your-project
```

> 把 `akarizo` 替换为你自己的 GitHub 用户名（你 fork 之后的）。
> 也可以通过 `IDT_REPO_URL` 环境变量覆盖：
> `IDT_REPO_URL=https://github.com/YOUR/REPO bash -c 'curl -fsSL ... | bash -s -- <target>'`

**TARGET_DIR 缺省 `pwd`，所以也可以：**

```bash
cd ~/your-project
curl -fsSL https://raw.githubusercontent.com/akarizo/intent-driven-claude-code/main/install.sh | bash
```

安装器**幂等**：重复运行不会覆盖已有文件，全部 `[skip]`。

---

## 它装了什么

安装到目标项目根的内容：

```
your-project/
├── .claude/
│   ├── commands/       # 9 个 /opsx-* slash 命令
│   └── skills/         # 14 个 skill（9 个 openspec-*，5 个共享）
├── openspec/
│   ├── config.yaml     # schema: intent-driven + 4 条 rules
│   └── schemas/intent-driven/   # 离线 schema 副本
├── adr/.gitkeep        # ADR 工作流落地点
└── CLAUDE.md           # 追加一段「Intent-Driven 工作流」中文说明
                         # （已存在则用 marker 块幂等追加；不存在则新建）
```

不写：`~/.claude`、系统配置、settings。所有改动严格限定在目标项目根。

---

## 快速试用

```bash
cd ~/path/to/your-project

# 启动 Claude Code（CLI 或 Desktop）
# 输入：
/opsx-propose add-hello-world
```

Claude 会：
1. 调用 `openspec new change add-hello-world` 创建变更骨架
2. 依次生成 `proposal.md` → `specs/.../spec.md` → `design.md` → `adr/NNNN-*.md` → `tasks.md`
3. 提示运行 `/opsx-apply` 进入实现阶段

CLI 验证：

```bash
openspec list
openspec status  --change add-hello-world
openspec schema validate intent-driven
```

---

## 9 个 slash 命令速查

| 命令 | 一句话 |
| --- | --- |
| `/opsx-new <name>` | 创建变更，停在第一个 artifact 模板等用户确认 |
| `/opsx-propose <name>` | 一次性生成 apply 所需的所有 artifacts |
| `/opsx-continue [name]` | 推进下一个 artifact |
| `/opsx-apply [name]` | 按 tasks 执行实现，逐条勾选 |
| `/opsx-verify [name]` | 三维一致性检查（completeness / correctness / coherence） |
| `/opsx-archive [name]` | 归档已完成变更（要求 implementation 已合回 `main`） |
| `/opsx-sync [name]` | 把 delta specs 合入主 specs |
| `/opsx-explore [topic]` | 探索模式：只思考、不实现 |
| `/opsx-bulk-apply` | 多变更并行 worktree 实现 |

详细工作流：[docs/WORKFLOW_zh.md](docs/WORKFLOW_zh.md)

---

## 与上游的差异

| 项 | 上游（OpenCode） | 本仓库（Claude Code） |
| --- | --- | --- |
| 命令位置 | `.opencode/commands/` | `.claude/commands/` |
| 技能位置 | `.opencode/skills/` + `.agents/skills/` | `.claude/skills/`（合并后） |
| 插件机制 | `opencode.json` 声明 superpowers | 不需要：Claude Code 用户自行装 [Superpowers](https://github.com/obra/superpowers) |
| 安装方式 | 手动复制目录 | `install.sh` 一键，幂等 |
| 中文文档 | 无 | README + WORKFLOW_zh + CLAUDE.md snippet 全中文 |

所有命令、技能和 schema **内容字节级一致**，仅迁移路径与添加安装器。

---

## 致谢

- [intent-driven-dev/intent-driven-template](https://github.com/intent-driven-dev/intent-driven-template) —— 上游模板与工作流设计
- [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) —— OpenSpec CLI 与 schema 引擎
- [obra/superpowers](https://github.com/obra/superpowers) —— brainstorming / planning / TDD 等技能集
- [mattpocock/skills](https://github.com/mattpocock/skills) —— `grill-me` 风格来源

---

## License

MIT。详见 [LICENSE](LICENSE)。
