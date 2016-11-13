import test from 'ava';
import sinon from 'sinon';

import {
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

test.todo('getAnimationName');
test.todo('getChildAnimationName');
test.todo('getCleanRules');

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

test.todo('getKeyframeRules');
test.todo('getMediaQueryRules');

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
