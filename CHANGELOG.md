# Changelog

## 1.1.0

- Defined `--crimson` as `#cf3a4e`, the Kontent.ai brand's primary red. The `crimson` modifiers existed in 1.0.0 but referenced an undefined property, so they produced invalid CSS; they now work.
- Defined `--white`, so `.button.secondary` now gets the white background it was documented to have.
- Added `styles/styles.layered.css`: the same styles inside `@layer stylekit`, so your own CSS always wins. The default `styles.css` is unchanged and stays unlayered.
- Added namespaced `--kontent-*` aliases for every color custom property.
- Added `styles/tailwind.css`, a Tailwind CSS v4 theme with the palette as `kontent-*` colors, plus instructions for using the stylekit with Tailwind, Less and Sass.
- Moved the palette to `styles/_tokens.scss`, the single source for the custom properties, color classes and Tailwind theme.
- Switched the font from `sans-serif` to Inter, the Kontent.ai app's font, bundled with the package (56 kB Latin subset, SIL Open Font License 1.1). Override it with `--kontent-font-family`.
- Fixed the input placeholder style, which never applied because of a `:placeholder` typo. Placeholders are now `#6f6f6f` (the app's hint color) instead of the illegible `--light-grey` the README used to promise.
- Added a visible keyboard focus ring (`#0093ff`, `--kontent-focus-color`) to inputs, dropdowns, buttons, switches, checkboxes and radios, matching the app.
- Made the Sass tokens configurable (`!default`, forwarded from `styles.scss`). `$custom-colors` adds or overrides colors.
- Added `.custom-element-root`, an opt-in `<body>` reset for custom elements.
- Added an `exports` field to `package.json`: the package root resolves to the CSS (or the SCSS for Sass), and every file under `styles/` stays importable by path.
- Added `.tag` with `.tag-remove`, `.icon-button` (with `destructive`), a CSS-only tooltip (`.has-tooltip` + `.tooltip`, `.tooltip.bottom`) and `.skeleton` (`text`, `circle`), all matching the app's components.
- Added `.input-label` for field labels, and documented `.input` on `<textarea>`.
- Added an invalid state for `.input` and `.select` (`aria-invalid="true"` or `invalid`) and `.input-caption` / `.input-caption.invalid` for helper and error messages, matching the app's input alert state.
- Documented the dropdown contract (classes, ARIA, keyboard) and added a React + TypeScript example component.
- Added `styles/dropdown.js`, an accessible dropdown helper for plain HTML (keyboard, click outside to close, ARIA), and a focus style for keyboard-highlighted options.
- Showcase: unique ids, the dropdown now uses the helper, and its CSS is regenerated on every build.
- README: documented the global helpers, the exact switch/checkbox/radio markup and the dropdown helper.
