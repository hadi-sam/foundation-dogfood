#!/usr/bin/env bash
# Foundation — charon-deterministic-recheck.sh
# ---------------------------------------------------------------------------
# CP3 off-box deterministic slice of the Charon Final Gate (FOUNDATION-QUALITY §7).
# Re-derives ONLY the GIT/GITHUB-NATIVE subset of the Final-Gate checklist from the
# repo itself, so the verdict is box-independent: an on-box agent cannot fake it for
# THESE checks (the script runs in CI from the TRUSTED BASE copy — see the workflow).
#
# ⚠ HONEST SCOPE (do not over-read) — this is ≈2 of the 9 Final-Gate checks:
#   (1) committed-tree secret-shape scan — R7 LITERAL PREFIXES only (FOUNDATION-OPERATIONS §R7);
#       NOT a general/entropy secret scanner, and BLIND to the off-git Layer-1 trail (B1).
#   (2) lineage / branch hygiene: branch-name convention + refs #NN (feature PR);
#       [staged] main-absorbed-into-source (promotion PR). NO squash/history-rewrite detection.
# The receipt-chain + judgment checks (≥2-vendor, contract surfaces, smoke, G7, …) are
# OFF-GIT and stay with the Charon agent + the human-review floor — NOT enforced here.
#
# Exit 0 = PASS (post a green charon-final-gate). 1 = FAIL (red). 2 = misuse/integrity.
# NEVER prints a matched secret VALUE — it reports the FILE only.
# ---------------------------------------------------------------------------
set -euo pipefail

# Inputs — CI passes these from the PR event (via env, injection-safe); on-box parity via args.
BASE_REF="${CHARON_BASE_REF:-${1:-}}"        # base branch ref, e.g. origin/main or origin/test
HEAD_SHA="${CHARON_HEAD_SHA:-${2:-HEAD}}"    # PR head SHA the check binds to
SRC_BRANCH="${CHARON_SRC_BRANCH:-${3:-}}"    # PR head branch name (feature-convention check)
TARGET_BRANCH="${CHARON_TARGET_BRANCH:-${4:-}}"  # PR base branch name (main|test)
ISSUE_REF="${CHARON_ISSUE_REF:-${5:-}}"      # PR title + body, for refs #NN (free text — never eval'd)

[ -n "$BASE_REF" ]      || { echo "FATAL: BASE_REF required";      exit 2; }
[ -n "$TARGET_BRANCH" ] || { echo "FATAL: TARGET_BRANCH required"; exit 2; }

fail=0
note(){ printf '  ✗ %s\n' "$1"; fail=1; }
ok(){   printf '  ✓ %s\n' "$1"; }
hdr(){  printf '\n== %s ==\n' "$1"; }

# merge-base of the change set — fail LOUDLY if no shared history (don't silently widen the diff
# by falling back to a branch tip). With the workflow's fetch-depth:0 + explicit refspec this holds.
MB="$(git merge-base "$BASE_REF" "$HEAD_SHA")" || { echo "FATAL: no common history between $BASE_REF and $HEAD_SHA"; exit 1; }

# (1) R7 secret-shape scan — literal prefixes, ADDED lines only, FILE-level report (value never printed).
#     Canon R7 = six literal prefixes. (Refinement TODO: broaden to a real scanner e.g. gitleaks — a
#     canon decision; literal-prefix over the committed tree is the documented honest scope for now.)
hdr "R7 secret-shape scan (literal prefixes, added lines)"
# 'Bearer ' keeps its trailing space on purpose (matches 'Bearer <value>' header lines).
R7='(sk-|Bearer |password=|token=|glpat-|ghp_)'
secret_hit=0
while IFS= read -r f; do
  [ -n "$f" ] || continue
  # '^\+[^+]' = real added lines (skips the '+++ b/file' diff header). A no-match grep (rc 1) is
  # SAFE here because the pipeline is the direct condition of `if` (errexit/pipefail suppressed there).
  if git diff --no-color "$MB" "$HEAD_SHA" -- "$f" | grep -E '^\+[^+]' | grep -qE "$R7"; then
    note "R7 secret-shape prefix in ADDED lines of: $f   (value withheld)"
    secret_hit=1
  fi
done < <(git diff --name-only "$MB" "$HEAD_SHA")
[ "$secret_hit" -eq 0 ] && ok "no R7 literal-prefix matches in added lines (committed tree only; Layer-1 off-git unscanned)"

# (2) lineage / branch hygiene — per target. (Shared history with the base is already guaranteed by
#     the loud merge-base above; there is intentionally NO squash/history-rewrite detection here.)
if [ "$TARGET_BRANCH" = "main" ]; then
  hdr "staged promotion checks (-> main)"
  # main must be absorbed into the promotion source first (GIT-WORKFLOW §1.1): main is an ancestor of head.
  if git merge-base --is-ancestor "$BASE_REF" "$HEAD_SHA"; then
    ok "main absorbed into the promotion head (main is an ancestor of head)"
  else
    note "main NOT absorbed — run 'merge main -> test' before promoting (GIT-WORKFLOW §1.1)"
  fi
  # ⚠ REFINEMENT TODO (#6 'no code beyond the reviewed feat diff'): full diff-equality needs the
  #   pipeline's recorded reviewed-feat-SHA marker (open design point — runbook §1.5). This asserts
  #   main-absorbed ANCESTRY ONLY; the 'no extra unreviewed code' half stays a Charon-agent check.
else
  hdr "feature-branch hygiene (-> $TARGET_BRANCH)"
  if printf '%s' "$SRC_BRANCH" | grep -qE '^(feat|fix|chore)/issue-[0-9]+-'; then
    ok "branch name follows feat|fix|chore/issue-NN-slug"
  else
    note "branch '$SRC_BRANCH' does not follow feat|fix|chore/issue-NN-slug (GIT-WORKFLOW §1)"
  fi
  if printf '%s' "$ISSUE_REF" | grep -qE '#[0-9]+'; then
    ok "PR references an issue (#NN) in its title/body"
  else
    note "PR does not reference an issue (#NN) in its title/body"
  fi
fi

hdr "result"
if [ "$fail" -eq 0 ]; then
  echo "PASS — deterministic git-native slice (≈2 of 9 Final-Gate checks)."
  echo "Judgment items (≥2-vendor, contract surfaces, smoke, G7) + the human review are the rest of the gate."
  exit 0
else
  echo "FAIL — see ✗ above. (Deterministic slice only; not the whole Final Gate.)"
  exit 1
fi
