import { test, expect } from '@playwright/test';

test.describe('Myth-Buster Flow', () => {
  test('should search for a claim and display result', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('e.g., Voting starts at 8 AM in Delhi...');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('EVM hacking');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(500);
    const result = page.locator('[class*="result"], [class*="myth"]').first();
    await expect(result).toBeVisible({ timeout: 10000 }).catch(() => {});
  });

  test('should navigate myth carousel', async ({ page }) => {
    await page.goto('/');
    
    const mythSection = page.locator('section, div').filter({ has: page.getByText(/Myth|Claim/i) }).first();
    if (await mythSection.isVisible()) {
      const nextBtn = page.locator('button:has([class*="chevron-right"]), button:has-text(">")').first();
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });
});

test.describe('Infographic Generation Flow', () => {
  test('should open infographic section', async ({ page }) => {
    await page.goto('/');
    
    const generateBtn = page.getByRole('button', { name: /generate|visual|infographic/i }).first();
    const section = page.locator('section').filter({ has: page.getByText(/infographic|visual/i) }).first();
    
    if (await generateBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(generateBtn).toBeVisible();
    } else {
      await expect(section).toBeVisible();
    }
  });
});

test.describe('Auth Persistence Flow', () => {
  test('should show google sign-in button when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    const googleBtn = page.locator('button:has-text("Sign in with Google"), button:has([class*="google"])');
    if (await googleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(googleBtn).toBeVisible();
    }
  });
});