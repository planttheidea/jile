# jile

Manage your styles in JavaScript with the full power of CSS.

#### Installation

    $ npm i jile --save
  
#### Usage

For those that have used both [CSS Modules](https://github.com/css-modules/css-modules) and [inline styles](https://facebook.github.io/react/tips/inline-styles.html), this should feel quite natural.

```
import jile from 'jile';
...
const styles = jile({
  '.selector': {
    display: 'inline-block
  }
});
...
const ExampleComponent = () => {
  return (
    <div className={styles.selector}>
      I have a scoped class Selector!
    </div>
  );
};
```
With output of:
```
<div class="jile__selector__2202820774">
  I have a scoped class selector!
</div>
```

This example uses [React](https://github.com/facebook/react), but it you can use it with anything as it has no dependencies on a particular library.

#### How it works

Any styles that you declare in the object passed to the `jile` function are parsed, scoped, autoprefixed, and converted into valid CSS which is injected into the head of the document. Scoping entails hashing selectors (only ID and Class selectors will be hashed) so that you can use the same selector (such as `.container`) in many components without worrying about specificity or collision. The return from the `jile` function is a map of the selector names you provided to their respective hashed output names.

#### Why

**...not inline styles?**

Inline styles have become popular again for a reason ... everything is in JavaScript so it is dynamic, specificity is not a concern, and prefixing is handled easily, without the need for proprietary method calls (Compass, for example). That said, inline styles can only provide a limited subset of CSS ... `@media` queries, `@keyframes`, psuedo-selectors, etc. are all unable to be done with pure inline styles. Libraries like [Radium](https://github.com/FormidableLabs/radium) help with some of these aspects, but it still is incomplete.

**...not CSS Modules?**

CSS Modules solve the main problem that CSS has ... global everything. A lot of `jile` concepts are taken from CSS Modules, because you can leverage the full power of CSS while still scoping things to your component. That said, CSS adds another piece to your build process (more dependencies), and now requires consumers of your component to include a second reference (one for your JS, one for your CSS).

**... not both?**

This is the objective of `jile`, to combine the flexibility and power of CSS with the implementation simplicity of JS. It leverages a (hopefully) familiar syntax to make transitioning from styles to `jile`s quick and painless.

#### Examples

**Basic usage**

The keys you provide to your objects are the selectors that will be used, and you can get as wild with your selectors as you would like ... `#unique-container button > .crazy-stuff + i` will totally be respected.
```
const styles = jile({
  '.basic': {
    display: 'inline-block'
  }
});

// or give it a custom ID

const styles = jile('my-magical-component', {
  '.basic': {
    display: 'inline-block'
  }
});
```
**Nested children**

Use the `&` before your child declarations to inherit from the parent.
```
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
Translates to:
```
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
**@ declarations**

You can use all forms of `@media` or `@keyframes`, even `@page`.
```
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
```
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

**Just the styles, Jack.**

By default `jile` will inject a `<style>` tag into your `document`'s `<head>`, however if you are building a universal app and want to handle the injection yourself, `noInject` is a convenience function that will return an object with both the CSS and the selectorMap.
```
const stylesObj = jile.noInject('still-can-have-custom-id', {
  '.parent': {
    display: 'block'
  }
});
const css = stylesObj.css;
const selectorMap = stylesObj.selectorMap;
```

**Prefixing**

All prefixing is handled by [inline-style-prefixer](https://github.com/rofrischmann/inline-style-prefixer) automatically, however if you want to customize the usage of the built-in prefixer, you can with the `setPrefixer` method.
```
jile.setPrefixer({
  userAgent: 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'
});
```
If you going to customize the prefixer, it is advised you do before creating any stylesheets with it. The options passed to it are the same as the options passed to a `new Prefixer()` constructor in inline-styles-prefixer, so consult their documentation for the options available.

**Removing a jile stylesheet**

This is a rare use case, as your styles all being scoped should prevent conflict, however if you do have a need to do it you can use the `remove` method.
```
jile.remove('id-you-assigned-before');
```
This requires an ID to be passed, so it is advised you create the original `jile` with a custom ID.

#### Local Development

Pretty standard stuff, pull down the repo and `npm i`. There are some built-in scripts:
* `npm run build` = build dist/jile.js
* `npm run build-minified` = build dist/jile.min.js
* `npm run compile` = transpile files in src/* to lib/*
* `npm run example` = runs example app on localhost:4000 (it's a playground, have fun)
* `npm run prepublish` = runs the above `compile`, `build`, and `build-minified` scropts
* `npm run test` = runs [AVA](https://github.com/avajs/ava) test scripts
* `npm run test-timed` runes same scripts as `test`, but outputs completion times for each test

Happy jiling!
