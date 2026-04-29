import { test, expect } from '@playwright/test';

test('Voti Assistant chat can be opened', async ({ page }) => {
  await page.goto('/');
  
  // Find the Voti Chat trigger button
  const chatButton = page.locator('button:has(svg[class*="lucide-message-square"])');
  await expect(chatButton).toBeVisible();
  
  // Click to open
  await chatButton.click();
  
  // Check if Voti Assistant header is visible
  await expect(page.getByText('Voti Assistant')).toBeVisible();
});

test('Myth-Buster search functionality', async ({ page }) => {
  await page.goto('/');
  
  const searchInput = page.getByPlaceholder('e.g., Voting starts at 8 AM in Delhi...');
  await expect(searchInput).toBeVisible();
  
  await searchInput.fill('Delhi voting');
  await page.keyboard.press('Enter');
  
  // In a real test, we would check for results or loading state
});
