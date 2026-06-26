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

test('theme toggle flips back and forth correctly', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const initial = await html.getAttribute('data-theme');
  const toggle = page.getByRole('button', { name: /toggle theme/i });

  await toggle.click();
  const afterOneClick = await html.getAttribute('data-theme');
  expect(afterOneClick).not.toBe(initial);

  await toggle.click();
  const afterTwoClicks = await html.getAttribute('data-theme');
  expect(afterTwoClicks).toBe(initial);
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
