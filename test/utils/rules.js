import test from 'ava';
import sinon from 'sinon';

import {
  keyframes,

  getAnimationName,
  getChildAnimationName,
  getCleanRules,
  getFlattenedRules,
  getFullKey,
  getKeyframesPrefixedDeclarataion,
  getKeyframeRules,
  getMediaQueryRules,
  getOnlyPopulatedRules,
  getRuleType,
  getSortedKeys
} from 'src/utils/rules';

import {
  DEFAULT_OPTIONS,
  KEYFRAMES_TYPE,
  MEDIA_QUERY_TYPE,
  PAGE_TYPE,
  STANDARD_TYPE
} from 'src/utils/constants';

import * as prefixUtils from 'src/utils/prefix';

test('if getAnimationName will return a cleaned object', (t) => {
  const keyframesMap = {
    bar: 'baz'
  };

  const object = {
    animation: 'bar 200ms'
  };
  const property = 'animation';

  const result = getAnimationName(object, property, keyframesMap);

  t.deepEqual(result, {
    animation: 'baz 200ms'
  })
});

test('if getChildAnimationName will return the jile name but replace all else', (t) => {
  const keyframesMap = {
    foo: 'bar'
  };

  const jileName = 'jile__foo__12345';

  const sameResult = getChildAnimationName(jileName, 'foo', keyframesMap);

  t.is(sameResult, jileName);

  const differentResult = getChildAnimationName('foo_bar_baz', 'foo', keyframesMap);

  t.is(differentResult, 'bar_bar_baz');
});

test('if getCleanRules only returns rules that do not have plain objects as values', (t) => {
  const rules = {
    foo: {},
    bar: 'bar',
    baz: 123
  };

  const result = getCleanRules(rules);

  t.deepEqual(result, {
    bar: 'bar',
    baz: 123
  });
});

test('if getFlattenedRules returns a flattened object of styles', (t) => {
  const styles = {
    '.foo': {
      '& .bar': {
        '& .baz': {
          display: 'block'
        }
      }
    }
  };
  const options = {
    ...DEFAULT_OPTIONS,
    autoMount: false,
    hashSelectors: false,
    root: ''
  };

  const result = getFlattenedRules(styles, options);

  t.deepEqual(result, {
    '.foo .bar .baz': {
      display: 'block'
    }
  })
});

test('if getFullKey adds the prefix and removes the &', (t) => {
  const root = 'foo';
  const key = '&.bar';

  const result = getFullKey(root, key);

  t.is(result, 'foo.bar');
});

test('if getKeyframesPrefixedDeclarataion creates the correct keyframes value', (t) => {
  const stub = sinon.stub(prefixUtils, 'getKeyframesPrefix', () => {
    return 'foo';
  });

  const id = 'bar';
  const key = '@keyframes baz';

  const result = getKeyframesPrefixedDeclarataion(key, id);

  t.is(result, '@foo baz');

  stub.restore();
});

test('if getKeyframeRules correctly builds the keyframe style object', (t) => {
  const key = '@keyframes foo';
  const value = {
    from: {
      color: 'red'
    },
    to: {
      color: 'blue'
    }
  };
  const id = 'bar';

  const result = getKeyframeRules(key, value, {id});

  t.deepEqual(result, {
    [key]: value
  })
});

test('if getMediaQueryRules returns the same object when root is top-level', (t) => {
  const value = {
    '.foo': {
      display: 'block'
    }
  };
  const options = {
    hashSelectors: true,
    id: 'foo'
  };

  const result = getMediaQueryRules(value, options);

  t.deepEqual(result, value);
});

test('if getMediaQueryRules returns the a nested object when root is not top-level', (t) => {
  const value = {
    '.foo': {
      display: 'block'
    }
  };
  const options = {
    hashSelectors: true,
    id: 'foo',
    root: '@media print'
  };

  const result = getMediaQueryRules(value, options);

  t.deepEqual(result, {
    '@media print': value
  });
});

test('if getOnlyPopulatedRules removes rules that are empty', (t) => {
  const rules = {
    'foo': {},
    'bar': {
      some: 'thing'
    },
    'baz': {}
  };

  const result = getOnlyPopulatedRules(rules);

  t.deepEqual(result, {
    bar: {
      some: 'thing'


    }
  });
});

test('if getRuleType matches the correct type', (t) => {
  const keyframes = '@keyframes stuff';
  const mediaQuery = '@media print';
  const page = '@page :first';
  const standard = '.foo';

  t.is(getRuleType(keyframes), KEYFRAMES_TYPE);
  t.is(getRuleType(mediaQuery), MEDIA_QUERY_TYPE);
  t.is(getRuleType(page), PAGE_TYPE);
  t.is(getRuleType(standard), STANDARD_TYPE);
});

test('if getSortedKeys returns the keys in the correct order', (t) => {
  const object = {
    '.foo': {},
    '@font-face': {},
    '.bar': {},
    '@keyframes baz': {},
    '.baz': {},
    '@page': {}
  };

  const result = getSortedKeys(object);

  t.deepEqual(result, [
    '@font-face',
    '@keyframes baz',
    '.foo',
    '.bar',
    '.baz',
    '@page'
  ]);
});
