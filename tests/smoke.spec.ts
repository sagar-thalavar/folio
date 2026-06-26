import { test, expect } from '@playwright/test';

test('homepage loads with no console errors or CSP violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/');
  await expect(page.locator('#root')).toBeVisible();
  await page.waitForLoadState('networkidle');

  expect(errors, `Console errors found:\n${errors.join('\n')}`).toEqual([]);
});

test('theme toggle applies data-theme attribute', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');

  await page.getByRole('button', { name: /toggle theme/i }).click();
  await expect(html).not.toHaveAttribute('data-theme', before ?? '');
});

test('Writings route loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/');
  await page.getByRole('link', { name: /read my writings/i }).click();
  await page.waitForLoadState('networkidle');

  expect(errors, `Console errors found:\n${errors.join('\n')}`).toEqual([]);
});
