/*
 * @kontent-ai/stylekit dropdown helper (for plain HTML pages)
 *
 * Don't use it on markup rendered by React, Vue, Svelte, etc.: it changes the DOM directly.
 * Frameworks should follow the "Dropdown contract" in the README instead.
 *
 * Makes `.select` + `.options` + `.option` markup work as an accessible dropdown:
 * click or keyboard to open, arrow keys / Home / End to move, Enter or Space to pick,
 * Escape, Tab or a click outside to close. No dependencies.
 *
 * Usage (script tag):  StylekitDropdown.initDropdowns();
 * Usage (bundler):     const { initDropdowns } = require('@kontent-ai/stylekit/styles/dropdown.js');
 *
 * Picking an option fires a bubbling `change` event on the `.select` element with
 * `event.detail = { value, option }`.
 */
(function (global) {
    'use strict';

    var instances = typeof WeakMap === 'function' ? new WeakMap() : null;
    var idCounter = 0;

    function ensureId(element, prefix) {
        if (!element.id) {
            idCounter += 1;
            element.id = prefix + '-' + idCounter;
        }
        return element.id;
    }

    function findOptionsList(select) {
        var controlled = select.getAttribute('aria-controls');
        if (controlled) {
            var byId = select.ownerDocument.getElementById(controlled);
            if (byId) {
                return byId;
            }
        }
        var sibling = select.nextElementSibling;
        return sibling && sibling.classList.contains('options') ? sibling : null;
    }

    function isDisabled(element) {
        return element.classList.contains('disabled') || element.getAttribute('aria-disabled') === 'true';
    }

    function initDropdown(select, optionsList) {
        if (instances && instances.has(select)) {
            return instances.get(select);
        }

        var list = optionsList || findOptionsList(select);
        if (!list) {
            throw new Error('stylekit dropdown: no .options element found for .select');
        }

        var doc = select.ownerDocument;

        function getOptions() {
            return Array.prototype.filter.call(list.querySelectorAll('.option'), function (option) {
                return !isDisabled(option);
            });
        }

        function isOpen() {
            return !list.hidden;
        }

        function focusOption(option) {
            if (option) {
                option.focus();
            }
        }

        function open() {
            if (isOpen() || isDisabled(select)) {
                return;
            }
            list.hidden = false;
            select.classList.add('open');
            select.setAttribute('aria-expanded', 'true');
            doc.addEventListener('pointerdown', onPointerDownOutside, true);
            focusOption(list.querySelector('.option.selected') || getOptions()[0]);
        }

        function close(returnFocus) {
            if (!isOpen()) {
                return;
            }
            list.hidden = true;
            select.classList.remove('open');
            select.setAttribute('aria-expanded', 'false');
            doc.removeEventListener('pointerdown', onPointerDownOutside, true);
            if (returnFocus) {
                select.focus();
            }
        }

        function choose(option) {
            Array.prototype.forEach.call(list.querySelectorAll('.option'), function (other) {
                other.classList.toggle('selected', other === option);
                other.setAttribute('aria-selected', other === option ? 'true' : 'false');
            });
            var label = option.textContent.trim();
            select.textContent = label;
            close(true);
            select.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                detail: { value: option.getAttribute('data-value') || label, option: option },
            }));
        }

        function onPointerDownOutside(event) {
            if (!select.contains(event.target) && !list.contains(event.target)) {
                close(false);
            }
        }

        function onSelectClick() {
            if (isOpen()) {
                close(true);
            } else {
                open();
            }
        }

        function onSelectKeyDown(event) {
            switch (event.key) {
                case 'Enter':
                case ' ':
                case 'ArrowDown':
                case 'ArrowUp':
                    event.preventDefault();
                    open();
                    break;
                case 'Escape':
                    close(true);
                    break;
            }
        }

        function onListClick(event) {
            var option = event.target.closest('.option');
            if (option && list.contains(option) && !isDisabled(option)) {
                choose(option);
            }
        }

        function onListKeyDown(event) {
            var options = getOptions();
            var index = options.indexOf(doc.activeElement);
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    focusOption(options[Math.min(index + 1, options.length - 1)]);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    focusOption(options[Math.max(index - 1, 0)]);
                    break;
                case 'Home':
                    event.preventDefault();
                    focusOption(options[0]);
                    break;
                case 'End':
                    event.preventDefault();
                    focusOption(options[options.length - 1]);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    if (index !== -1) {
                        choose(options[index]);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    close(true);
                    break;
                case 'Tab':
                    close(false);
                    break;
            }
        }

        select.setAttribute('role', 'combobox');
        select.setAttribute('aria-haspopup', 'listbox');
        select.setAttribute('aria-expanded', 'false');
        select.setAttribute('aria-controls', ensureId(list, 'stylekit-options'));
        if (isDisabled(select)) {
            select.setAttribute('aria-disabled', 'true');
            select.setAttribute('tabindex', '-1');
        } else if (!select.hasAttribute('tabindex')) {
            select.setAttribute('tabindex', '0');
        }

        list.setAttribute('role', 'listbox');
        list.hidden = true;
        Array.prototype.forEach.call(list.querySelectorAll('.option'), function (option) {
            option.setAttribute('role', 'option');
            option.setAttribute('tabindex', '-1');
            option.setAttribute('aria-selected', option.classList.contains('selected') ? 'true' : 'false');
        });

        select.addEventListener('click', onSelectClick);
        select.addEventListener('keydown', onSelectKeyDown);
        list.addEventListener('click', onListClick);
        list.addEventListener('keydown', onListKeyDown);

        var instance = {
            open: open,
            close: function () { close(false); },
            destroy: function () {
                close(false);
                select.removeEventListener('click', onSelectClick);
                select.removeEventListener('keydown', onSelectKeyDown);
                list.removeEventListener('click', onListClick);
                list.removeEventListener('keydown', onListKeyDown);
                if (instances) {
                    instances.delete(select);
                }
            },
        };
        if (instances) {
            instances.set(select, instance);
        }
        return instance;
    }

    function initDropdowns(root) {
        var scope = root || document;
        return Array.prototype.map.call(scope.querySelectorAll('.select'), function (select) {
            return findOptionsList(select) ? initDropdown(select) : null;
        }).filter(Boolean);
    }

    var api = { initDropdown: initDropdown, initDropdowns: initDropdowns };

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        global.StylekitDropdown = api;
    }
})(typeof window !== 'undefined' ? window : this);
