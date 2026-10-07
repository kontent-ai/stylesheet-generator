// Inlines the freshly built styles.css and dropdown.js into showcase.html, so the
// showcase keeps working on htmlpreview.github.io (the built CSS is not committed).
const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, '..', 'styles');
const showcasePath = path.join(stylesDir, 'showcase.html');

const css = fs.readFileSync(path.join(stylesDir, 'styles.css'), 'utf8')
    .replace(/\n?\/\*# sourceMappingURL=.*\*\/\s*$/, '')
    .trim();
const js = fs.readFileSync(path.join(stylesDir, 'dropdown.js'), 'utf8').trim();

const inline = (html, name, tag, content) => {
    const pattern = new RegExp(`(<!-- stylekit:${name} -->)[\\s\\S]*?(<!-- /stylekit:${name} -->)`);
    if (!pattern.test(html)) {
        throw new Error(`showcase.html is missing the stylekit:${name} markers`);
    }
    return html.replace(pattern, (_, start, end) => `${start}\n<${tag}>\n${content}\n</${tag}>\n${end}`);
};

let html = fs.readFileSync(showcasePath, 'utf8');
html = inline(html, 'css', 'style', css);
html = inline(html, 'js', 'script', js);
fs.writeFileSync(showcasePath, html);
