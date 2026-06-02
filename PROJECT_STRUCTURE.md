# PROJECT_STRUCTURE — foundation-dogfood

> The per-project bundle Foundation reads on every issue (FOUNDATION-GIT-WORKFLOW §1.1 · PROJECT-LIFECYCLE).

## Identity
- **Repo:** https://github.com/hadi-sam/foundation-dogfood (public sandbox)
- **Purpose:** throwaway — validate the pipeline end-to-end; **not a real product**.
- **Slack channel:** `#retentio-app` (reused for the first dogfood; real projects get their own channel).

## Deployment model
- **`direct`** — `feat → main`. No `test`/staging branch (no real users). PO-run smoke is best-effort / local.

## Stack & commands
- **Runtime:** Node ≥ 20, ESM, **zero external deps**.
- **Build:** none.
- **Lint:** `npm run lint` (`node --check src/index.js`).
- **Test:** `npm test` (`node --test`). Run before every push (GIT-WORKFLOW §8).

## Platform enforcement (branch protection on `main`)
- No direct push; PR required; admins included. Agents push feat branches as their **bot**
  (`aule-retentio` / `lucienne-retentio`); **the PO merges** (v1 has no auto-merge).

## Conventions
- Branches: `feat/issue-NN-slug` · `fix/...` · `chore/...`.
- Conventional commits; **split-commit** (A = code / Aulë, B = paper-trail / Lucienne, refs A's SHA).
- Project memory + decisions live in `docs/` (committed; git history = the trail).
