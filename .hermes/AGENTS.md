# StNK Jasa — Agent Constraints

## Scope
- **backend** — API, database, and server logic
- **frontend** — web UI
- **mobile** — mobile apps
- **docs** — all project documentation
- **QA** — (skipped for now)
- **auditor** — (skipped for now)
- **DevOps** — (skipped for now)

## Rules
- No agent should touch `main`/`master` directly.
- Every task must have an assignee and task ID.
- Use `agent/<role>/<task-name>` paths for coding work.
- Documentation is handled by existing backend, frontend, and mobile agents.
- Keep consistent README files at:
  - `/`
  - `apps/api`
  - `apps/web`
  - `apps/mobile`
  - `packages/contracts`
  - `docs/stnk-jasa`
