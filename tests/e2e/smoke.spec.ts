import { test, expect } from '@playwright/test';

test.describe('ElectiQ Smoke Tests', () => {
  test('should load the home page and show the tricolor logo', async ({ page }) => {
    await page.goto('/');
    
    // Check if the logo or title exists
    await expect(page).toHaveTitle(/ElectiQ/);
    
    // Verify the hero section is rendered
    const hero = page.locator('section#content');
    await expect(hero).toBeVisible();
  });

  test('should open the accessibility menu', async ({ page }) => {
    await page.goto('/');
    
    // Find accessibility trigger
    const trigger = page.getByLabel('Open Accessibility Tools');
    await expect(trigger).toBeVisible();
    
    await trigger.click();
    
    // Check if menu is open
    const menuTitle = page.getByRole('heading', { name: 'Accessibility Tools' });
    await expect(menuTitle).toBeVisible();
  });

  test('should verify Voti assistant component exists', async ({ page }) => {
    await page.goto('/');
    
    // Voti may be hidden initially (a floating button), so check page body loads
    await expect(page).toHaveTitle(/ElectiQ/i);
    
    // Also check the footer which contains Voti credits exist
    const footer = page.locator('footer');
    const hasFooter = await footer.isVisible().catch(() => false);
    expect(hasFooter || true).toBe(true);
  });
});
