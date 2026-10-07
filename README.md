# Custom CSS for Kontent.ai integrations

## Overview

The SCSS/CSS file defines classes for elements commonly used when developing a custom element or an open source tool that seeks to maintain Kontent.ai visual identity, such as inputs, buttons, etc. It also comes with predefined color classes, using a palette from Kontent.ai application interface. The color classes can be combined with most of the element classes to streamline the styling process.

## Installation

Install using your preferred package manager. 
```
npm i @kontent-ai/stylekit
```
If your environment supports it (e.g. you're using a bundler), you can import the styles directly:

```javascript
import '@kontent-ai/stylekit';
```

Alternatively, you can link the CSS from `node_modules`:

```html
<link rel="stylesheet" href="node_modules/@kontent-ai/stylekit/styles/styles.css">
```

## Colors

There are twelve base colors defined in the CSS, wrapped in a matching number of color classes of the same name (minus the CSS custom property syntax `--`). These are as follows:

![color palette](assets/palette.png)

You can combine the color classes with most of the elements in the following manner:

```html
<div class="button red">Red button</div>
```

If you want to use any of the colors in your own class, use CSS `var()` function, e.g. `color: var(--red)`.

The color classes are `red`, `green`, `blue`, `purple`, `orange`, `ocean`, `midnight-blue`, `burgundy`, `light-grey`, `grey`, `dark-grey` and `black`. A `--white` (`#ffffff`) custom property is also defined for use in your own styles, but there is no `white` color class.

> [!NOTE]  
> Class names do not correspond to their CSS color counterparts. All colors are custom, matching the Kontent.ai application interface.

## Global helpers

- `.disabled`: can be added to any element (button, input, switch, checkbox, radio, dropdown…); sets `opacity` to 0.5 and disables pointer events.
- Font: `html`, `body` and any `.custom-element` wrapper get `font-family: sans-serif`.

## Basic styles

One-class-does-it-all styles with optional modifiers.

### .button

A round, color-filled button with a hover animation. Defaults to upper-case font, which can be overridden using `no-caps` helper class.

#### Modifiers

- `secondary`: bordered button, sets background color to `white`, defaults font color to `black`
- `destructive`: specific style for **Delete** and similar actions, matches UI
- `[color-class-name]`: affects `border-color` and `background-color ::hovered`, `background-color` for secondary only
- `no-caps`: sets `text-transform` to `none`
- `disabled`: sets `opacity` to 0.5 and disables pointer events

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#button)
```html
<div class="button destructive">Delete</div>
<div class="button green">Save</div>
<div class="button secondary">Cancel</div>
```

> [!TIP]
> Buttons follow their UI hierarchy. Default (primary) button is filled, secondary button is bordered. 
>
> `destructive` is a standalone style and shouldn't be combined with `secondary` modifier.

### .input

Base class for all kinds of inputs, comes in a form of rounded box with hover effect.

#### Modifiers

- `[color-class-name]`: affects `border-color` and its `:hover` state
- `type="text"`: sets cursor to `text`
- `disabled`: sets `opacity` to 0.5 and disables pointer events

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#text-input)
```html
<input class="input" placeholder="Insert something" type="text">
```

### .status

A small pill-shaped informative element with optional colored background. Useful e.g. for displaying a loading status of an asynchronously fetched asset.

#### Modifiers

- `[color-class-name]`: affects `border-color`, `background-color` and sets font `color` to `white`

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#status)
```html
<div class="status red">Loading failed.</div>
```

### .section

A bordered area for content, with round corners and predefined padding, suitable for separating UI elements.

#### Modifiers

- `[color-class-name]`: affects `border-color`

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#section)
```html
<div class="section">
    <div>Some text content</div>
    <div class="button">Button</div>
</div>
```

### .section.info

Same as section but with background color set to 10% of border color. Suitable for warning or info boxes.

#### Modifiers

- `[color-class-name]`: affects `border-color`, `background-color`

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#section-info)
```html
<div class="section info red">
    <h2>Warning</h2>
    <p>Some warning message.</p>
</div>
```

### .loader

A simple animation to display if the custom element is busy loading a resource, e.g. from an asynchronous operation.

Apply dynamically and combine with `pointer-events: none` to prevent user interaction.

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#loader)
```html
<div class="loader"></div>
```

#### Modifiers

- `[color-class-name]`: affects the loader colors

## Composed styles

Multiple classes meant to be used together to achieve the desired style.

### Switch

Modified checkbox in form of an animated on/off switch.

Markup: a `<label class="switch">` that contains the `<input type="checkbox">`, immediately followed by a `<span class="slider">`. The text label can go before the input. The input must come before `.slider` because the styles use the `input:checked ~ .slider` sibling selector.

#### Classes
- `.switch`, `.slider`

#### Modifiers
- `slider [color-class-name]`: affects color of a toggled switch
- `disabled`: sets `opacity` to 0.5 and disables pointer events

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#switch)
```html
<label class="switch">
    Switch
    <input type="checkbox">
    <span class="slider red"></span>
</label>
```

### Checkbox

Animated checkbox in UI colors.

Markup: a `<label class="checkbox">` that contains the `<input type="checkbox">`, immediately followed by a `<span class="checkmark">`, then the label text.

#### Classes
- `.checkbox`, `.checkmark`

#### Modifiers
- `disabled`: sets `opacity` to 0.5 and disables pointer events

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#checkbox-and-radio)
```html
<label class="checkbox">
    <input type="checkbox">
    <span class="checkmark"></span>
    Expert
</label>
```

### Radio

Animated radio buttons in UI colors.

Markup: a `<label class="radio">` that contains the `<input type="radio">`, immediately followed by a `<span class="radio-button">`, then the label text. Give radios in the same group the same `name`.

#### Classes
- `.radio`, `.radio-button`

#### Modifiers
- `disabled`: sets `opacity` to 0.5 and disables pointer events

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#checkbox-and-radio)
```html
<label class="radio">
    <input type="radio" name="radio" checked>
    <span class="radio-button"></span>
    Option 1
</label>

<label class="radio">
    <input type="radio" name="radio">
    <span class="radio-button"></span>
    Option 2
</label>
```

### Dropdown

Input in form of an animated dropdown menu with multiple options. The markup is a `.select` element immediately followed by its `.options` list.

#### Classes

- `.select`, `.options`, `.option`

#### Modifiers

- `.option.selected`: highlights the currently selected option in the dropdown
- `.select.open`: when the `open` class is set, it applies animated 180 degree rotation to the arrow. Rotates back when the class is removed.
- `[color-class-name]` on `.select`: affects `border-color` and its `:hover` state
- `disabled`: sets `opacity` to 0.5 and disables pointer events

#### Usage example
[![Button Click]](https://htmlpreview.github.io/?https://github.com/kontent-ai/stylesheet-generator/blob/main/styles/showcase.html#select)
```html
<div class="select">Pick an option</div>
<div class="options">
    <div class="option">Available option</div>
    <div class="option selected" data-value="selected">Selected option</div>
</div>

<script src="node_modules/@kontent-ai/stylekit/styles/dropdown.js"></script>
<script>
    StylekitDropdown.initDropdowns();
</script>
```

#### JavaScript

CSS alone can't open or close the dropdown, so the package ships `styles/dropdown.js`. It's a small helper with no dependencies:

- `StylekitDropdown.initDropdowns(root = document)` sets up every `.select` that is immediately followed by an `.options` element, or that points to one with `aria-controls`. `StylekitDropdown.initDropdown(select, options?)` sets up a single dropdown. Both are safe to call more than once and return `{ open(), close(), destroy() }` handles.
- Click or press Enter, Space or the arrow keys on `.select` to open the dropdown. Arrow keys, Home and End move between options. Enter, Space or a click picks an option. Escape, Tab or a click outside closes the dropdown.
- Picking an option moves `.selected` to that option, replaces the text of `.select` with the option's text, and fires a bubbling `change` event on `.select` with `event.detail = { value, option }`. `value` is the option's `data-value` attribute, or its text if there is none.
- The helper sets the ARIA roles (`combobox`, `listbox`, `option`), `aria-expanded`, `aria-selected` and `tabindex`, and hides the list with the `hidden` attribute.
- A `.select.disabled` dropdown never opens and is taken out of the tab order.

With a bundler: `const { initDropdowns } = require('@kontent-ai/stylekit/styles/dropdown.js');` (or the equivalent `import`).

If you'd rather wire the dropdown yourself, your code needs to: show and hide `.options`, toggle `open` on `.select`, move `selected` to the picked `.option`, and handle the keyboard and clicks outside the dropdown.

> [!NOTE]
> You can also use the `select` class on a native `<select>` element. Its default styling is removed by `appearance: none`, so no JavaScript is needed, but the options list is drawn by the browser.

## Contributing

Clone the repository and adjust the **styles.scss** file accordingly. To test the styles locally, run `npm run build`. This builds the **styles.css** file and its map, and copies the fresh CSS and **dropdown.js** inline into **showcase.html**, between the `stylekit:css` / `stylekit:js` markers. Commit the updated **showcase.html**; **styles.css** is only published to npm.

## Changelog

### 1.1.0

- Removed the `crimson` color modifiers. `--crimson` was never defined, so they produced invalid CSS.
- Defined `--white`, so `.button.secondary` now gets the white background it was documented to have.
- Added `styles/dropdown.js`, an accessible helper for the dropdown (keyboard, click outside to close, ARIA), and a focus style for keyboard-highlighted options.
- Showcase: unique ids, the dropdown now uses the helper, and its CSS is regenerated on every build.
- README: documented the global helpers, the exact switch/checkbox/radio markup and the dropdown helper.

<!--[ Buttons ]-->

[Button Click]: https://img.shields.io/badge/See_live-37a779?style=for-the-badge
