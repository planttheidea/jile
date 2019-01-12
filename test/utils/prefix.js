import test from 'ava';

import {
  getKeyframesPrefix,
  prefix,
  setPrefixerOptions,
} from 'src/utils/prefix';

test('if getKeyframesPrefix returns valid prefix', (t) => {
  const keyframesPrefix = getKeyframesPrefix();

  t.is(keyframesPrefix, 'keyframes');
  t.not(keyframesPrefix, '-webkit-keyframes');
  t.not(keyframesPrefix, '-o-keyframes');
  t.not(keyframesPrefix, '-moz-keyframes');
});

test.serial('if prefix will prefix the styles passed to it', (t) => {
  setPrefixerOptions({
    userAgent: 'Mozilla/5.0 (X11; NetBSD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
  });

  const result = prefix({
    appearance: 'none',
  });

  t.deepEqual(result, {
    WebkitAppearance: 'none',
  });

  setPrefixerOptions({});
});

test.serial('if setPrefixerOptions sets userAgent and prefix provides prefixed values correctly', (t) => {
  setPrefixerOptions({
    userAgent: 'Mozilla/5.0 (X11; NetBSD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
  });

  const webkitKeyframesPrefix = getKeyframesPrefix();

  t.is(webkitKeyframesPrefix, '-webkit-keyframes');

  setPrefixerOptions({
    userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.28) Gecko/20120306 Firefox/5.0.1',
  });

  const mozAppearance = prefix({
    appearance: 'none',
  });

  t.deepEqual(mozAppearance, {
    MozAppearance: 'none',
  });
});
