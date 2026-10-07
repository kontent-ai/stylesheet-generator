const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: 'tests',
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
    use: { ...devices['Desktop Chrome'], viewport: { width: 1400, height: 900 } },
});
