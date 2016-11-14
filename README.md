# jile

Manage your styles in JavaScript with the full power of CSS.

#### Installation

```
$ npm i jile --save
```
  
#### Usage

For those that have used both [CSS Modules](https://github.com/css-modules/css-modules) and [inline styles](https://facebook.github.io/react/tips/inline-styles.html), this should feel quite natural.

```javascript
import jile from 'jile';

const jileObject = jile({
  '.foo': {
    display: 'inline-block'
  }
});

const styles = jileObject.selectors;

const ExampleComponent = () => {
  return (
    <div className={styles.foo}>
      I have a scoped class Selector!
    </div>
  );
};
```

With output of:

```javascript
<div class="jile__foo__2202820774">
  I have a scoped class selector!
</div>
```

This example uses [React](https://github.com/facebook/react), but you can use it with anything as it has no dependencies on a particular view library or framework.

#### How it works

Any styles that you declare in the object passed to the `jile` function are parsed, scoped, autoprefixed, and converted into CSS which is injected into the head of the document as a `<style>` tag. Scoping entails hashing selectors (only ID and Class selectors will be hashed) so that you can use the same selector (such as `.container`) in many components without worrying about specificity or collision. The return from the `jile` function is a map of the selector names you provided to their respective hashed output names.

#### Why

*...not inline styles?*

Inline styles have become popular again for a reason ... everything is in JavaScript so it is dynamic, specificity is not a concern, and prefixing is handled easily, without the need for proprietary method calls (Compass, for example). That said, inline styles can only provide a limited subset of CSS ... `@media` queries, `@keyframes`, psuedo-selectors, etc. are all unable to be done with pure inline styles. Libraries like [Radium](https://github.com/FormidableLabs/radium) help with some of these aspects, but it still is incomplete.

*...not CSS Modules?*

CSS Modules solve the main problem that CSS has ... global everything. A lot of `jile` concepts are taken from CSS Modules, because you can leverage the full power of CSS while still scoping things to your component. That said, CSS adds another piece to your build process (more dependencies), and now requires consumers of your component to include a second reference (one for your JS, one for your CSS).

*... not both?*

This is the objective of `jile`, to combine the flexibility and power of CSS with the implementation simplicity of JS. It leverages a (hopefully) familiar syntax to make transitioning from styles to `jile`s quick and painless.

#### Basic usage

The keys you provide to your objects are the selectors that will be used, and you can get as wild with your selectors as you would like ... `#unique-container button > .crazy-stuff + i` will totally be respected.

```javascript
const styles = jile({
  '.basic': {
    display: 'inline-block'
  }
});

// or give it some options
const options = {
    id: 'my-magical-component',
    sourceMap: false
};

const styles = jile({
  '.basic': {
    display: 'inline-block'
  }
}, options);
```

#### Options

The following values can be passed in the `options` object as the second parameter to `jile`:

```javascript
{
    // should the tag be mounted upon creation | optional, defaults to true
    autoMount: Boolean,
    
    // should the selectors be hashed | optional, defaults to true
    hashSelectors: Boolean,
    
    // custom ID for the tag | optional, defaults to 'jile-stylesheet-{#}'
    id: String, 
    
    // should the CSS be minified | optional, defaults to true when in production, false otherwise
    minify: Boolean,
    
    // should the CSS have a sourceMap | optional, defaults to false when in production, true otherwise
    sourceMap: Boolean
}
```

#### Nested styles

Use the `&` before your child declarations to inherit from the parent.

```javascript
const styles = jile({
  '.parent': {
    color: '#333',
    fontSize: 32,
    
    '& .child': {
      color: '#777',
      fontSize: 14
    },
    
    '& > button::before': {
      content: '"I am a pseudo-element!"',
      display: 'block'
    }
  }
});
```

Creates the following output:

```css
.jile__parent__2351223888 {
  color: #333;
  font-size: 32px;
}
.jile__parent__2351223888 .jile__child__5403038 {
  color: #777;
  font-size: 14px;
}
.jile__parent__2351223888 > button::before {
  content: "I am a pseudo-element!";
  display: block;
}
```

#### Namespaced declarations

You can use all forms of `@` rules ... `@media`, `@keyframes`, even `@page`.

```javascript
const styles = jile({
  '@media screen and (max-width: 1000px)': {
    '.parent': {
      animation: '2s bouncing infinite linear'
    }
  },
  '@keyframes bouncing': {
    '0%': {
      marginTop: 0
    },
    '50%': {
      marginTop: -20
    },
    '100%': {
      marginTop: 0
    }
  },
  '@media print': {
    '.parent': {
      display: 'none'
    }
  },
  '@page': {
    size: 'Letter portrait'
  }
});
```

However, if you wanted to consolidate it, any `@media` declaration will inherit from the parent it is declared in:

```javascript
const styles = jile({
  '.parent': {
    '@media screen and (max-width: 1000px)': {
      animation: '2s bouncing infinite linear'
    },
    '@media print': {
      display: 'none'
    }
  }
  '@keyframes bouncing': {
    '0%': {
      marginTop: 0
    },
    '50%': {
      marginTop: -20
    },
    '100%': {
      marginTop: 0
    }
  },
  '@page': {
    size: 'Letter portrait'
  }
});
```

Both will produce the same CSS.

`@font-face` declarations include a little magic, as the "bulletproof font face" rule requires a double-declaration of the `src` attribute.

```javascript
const fontFaceStyles = jile({
    '@font-face': {
        fontFamily: 'WebFont',
        src: 'url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), ' +
           'url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), ' +
           'url("webfont.svg#svgFontName") format("svg")'
    }
});
```

Creates the following output:

```css
@font-face {
    font-family: WebFont;
    src: url("webfont.eot");
    src: url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg");
}
```
The injected `.eot` above the regular declaration is only if you provide an `.eot` in the provided object as one of the `src` values, as the injected declaration is for IE9 compat mode where as the `#iefix` declaration is for standard IE.

#### Global selectors

Sometimes you want to mix your scoped styles with your global styles, and you can easily do that with the `:global()` wrapper.

```javascript
const styles = jile({
    ':global(.unhashed-selector).hashedSelector': {
        display: 'block'
    }
});
```

Creates the following output:

```css
.unhashed-selector.jile__hashedSelector__12527111 {
    display: block;
}
```

#### Global stylesheets

You can create global stylesheets too! You get the same output, just minus the hashing.

```javascript
const globalStyles = {
    '.container': {
        height: '100vh'
    }
};

const options = {
    hashSelectors: false
};

jile(globalStyles, options);
```

Creates the following output:

```css
.container {
    height: 100vh;
}
```

#### Prefixing

All prefixing is handled by [inline-style-prefixer](https://github.com/rofrischmann/inline-style-prefixer) automatically, however if you want to customize the usage of the built-in prefixer, you can with the `setPrefixer` method.

```javascript
jile.setPrefixer({
  userAgent: 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'
});
```

If you going to customize the prefixer, it is advised you do before creating any stylesheets with it. The options passed to it are the same as the options passed to a `new Prefixer()` constructor in inline-styles-prefixer, so consult their documentation for the options available.

#### Managing a jile sheet

The object that is returned when you create a `jile` has several methods for you to manage the tag if you so choose.

* `jileObject.add()` will add the tag to the `document.head` if it is not already there
* `jileObject.remove()` will remove the tag from the `document.head` if it is there
* `jileObject.isMounted()` will return a `boolean` value for whether the `jile` tag is currently in the DOM or not
* `jileObject.delete()` will run `jileObject.remove()` and also delete it from the cache of object

#### Development

Pretty standard stuff, pull down the repo and `npm i`. There are some built-in scripts:
* `build` = runs webpack to build dist/jile.js
* `build:minified` = runs webpack to build dist/jile.min.js
* `clean` => runs rimraf to remove `lib` and `dist` folders
* `lint` => runs eslint on all files in `src`
* `prepublish:compile` = runs `clean`, `lint`, `test`, `transpile`, `build`, and `build:minified` scripts
* `start` = runs example app on localhost:3000 (it's a playground, have fun)
* `test` = runs [AVA](https://github.com/avajs/ava) test scripts
* `test:timed` runs `test`, but outputs completion times for each test
* `test:watch` runs `test`, but with persistent watcher
* `transpile` = transpiles files in `src` to `lib`

Happy jiling!
