// Smoke tests for the built stylekit, run against styles/showcase.html (which inlines the
// freshly built CSS and dropdown.js). Run `npm run build` first.
const path = require('path');
const { test, expect } = require('@playwright/test');

const showcaseUrl = `file://${path.join(__dirname, '..', 'styles', 'showcase.html')}`;
const focusBlue = 'rgb(0, 147, 255)';
const red = 'rgb(219, 0, 0)';

const style = (locator, property) => locator.evaluate((element, prop) => getComputedStyle(element)[prop], property);

// Moves keyboard focus onto the element, so :focus-visible applies as for a real Tab press.
const tabTo = async (page, locator) => {
    await locator.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
};

let errors = [];

test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    page.on('requestfailed', (request) => errors.push(`request failed: ${request.url()}`));
    await page.goto(showcaseUrl);
    await page.evaluate(() => document.fonts.ready);
});

test.afterEach(async ({ page }, testInfo) => {
    expect(errors, 'console errors, page errors or failed requests').toEqual([]);
    if (testInfo.title === 'renders every section') {
        await testInfo.attach('showcase', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    }
});

test('renders every section', async ({ page }) => {
    for (const id of ['button', 'status', 'text-input', 'form-field', 'invalid-input', 'switch', 'loader', 'checkbox-and-radio', 'tag', 'icon-button', 'skeleton', 'section', 'section-info', 'select']) {
        await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await expect(page.locator('.button').first()).toHaveCSS('background-color', 'rgb(91, 79, 245)');
});

test('loads the bundled Inter font', async ({ page }) => {
    expect(await style(page.locator('body'), 'fontFamily')).toBe('Inter, sans-serif');
    expect(await style(page.locator('input.input').first(), 'fontFamily')).toBe('Inter, sans-serif');
    expect(await page.evaluate(() => document.fonts.check('500 12px Inter') && document.fonts.check('700 12px Inter'))).toBe(true);
});

test('has no duplicate ids', async ({ page }) => {
    const duplicates = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
        return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    expect(duplicates).toEqual([]);
});

test('dropdown works with mouse and keyboard', async ({ page }) => {
    const select = page.locator('#select ~ .row .select').first();
    const options = page.locator('#select ~ .row .options').first();

    await expect(options).toBeHidden();
    await select.click();
    await expect(options).toBeVisible();
    await expect(select).toHaveClass(/\bopen\b/);
    await expect(select).toHaveAttribute('aria-expanded', 'true');

    await page.mouse.click(5, 5);
    await expect(options).toBeHidden();

    await select.focus();
    await page.keyboard.press('ArrowDown');
    await expect(options).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(options).toBeHidden();
    await expect(select).toHaveText('Skoda');
    await expect(select).toBeFocused();
    await expect(options.locator('.option.selected')).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await expect(options).toBeHidden();

    await select.click();
    await options.locator('.option', { hasText: 'Volvo' }).click();
    await expect(select).toHaveText('Volvo');
});

test('disabled dropdown stays closed', async ({ page }) => {
    const disabled = page.locator('.select.disabled');
    await expect(disabled).toHaveAttribute('tabindex', '-1');
    await disabled.click({ force: true });
    await expect(page.locator('.select.disabled + .options')).toBeHidden();
});

test('each switch toggles only itself', async ({ page }) => {
    await page.locator('.switch').nth(1).click();
    expect(await page.locator('.switch input').evaluateAll((inputs) => inputs.map((input) => input.checked))).toEqual([false, true, false, false]);
});

test('invalid inputs get a red border and caption', async ({ page }) => {
    await expect(page.locator('input[aria-invalid="true"]')).toHaveCSS('border-top-color', red);
    await expect(page.locator('.select[aria-invalid="true"]')).toHaveCSS('border-top-color', red);
    await expect(page.locator('.input-caption.invalid').first()).toHaveCSS('color', red);
});

test('keyboard focus shows a focus ring', async ({ page }) => {
    const input = page.locator('input.input').first();
    await tabTo(page, input);
    await expect(input).toHaveCSS('box-shadow', new RegExp(`^${focusBlue.replace(/[()]/g, '\\$&')} 0px 0px 0px 2px`));

    const invalid = page.locator('input[aria-invalid="true"]');
    await tabTo(page, invalid);
    await expect(invalid).toHaveCSS('box-shadow', new RegExp(`^${red.replace(/[()]/g, '\\$&')} 0px 0px 0px 2px`));

    for (const [control, visible] of [['.switch input', '.slider'], ['.checkbox input', '.checkmark'], ['.radio input', '.radio-button']]) {
        await tabTo(page, page.locator(control).first());
        const indicator = page.locator(`${control} ~ ${visible}`).first();
        await expect(indicator).toHaveCSS('outline-color', focusBlue);
        await expect(indicator).toHaveCSS('outline-offset', '3px');
    }
});

test('placeholder uses the readable hint color', async ({ page }) => {
    expect(await page.locator('input.input').first().evaluate((element) => getComputedStyle(element, '::placeholder').color)).toBe('rgb(111, 111, 111)');
});

test('tags have the app size and a removable variant', async ({ page }) => {
    const tag = page.locator('.tag').first();
    await expect(tag).toHaveCSS('height', '32px');
    await expect(tag).toHaveCSS('border-radius', '5000px');
    const remove = page.getByRole('button', { name: 'Remove Landing page' });
    await expect(remove).toBeVisible();
    await tabTo(page, remove);
    await expect(remove).toHaveCSS('outline-color', focusBlue);
});

test('icon buttons take their name from the tooltip', async ({ page }) => {
    const deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
    await expect(deleteButton).toHaveCSS('height', '24px');
    await expect(deleteButton).toHaveCSS('color', red);
});

test('tooltip shows on keyboard focus and after a hover delay', async ({ page }) => {
    const tooltip = page.locator('#tip-add');
    await expect(tooltip).toBeHidden();

    await tabTo(page, page.getByRole('button', { name: 'Add item' }).first());
    await expect(tooltip).toBeVisible();
    await page.evaluate(() => document.activeElement.blur());
    await expect(tooltip).toBeHidden();

    await page.getByRole('button', { name: 'Edit (tooltip below)' }).hover();
    await page.waitForTimeout(300);
    await expect(page.locator('#tip-edit')).toBeHidden();
    await expect(page.locator('#tip-edit')).toBeVisible({ timeout: 2000 });
});

test('skeleton animates unless reduced motion is preferred', async ({ page }) => {
    const skeleton = page.locator('.skeleton').first();
    await expect(skeleton).toHaveCSS('animation-name', 'skeletonShimmer');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(skeleton).toHaveCSS('animation-name', 'none');

    // A text skeleton is one line of the surrounding text tall.
    const textSkeleton = page.locator('.skeleton.text').first();
    await textSkeleton.evaluate((element) => { element.parentElement.style.lineHeight = '24px'; });
    await expect(textSkeleton).toHaveCSS('height', '24px');
});

test('custom-element-root removes the body margin', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toHaveCSS('margin-top', '8px');
    await body.evaluate((element) => element.classList.add('custom-element-root'));
    await expect(body).toHaveCSS('margin-top', '0px');
});
