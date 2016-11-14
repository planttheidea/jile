import test from 'ava';

import {
  getCssAndSelectorMap
} from 'src/stylesheet';

import {
  getHashedSelector
} from 'src/utils/general';

const ID = 'foo';
const FOO = 'foo';
const BAR = 'bar';
const rules = {
  [`@keyframes ${FOO}`]: {
    from: {
      color: 'red'
    },
    to: {
      color: 'blue'
    }
  },
  '@media screen and (min-width: 1000px)': {
    [`.${FOO}`]: {
      display: 'block'
    }
  },
  [`.${BAR}`]: {
    backgroundColor: 'white'
  }
};

test('if getCssAndSelectorMap returns the css expected when not hashing selectors', (t) => {
  const options = {
    autoMount: false,
    hashSelectors: false,
    id: ID,
    minify: false,
    sourceMap: false
  };

  const result = getCssAndSelectorMap(rules, options);

  t.deepEqual(result, {
    css: `
@keyframes foo {
  from {
    color: red;
  }
  to {
    color: blue;
  }
}
@media screen and (min-width: 1000px) {
  .${FOO} {
    display: block;
  }
}
.${BAR} {
  background-color: white;
}`,
    selectorMap: {}
  });
});

test.only('if getCssAndSelectorMap returns the css expected when hashing selectors', (t) => {
  const id = 'foo';
  const options = {
    autoMount: false,
    hashSelectors: true,
    id,
    minify: false,
    sourceMap: false
  };

  const result = getCssAndSelectorMap(rules, options);
  const {
    selector: hashedFoo
  } = getHashedSelector(`.${FOO}`, ID);
  const {
    selector: hashedBar
  } = getHashedSelector(`.${BAR}`, ID);

  const css = `
@keyframes ${hashedFoo.slice(1)} {
  from {
    color: red;
  }
  to {
    color: blue;
  }
}
@media screen and (min-width: 1000px) {
  ${hashedFoo} {
    display: block;
  }
}
${hashedBar} {
  background-color: white;
}`;

  t.deepEqual(result, {
    css,
    selectorMap: {
      foo: hashedFoo.slice(1),
      bar: hashedBar.slice(1)
    }
  });
});