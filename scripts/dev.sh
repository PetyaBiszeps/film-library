#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

client_pid=""
server_pid=""

cleanup() {
  if [[ -n "${client_pid}" ]] && kill -0 "${client_pid}" 2>/dev/null; then
    kill "${client_pid}" 2>/dev/null || true
  fi
  if [[ -n "${server_pid}" ]] && kill -0 "${server_pid}" 2>/dev/null; then
    kill "${server_pid}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

start_client() {
  if [[ -f "${ROOT_DIR}/client/package.json" ]]; then
    (cd "${ROOT_DIR}/client" && pnpm dev) &
    client_pid=$!
    return
  fi

  printf '%s\n' "client/ package.json not found; skipping frontend."
}

start_server() {
  if [[ ! -f "${ROOT_DIR}/server/go.mod" ]]; then
    printf '%s\n' "server/ go.mod not found; skipping backend."
    return
  fi

  if [[ -f "${ROOT_DIR}/server/cmd/api/main.go" ]]; then
    (cd "${ROOT_DIR}/server" && go run ./cmd/api) &
    server_pid=$!
    return
  fi

  if [[ -f "${ROOT_DIR}/server/main.go" ]]; then
    (cd "${ROOT_DIR}/server" && go run .) &
    server_pid=$!
    return
  fi

  printf '%s\n' "Server entrypoint not found; skipping backend."
}

start_server
start_client

if [[ -n "${client_pid}" ]]; then
  wait "${client_pid}"
else
  printf '%s\n' "Nothing to run."
fi
