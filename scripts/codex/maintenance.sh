#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(git rev-parse --show-toplevel)"

if [[ "$(node --version)" != v22.* ]]; then
  echo "ROOT development requires Node.js 22; found $(node --version)." >&2
  exit 1
fi

ROOT_CODEX_CACHE_DIR="${XDG_CACHE_HOME:-${TMPDIR:-/tmp}/root-codex-cache}"
mkdir -p "$ROOT_CODEX_CACHE_DIR"

sync_dependencies() {
  local directory="$1"
  local cache_key="$2"
  local lockfile="$directory/package-lock.json"
  local marker="$ROOT_CODEX_CACHE_DIR/$cache_key.lock-sha256"

  [[ -f "$lockfile" ]] || return 0

  local current_hash previous_hash=""
  current_hash="$(sha256sum "$lockfile" | awk '{print $1}')"
  if [[ -f "$marker" ]]; then
    previous_hash="$(<"$marker")"
  fi

  if [[ ! -d "$directory/node_modules" || "$current_hash" != "$previous_hash" ]]; then
    npm ci --prefix "$directory" --no-audit --no-fund
    printf '%s\n' "$current_hash" > "$marker"
  else
    printf 'Dependencies already synchronized: %s\n' "$directory"
  fi
}

sync_dependencies . root
sync_dependencies functions/tracking-ingest tracking-ingest

if command -v chromium >/dev/null 2>&1; then
  printf 'Using system Chromium: %s\n' "$(chromium --version)"
else
  npx playwright install chromium
fi

echo "ROOT dependencies synchronized"
