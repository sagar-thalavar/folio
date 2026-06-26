# Automated Testing & Branch Protection

This document covers what was set up across `folio` and `guestbook`, why, and how to use it day to day.

## 1. Why this exists

Three real bugs shipped silently before this setup existed:
1. An inline theme script and an inline `onload` font-swap handler were both blocked by the site's CSP (`script-src 'self'`) — no error visible to a user, just broken theme detection.
2. A `Permissions-Policy: camera=()` header blocked the camera API outright, regardless of the browser permission the user granted. The error message ("Permission denied") looked like a normal permission issue, not a header bug.
3. Vite was auto-injecting `<link rel="modulepreload">` for a code-split chunk that should only load on a lazy route, silently inflating the homepage's JS payload.

None of these are logic bugs you'd catch reading the code — they're caused by security headers and build tooling silently vetoing something, with only a vague symptom visible. That's what this setup targets.

## 2. What's installed, where

Both `folio` and `guestbook` have the same three pieces:

| Piece | Files | Purpose |
|---|---|---|
| **Playwright** | `playwright.config.ts`, `tests/smoke.spec.ts` | Loads the real app in a real headless browser, checks for console errors and exercises key UI flows. |
| **Header-contract tests** | `tests/security-headers.spec.ts` | Reads `vercel.json` directly (no browser) and asserts the security headers are configured correctly. |
| **Lighthouse CI** | `lighthouserc.json` | Re-runs the performance/accessibility/SEO audit against the production build and fails if scores drop below a threshold. |
| **GitHub Actions** | `.github/workflows/test.yml` | Runs all of the above automatically on every push to `main` and every pull request. |

## 3. The blind spot — and why it needed its own test type

`vite preview` (what Playwright tests run against locally) **does not send any of the headers defined in `vercel.json`** — no CSP, no `Permissions-Policy`, nothing. I confirmed this directly with `curl -I` against a local preview server: zero security headers in the response.

This means bugs #1 and #2 above are **structurally invisible** to a normal browser-based test, no matter how thorough it is — the local server that the test runs against simply doesn't enforce the thing that broke in production.

The fix: `tests/security-headers.spec.ts` doesn't use a browser at all. It reads `vercel.json` as a plain JSON file and asserts on the header *values* directly:

- `Permissions-Policy` must allow `camera=(self)`, not `camera=()`
- The CSP's `frame-ancestors` must be `'none'` (clickjacking protection — `guestbook` has an admin panel)
- The CSP's `connect-src`/`img-src` must allow the Supabase origins the app actually needs
- (folio only) The CSP's `sha256-` hash for the inline theme script must match the *actual bytes* of that script in the built `dist/index.html` — catches the case where someone edits the script (even by one character of whitespace) without regenerating the hash

This is a deliberately different test *type* from Playwright — config validation, not behavior validation — because the bug class it guards against is a config problem, not a behavior problem.

## 4. Proof it works (what we actually did)

To validate the suite wasn't just theater, we deliberately broke things on a local branch (never pushed) and watched the tests react:

- **Added a stray `console.log` to the inline script** → all Playwright tests still passed. Investigated why: confirmed `vite preview` sends no CSP header, so this bug class is invisible to browser tests regardless of how they're written.
- **Broke the theme toggle logic** (`'dark' : 'dark'` instead of `'dark' : 'light'`) → the existing test still passed, because it only checked that *one* click changed the attribute, not that two clicks round-tripped back. This was a real gap in the test itself, not just the app. Fixed by strengthening the test to check the full round trip — it then failed correctly, with the exact expected/received values.
- **Changed `camera=(self)` back to `camera=()`** in `vercel.json` → the header-contract test caught it in milliseconds, no browser needed.
- **Added one space inside the inline theme script** → the CSP-hash test caught the mismatch immediately, with an error message explaining exactly what happened and why the browser would block it in production.

## 5. How to use this day to day

**Automatically (the real safety net):** every push to `main` and every pull request triggers the GitHub Actions workflow. Check the **Checks** tab on a PR, or the **Actions** tab on the repo, for a pass/fail.

**Locally (faster feedback while developing):**
```bash
npm run test:e2e         # Playwright (functional + header-contract tests)
npm run test:lighthouse  # Lighthouse CI (performance/accessibility/SEO)
```

**Reading a failure:**
1. The test name tells you *what broke* (e.g. `theme toggle flips back and forth correctly`), not just that something did.
2. The `Expected` / `Received` line is usually the actual diagnosis.
3. Go to the file/function the test name implies — the bug lives there, not in the test file.
4. Fix, rerun locally, confirm green, push.

## 6. The GitHub ruleset (branch protection on `main`)

`folio` has a ruleset named **"Protect Main Branch"**, applied to `refs/heads/main`, currently set to:

| Rule | What it does |
|---|---|
| `deletion` | Blocks anyone from deleting the `main` branch. |
| `non_fast_forward` | Blocks force-pushes — `main`'s history can't be rewritten. |
| `pull_request` (`required_approving_review_count: 0`) | Requires changes to go through a pull request instead of a direct push to `main`. Approval count is `0`, so no one has to actually *approve* the PR — you can open and merge it yourself. |

**What this does *not* do yet:** it doesn't require the CI checks (Playwright/Lighthouse, from `.github/workflows/test.yml`) to pass before the merge button is enabled. Right now they run and report a ✅/❌ on the PR, but a red ❌ is informational — it won't block you from merging anyway.

If you want the test suite to actually function as a gate (not just a report), the next step is adding a **required status check** rule to this ruleset, pointing at the `test.yml` workflow's job name. That changes "merge" from always-available to "blocked until CI is green" — which is the difference between *testing* and *enforcing*.

`guestbook` has no ruleset yet — `main` there can still be pushed to directly or force-pushed.
