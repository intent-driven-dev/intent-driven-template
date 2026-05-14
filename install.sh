#!/usr/bin/env bash
# intent-driven-claude-code installer
#
# 用法 / Usage
#   本地 / Local : ./install.sh [TARGET_DIR]
#   管道 / Pipe  : curl -fsSL <raw-url>/install.sh | bash -s -- [TARGET_DIR]
#
# TARGET_DIR 缺省为当前工作目录；不存在会自动创建。
# 复制是幂等的：已存在的文件会被跳过，不会被覆盖。
#
# 退出码:
#   0  成功
#   2  参数错误
#   3  缺少 openspec CLI
#   4  复制 / 写入 / 下载失败

set -euo pipefail

# ---------------------------------------------------------------------------
# 可配置项：fork 后请把 REPO_URL 改为你自己的仓库地址，
# 这是 curl | bash 模式下载 tarball 的来源。
# 也可在调用前设置环境变量 IDT_REPO_URL 覆盖。
# ---------------------------------------------------------------------------
REPO_URL="${IDT_REPO_URL:-https://github.com/akarizo/intent-driven-claude-code}"
BRANCH="${IDT_BRANCH:-main}"

# ---------------------------------------------------------------------------
# 颜色 & 日志
# ---------------------------------------------------------------------------
if [[ -t 1 ]] && command -v tput >/dev/null 2>&1; then
  C_GREEN=$(tput setaf 2 2>/dev/null || true)
  C_YELLOW=$(tput setaf 3 2>/dev/null || true)
  C_RED=$(tput setaf 1 2>/dev/null || true)
  C_DIM=$(tput dim 2>/dev/null || true)
  C_RESET=$(tput sgr0 2>/dev/null || true)
else
  C_GREEN=""; C_YELLOW=""; C_RED=""; C_DIM=""; C_RESET=""
fi

log_add()  { printf '%s[add]%s    %s\n' "$C_GREEN"  "$C_RESET" "$1"; }
log_skip() { printf '%s[skip]%s   %s\n' "$C_DIM"    "$C_RESET" "$1"; }
log_app()  { printf '%s[append]%s %s\n' "$C_YELLOW" "$C_RESET" "$1"; }
log_info() { printf '%s[info]%s   %s\n' "$C_YELLOW" "$C_RESET" "$1"; }
log_err()  { printf '%s[err]%s    %s\n' "$C_RED"    "$C_RESET" "$1" >&2; }

# ---------------------------------------------------------------------------
# 参数解析
# ---------------------------------------------------------------------------
usage() {
  cat <<EOF
intent-driven-claude-code installer

用法:
  ./install.sh [TARGET_DIR]
  curl -fsSL <raw-url>/install.sh | bash -s -- [TARGET_DIR]

参数:
  TARGET_DIR     目标项目根目录，缺省 \$PWD

环境变量:
  IDT_REPO_URL   pipe 模式下载 tarball 的仓库地址 (默认 $REPO_URL)
  IDT_BRANCH     pipe 模式下载的分支             (默认 $BRANCH)

选项:
  -h, --help     显示本帮助
EOF
}

case "${1:-}" in
  -h|--help) usage; exit 0 ;;
esac

