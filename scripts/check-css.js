// Fails when the built CSS uses a custom property that is never defined (like the old
// `var(--crimson)`), unless the var() has a fallback value.
const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, '..', 'styles');
let failed = false;

for (const file of ['styles.css', 'styles.layered.css']) {
    const css = fs.readFileSync(path.join(stylesDir, file), 'utf8');
    const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
    const undefinedVars = new Set(
        [...css.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)]
            .map((match) => match[1])
            .filter((name) => !defined.has(name)),
    );

    if (undefinedVars.size > 0) {
        failed = true;
        console.error(`${file}: undefined custom properties: ${[...undefinedVars].join(', ')}`);
    } else {
        console.log(`${file}: all custom properties are defined`);
    }
}

process.exit(failed ? 1 : 0);
