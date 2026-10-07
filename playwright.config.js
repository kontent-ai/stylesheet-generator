const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: 'tests',
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
    // Baselines are only rendered in the pinned CI container, so they need no platform suffix.
    snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
    // The CI container renders deterministically, so compare exactly: a slightly wrong
    // color is exactly the kind of regression these screenshots are for.
    expect: { toHaveScreenshot: { threshold: 0, maxDiffPixels: 0 } },
    use: { ...devices['Desktop Chrome'], viewport: { width: 1400, height: 900 } },
});
