import test from 'ava';

import {
  isKeyframes,
  isMediaQuery,
  isNestedProperty,
  isPage
} from '../src/is';

test('if selector key passed in is an @keyframes declaration', (t) => {
  const isKeyframesTrue = isKeyframes('@keyframes test');
  const isKeyframesFalseMediaPrint = isKeyframes('@media print');
  const isKeyframesFalseMediaScreenWidth = isKeyframes('@media screen and (min-width: 1000px)');
  const isKeyframesFalsePage = isKeyframes('@media screen and (min-width: 1000px');

  t.true(isKeyframesTrue);
  t.false(isKeyframesFalseMediaPrint);
  t.false(isKeyframesFalseMediaScreenWidth);
  t.false(isKeyframesFalsePage);
});

test('if selector key passed in is an @media declaration', (t) => {
  const isMediaQueryTruePrint = isMediaQuery('@media print');
  const isMediaQueryTrueScreenWidth = isMediaQuery('@media screen and (min-width: 1000px)');
  const isMediaQueryFalseKeyframes = isMediaQuery('@keyframes test');
  const isMediaQueryFalsePage = isMediaQuery('@keyframes test');

  t.true(isMediaQueryTruePrint);
  t.true(isMediaQueryTrueScreenWidth);
  t.false(isMediaQueryFalseKeyframes);
  t.false(isMediaQueryFalsePage);
});

test('if selector key passed in is an @page declaration', (t) => {
  const isPageFalseMediaPrint = isPage('@media print');
  const isPageFalseMediaScreenWidth = isPage('@media screen and (min-width: 1000px)');
  const isPageTrue = isPage('@page');
  const isPageFalseKeyframes = isPage('@keyframes test');

  t.false(isPageFalseMediaPrint);
  t.false(isPageFalseMediaScreenWidth);
  t.true(isPageTrue);
  t.false(isPageFalseKeyframes);
});

test('if selector key passed in is a valid selector using the nested child syntax', (t) => {
  const isNestedPropertyTrueNoValue = isNestedProperty('& .child');
  const isNestedPropertyTrueValueNotObject = isNestedProperty('& .child', 'test');
  const isNestedPropertyTrue = isNestedProperty('& .child', {
    color: 'red'
  });

  t.true(isNestedPropertyTrueNoValue);
  t.true(isNestedPropertyTrueValueNotObject);

  try {
    const isNestedPropertyThrowsError = isNestedProperty('.child', {
      color: 'red'
    });

    t.fail();
  } catch (exception) {
    t.pass();
  }

  t.true(isNestedPropertyTrue);
});