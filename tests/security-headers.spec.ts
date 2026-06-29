import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// These checks read config/build files directly instead of a running
// browser, because vercel.json's headers (CSP, Permissions-Policy) are
// only ever served by the real Vercel deployment -- the local Playwright
// webServer (vite preview) does not apply them. A regression here would
// silently pass every other test in this suite while breaking in
// production, exactly like the camera permission bug and the inline
// theme script both did before this test existed.

const root = path.resolve(__dirname, '..');
const vercelConfig = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const headerRules = vercelConfig.headers[0].headers as { key: string; value: string }[];

function getHeader(key: string): string {
  const rule = headerRules.find((h) => h.key === key);
  if (!rule) throw new Error(`Header "${key}" not found in vercel.json`);
  return rule.value;
}

test('Permissions-Policy allows camera for same-origin use', () => {
  const value = getHeader('Permissions-Policy');
  // camera=() with no allowlist blocks getUserMedia() everywhere, including
  // for the site itself -- this broke the guestbook selfie feature even
  // after the user granted browser permission.
  expect(value).toMatch(/camera=\(self\)|camera=\(\s*self\s*\)/);
});

test('CSP img-src allows blob: (needed by guestbook, served behind this CSP via rewrite)', () => {
  // /guestbook is proxied through this domain, so it's actually governed by
  // THIS vercel.json, not its own -- guestbook's selfie camera/upload preview
  // assigns a blob: URL to an <img src>, which CSP silently blocks without
  // this, producing a broken-image icon with no visible error to the user.
  const csp = getHeader('Content-Security-Policy');
  expect(csp).toMatch(/img-src[^;]*\bblob:/);
});

test('CSP script-src hash matches the actual inline script in the built HTML', () => {
  const distIndexPath = path.join(root, 'dist', 'index.html');
  if (!existsSync(distIndexPath)) {
    throw new Error('dist/index.html not found -- run `npm run build` before this test');
  }

  const csp = getHeader('Content-Security-Policy');
  const hashMatch = csp.match(/'sha256-([^']+)'/);
  expect(hashMatch, 'CSP has no sha256 hash in script-src').not.toBeNull();
  const declaredHash = hashMatch![1];

  const html = readFileSync(distIndexPath, 'utf8');
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  expect(scriptMatch, 'No inline <script> found in dist/index.html').not.toBeNull();
  const inlineScriptContent = scriptMatch![1];

  const actualHash = createHash('sha256').update(inlineScriptContent, 'utf8').digest('base64');

  expect(
    actualHash,
    'The inline script in index.html no longer matches the CSP hash in vercel.json. ' +
      'Either the script was edited without updating the hash, or whitespace/line endings ' +
      'changed during build. The browser will silently block this script in production.'
  ).toBe(declaredHash);
});
