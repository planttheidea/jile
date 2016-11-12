# migrations of major versions

#### 1.x.x => 2.x.x
* Breaking changes
    * `jile` now returns a complete `Jile` instance with the selectors as a property
    * `jile.remove()` is now instance-specific: `const instance = jile(styles); instance.remove();` and will not destroy the tag
    * The `styles` object is now the first parameter
    * Options (such as the id, whether the styles are hashed or not, etc.) are now consolidated to a single `options` object (second parameter)
    * `setPrefixer` is now more appropriately named `setPrefixerOptions`
* Additional methods
    * `jile.add()` programmatically adds the tag to the DOM
    * `jile.delete()` programmatically executes `jile.remove()` and deletes the instance from cache
    * `jile.set(styles: Object)` programmatically replaces the styles for the tag
* Additional options
    * `autoMount` should `jile` mount the tag automatically, defaults to `true`
    * `hashSelectors` should `jile` hash the selectors in the CSS, defaults to `true`
    * `id` value to assign to the `id` attribute of the `<style>` tag
    * `minify` should CSS be minified before adding to the tag, defaults to `false` in non-production environments and to `true` when `NODE_ENV` is `production` unless otherwise specified
    * `sourceMap` should a sourceMap be provided, defaults to `true` in non-production environments and to `false` when `NODE_ENV` is `production` unless otherwise specified