TARGET="${1:-$PWD}"
if [[ $# -gt 1 ]]; then
  log_err "多余参数: ${*:2}"; usage; exit 2
fi

# ---------------------------------------------------------------------------
# 前置检查：openspec CLI 必须存在
# ---------------------------------------------------------------------------
if ! command -v openspec >/dev/null 2>&1; then
  log_err "未检测到 openspec CLI"
  cat >&2 <<EOF

请先安装 OpenSpec CLI（任选其一）:
  npm  install -g @fission-ai/openspec
  pnpm add       -g @fission-ai/openspec
  bun  add       -g @fission-ai/openspec

随后重新运行本脚本。
EOF
  exit 3
fi

# ---------------------------------------------------------------------------
# 模板源定位：本地 vs 管道
# ---------------------------------------------------------------------------
MODE="local"
TEMPLATE_SRC=""
CLEANUP_TMP=""

src_file="${BASH_SOURCE[0]:-}"
if [[ -n "$src_file" && -f "$src_file" ]]; then
  SCRIPT_DIR=$(cd "$(dirname "$src_file")" && pwd)
  if [[ -d "$SCRIPT_DIR/template" ]]; then
    TEMPLATE_SRC="$SCRIPT_DIR/template"
  fi
fi

if [[ -z "$TEMPLATE_SRC" ]]; then
  MODE="pipe"
  command -v curl >/dev/null 2>&1 || { log_err "pipe 模式需要 curl"; exit 4; }
  command -v tar  >/dev/null 2>&1 || { log_err "pipe 模式需要 tar";  exit 4; }
  TMP=$(mktemp -d)
  CLEANUP_TMP="$TMP"
  trap 'rm -rf "$CLEANUP_TMP"' EXIT
  log_info "pipe 模式：下载 $REPO_URL@$BRANCH"
  if ! curl -fsSL "$REPO_URL/archive/refs/heads/$BRANCH.tar.gz" \
       | tar -xz -C "$TMP" --strip-components=1; then
    log_err "下载或解压失败：$REPO_URL@$BRANCH"
    exit 4
  fi
  TEMPLATE_SRC="$TMP/template"
fi

[[ -d "$TEMPLATE_SRC" ]] || { log_err "找不到模板目录: $TEMPLATE_SRC"; exit 4; }

# ---------------------------------------------------------------------------
# 目标准备
# ---------------------------------------------------------------------------
if [[ ! -e "$TARGET" ]]; then
  log_info "目标不存在，自动创建: $TARGET"
  mkdir -p "$TARGET"
fi
[[ -d "$TARGET" ]] || { log_err "目标不是目录: $TARGET"; exit 2; }
TARGET=$(cd "$TARGET" && pwd)

log_info "模板来源: $TEMPLATE_SRC  (模式: $MODE)"
log_info "安装到  : $TARGET"
echo

# ---------------------------------------------------------------------------
# 幂等复制：BSD/GNU 双兼容；统计在循环外维护
#   注意：用 process substitution 而非 pipe，以便 while 体里能修改外层变量
# ---------------------------------------------------------------------------
ADD_COUNT=0
SKIP_COUNT=0

copy_tree() {
  local src="$1" dst="$2" rel out
  [[ -d "$src" ]] || return 0
  while IFS= read -r -d '' rel; do
    rel="${rel#./}"
    [[ -z "$rel" || "$rel" == "." ]] && continue
    out="$dst/$rel"
    if [[ -d "$src/$rel" ]]; then
      mkdir -p "$out"
    else
      if [[ -e "$out" ]]; then
        log_skip "${out#$TARGET/}"
        SKIP_COUNT=$((SKIP_COUNT+1))
      else
        mkdir -p "$(dirname "$out")"
        cp "$src/$rel" "$out"
        log_add "${out#$TARGET/}"
        ADD_COUNT=$((ADD_COUNT+1))
      fi
    fi
  done < <(cd "$src" && find . \( -type d -o -type f \) -print0)
}

copy_tree "$TEMPLATE_SRC/.claude"  "$TARGET/.claude"
copy_tree "$TEMPLATE_SRC/openspec" "$TARGET/openspec"
copy_tree "$TEMPLATE_SRC/adr"      "$TARGET/adr"

# ---------------------------------------------------------------------------
# CLAUDE.md 注入 (marker 包裹，幂等)
# ---------------------------------------------------------------------------
SNIPPET="$TEMPLATE_SRC/CLAUDE.md.snippet"
TARGET_CLAUDE="$TARGET/CLAUDE.md"
MARKER_BEGIN="<!-- intent-driven:begin -->"

[[ -f "$SNIPPET" ]] || { log_err "缺失 CLAUDE.md.snippet: $SNIPPET"; exit 4; }

if [[ ! -f "$TARGET_CLAUDE" ]]; then
  cp "$SNIPPET" "$TARGET_CLAUDE"
  log_add "CLAUDE.md"
  ADD_COUNT=$((ADD_COUNT+1))
elif grep -qF "$MARKER_BEGIN" "$TARGET_CLAUDE"; then
  log_skip "CLAUDE.md  (已含 intent-driven 段，跳过)"
  SKIP_COUNT=$((SKIP_COUNT+1))
else
  {
    printf '\n\n'
    cat "$SNIPPET"
  } >> "$TARGET_CLAUDE"
  log_app "CLAUDE.md  (追加 intent-driven 段)"
fi

# ---------------------------------------------------------------------------
# 摘要
# ---------------------------------------------------------------------------
echo
printf '%s✓ Intent-Driven 已就绪%s   [add] %d  [skip] %d\n' \
  "$C_GREEN" "$C_RESET" "$ADD_COUNT" "$SKIP_COUNT"
cat <<EOF

下一步 (Next steps):
  1. cd "$TARGET"
  2. 在 Claude Code 中输入:
       /opsx-propose <change-name>     # 一次性生成 proposal/design/tasks
       /opsx-new     <change-name>     # 或：逐 artifact 推进
  3. CLI 验证:
       openspec list
       openspec schema validate intent-driven

更多:
  - 9 个 opsx-* slash command 见 .claude/commands/
  - 14 个 skill 见 .claude/skills/
  - schema 副本见 openspec/schemas/intent-driven/
EOF
