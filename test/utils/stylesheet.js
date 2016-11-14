import test from 'ava';
import sinon from 'sinon';

import {
  buildPropertyValues,
  getHashedKeyframesName,
  getIndent,
  getKeyframesBlock,
  getMediaQueryBlockAndSelectorMap,
  getNewline,
  getStandardBlockAndSelectorMap,
  getVendorPrefix,
  minify,
  shouldApplyPxSuffix,
  sortKeyframesKeys
} from 'src/utils/stylesheet';

import * as generalUtils from 'src/utils/general';

test('if buildPropertyValues creates css text correctly', (t) => {
  const property = 'foo';
  const rule = {
    foo: 'bar'
  };

  const result = buildPropertyValues(property, rule);

  t.is(result, `\n  ${property}: ${rule[property]};`)
});

test('if getHashedKeyframesName will hash the keyframes name correctly', (t) => {
  const stub = sinon.stub(generalUtils, 'getHashedValue', (value, id) => {
    return `${value}-${id}`;
  });

  const selector = '@keyframes bar';
  const id = 'foo';
  const selectorMap = {};

  const result = getHashedKeyframesName(selector, id, selectorMap);

  t.is(result, '@keyframes bar-foo');

  stub.restore();
});

test('if getIndent returns the correct number of spaces', (t) => {
  const noIndentResult = getIndent();

  t.is(noIndentResult, '');

  const twoResult = getIndent(2);

  t.is(twoResult, '  ');

  const sixResult = getIndent(6);

  t.is(sixResult, '      ');
});

test('if getKeyframesBlock produces the correct css string', (t) => {
  const selector = '@keyframes foo';
  const rule = {
    from: {
      color: 'red'
    },
    to: {
      color: 'blue'
    }
  };
  const options = {
    hashSelectors: false,
    id: 'bar'
  };
  const selectorMap = {};

  const result = getKeyframesBlock(selector, rule, options, selectorMap);

  t.is(result, `
@keyframes foo {
  from {
    color: red;
  }
  to {
    color: blue;
  }
}`);
});

test('if getMediaQueryBlockAndSelectorMap produces the correct css string when hashSelectors is false', (t) => {
  const selector = '@media print';
  const rule = {
    '.foo': {
      display: 'none'
    }
  };
  const options = {
    hashSelectors: false,
    id: 'bar'
  };

  const {
    css,
    selectorMap
  } = getMediaQueryBlockAndSelectorMap(selector, rule, options);

  t.is(css, `
@media print {
  .foo {
    display: none;
  }
}`);
  t.deepEqual(selectorMap, {});
});

test('if getMediaQueryBlockAndSelectorMap produces the correct css string when hashSelectors is true', (t) => {
  const selector = '@media print';
  const rule = {
    '.foo': {
      display: 'none'
    }
  };
  const options = {
    hashSelectors: true,
    id: 'bar'
  };

  const {
    css,
    selectorMap
  } = getMediaQueryBlockAndSelectorMap(selector, rule, options);

  t.is(css, `
@media print {
  .jile__foo__3126029035 {
    display: none;
  }
}`);
  t.deepEqual(selectorMap, {foo: 'jile__foo__3126029035'});
});

test('if getNewline returns the correct number of newlines', (t) => {
  const oneNewlineResult = getNewline();

  t.is(oneNewlineResult, '\n');

  const threeNewlineResult = getNewline(3);

  t.is(threeNewlineResult, '\n\n\n');

  const sixNewlineResult = getNewline(6);

  t.is(sixNewlineResult, '\n\n\n\n\n\n');
});

test('if getStandardBlockAndSelectorMap produces the correct css string and selector map when hashSelectors is false', (t) => {
  const selector = '.foo';
  const rule = {
    display: 'block'
  };
  const options = {
    hashSelectors: false,
    id: 'bar'
  };

  const {
    css,
    selectorMap
  } = getStandardBlockAndSelectorMap(selector, rule, options, false);

  t.is(css, `
.foo {
  display: block;
}`);

  t.deepEqual(selectorMap, {});
});

test('if getStandardBlockAndSelectorMap produces the correct css string and selector map when hashSelectors is true', (t) => {
  const selector = '.foo';
  const rule = {
    display: 'block'
  };
  const options = {
    hashSelectors: true,
    id: 'bar'
  };

  const {
    css,
    selectorMap
  } = getStandardBlockAndSelectorMap(selector, rule, options, false);

  t.is(css, `
.jile__foo__3126029035 {
  display: block;
}`);

  t.deepEqual(selectorMap, {foo: 'jile__foo__3126029035'});
});

test('if getVendorPrefix returns the corrent property based on original value', (t) => {
  const webkitProp = 'WebkitAppearance';
  const mozProp = 'MozAppearance';
  const oProp = 'OAppearance';
  const msProp = 'msAppearance';
  const standardProp = 'appearance';

  t.is(getVendorPrefix(webkitProp), '-webkit-appearance');
  t.is(getVendorPrefix(mozProp), '-moz-appearance');
  t.is(getVendorPrefix(oProp), '-o-appearance');
  t.is(getVendorPrefix(msProp), '-ms-appearance');
  t.is(getVendorPrefix(standardProp), 'appearance');
});

test('if minify compresses the CSS appropriately', (t) => {
  const css = `.foo {
    display: block;
  }`;

  const expectedResult = '.foo{display:block}';

  t.is(minify(css), expectedResult);
});

test('if shouldApplyPxSuffix correctly identifies unitless properties and values', (t) => {
  const noApplyProperty = 'lineHeight';
  const noApplyValue = 1;

  const noApplyResult = shouldApplyPxSuffix(noApplyProperty, noApplyValue);

  t.false(noApplyResult);

  const applyProperty = 'padding';
  const applyValue = 15;

  const applyResult = shouldApplyPxSuffix(applyProperty, applyValue);

  t.true(applyResult);
});

test('if sortKeyframesKeys sorts from and too correctly', (t) => {
  const beforeResult = sortKeyframesKeys('from', 'to');
  const afterResult = sortKeyframesKeys('to', 'from');

  t.is(beforeResult, -1);
  t.is(afterResult, 1);
});

test('if sortKeyframesKeys sorts numericValues correctly', (t) => {
  const beforeResult = sortKeyframesKeys('4%', '10%');
  const afterResult = sortKeyframesKeys('30%', '2%');

  t.false(beforeResult);
  t.true(afterResult);
});
