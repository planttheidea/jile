import test from 'ava';

import {
  getKeyframesPrefix,
  prefix,
  setPrefixer
} from '../../src/utils/prefix';

test('getKeyframesPrefix returns valid prefix', (t) => {
  const keyframesPrefix = getKeyframesPrefix();

  t.is(keyframesPrefix, 'keyframes');
  t.not(keyframesPrefix, '-webkit-keyframes');
  t.not(keyframesPrefix, '-o-keyframes');
  t.not(keyframesPrefix, '-moz-keyframes');
});

test('setPrefix sets userAgent and prefix provides prefixed values correctly',  (t) => {
  setPrefixer({
    userAgent: 'Mozilla/5.0 (X11; NetBSD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36'
  });

  const webkitKeyframesPrefix = getKeyframesPrefix();

  t.is(webkitKeyframesPrefix, '-webkit-keyframes');

  setPrefixer({
    userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.28) Gecko/20120306 Firefox/5.0.1'
  });

  const mozAppearance = prefix({
    appearance: 'none'
  });

  t.deepEqual(mozAppearance, {
    MozAppearance: 'none'
  });
});