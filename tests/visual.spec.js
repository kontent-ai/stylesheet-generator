// Visual regression tests: one screenshot per showcase section plus a few interaction states,
// compared with the baselines in tests/__screenshots__. They only run in CI, inside the pinned
// Playwright container (STYLEKIT_VISUAL=1), because font rendering differs between machines.
// To update the baselines after an intended visual change, see "Contributing" in the README.
const path = require('path');
const { test, expect } = require('@playwright/test');

const showcaseUrl = `file://${path.join(__dirname, '..', 'styles', 'showcase.html')}`;
const screenshotOptions = { animations: 'disabled', caret: 'hide', fullPage: true };

test.skip(!process.env.STYLEKIT_VISUAL, 'Screenshots are only compared in the CI container');

test.beforeEach(async ({ page }) => {
    await page.goto(showcaseUrl);
    await page.evaluate(() => document.fonts.ready);
});

// Clip of a section: from its <h2> to the next <hr>, across the content column.
const sectionClip = (page, id) => page.evaluate((sectionId) => {
    const heading = document.getElementById(sectionId);
    let end = heading.nextElementSibling;
    while (end && end.tagName !== 'HR') {
        end = end.nextElementSibling;
    }
    const top = heading.getBoundingClientRect().top + window.scrollY - 8;
    const bottom = end ? end.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
    const content = document.querySelector('.custom-element').getBoundingClientRect();
    return { x: Math.max(content.left - 16, 0), y: top, width: content.width + 32, height: bottom - top };
}, id);

const sections = ['colors', 'button', 'button-secondary', 'button-destructive', 'status', 'text-input', 'invalid-input', 'form-field', 'switch', 'loader', 'checkbox-and-radio', 'tag', 'icon-button', 'skeleton', 'section', 'section-info', 'select'];

for (const id of sections) {
    test(`section: ${id}`, async ({ page }) => {
        await expect(page).toHaveScreenshot(`section-${id}.png`, { ...screenshotOptions, clip: await sectionClip(page, id) });
    });
}

// Moves keyboard focus onto the element, so :focus-visible applies as for a real Tab press.
const tabTo = async (page, locator) => {
    await locator.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
};

test('state: dropdown open', async ({ page }) => {
    await page.locator('#select ~ .row .select').first().click();
    await expect(page).toHaveScreenshot('state-dropdown-open.png', { ...screenshotOptions, clip: await sectionClip(page, 'select') });
});

test('state: tooltip on keyboard focus', async ({ page }) => {
    await tabTo(page, page.locator('.icon-button.destructive'));
    await expect(page.locator('#tip-delete')).toBeVisible();
    await expect(page).toHaveScreenshot('state-tooltip.png', { ...screenshotOptions, clip: await sectionClip(page, 'icon-button') });
});

test('state: focused invalid input', async ({ page }) => {
    await tabTo(page, page.locator('#slug-input'));
    await expect(page).toHaveScreenshot('state-invalid-focus.png', { ...screenshotOptions, clip: await sectionClip(page, 'invalid-input') });
});

test('state: focused button', async ({ page }) => {
    await tabTo(page, page.locator('#button + .row button.button').first());
    await expect(page).toHaveScreenshot('state-button-focus.png', { ...screenshotOptions, clip: await sectionClip(page, 'button') });
});

test('state: hovered tag remove button', async ({ page }) => {
    await page.getByRole('button', { name: 'Remove Landing page' }).hover();
    await expect(page).toHaveScreenshot('state-tag-remove-hover.png', { ...screenshotOptions, clip: await sectionClip(page, 'tag') });
});
