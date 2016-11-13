import test from 'ava';

import {
  isNestedProperty,
  isType,
  isUnitlessProperty
} from 'src/utils/is';

import {
  UNITLESS_PROPERTIES
} from 'src/utils/constants';

test('if isNestedProperty tests if the selector passed is a valid selector using the nested child syntax', (t) => {
  const isNestedPropertyTrueNoValue = isNestedProperty('& .child');

  t.true(isNestedPropertyTrueNoValue);

  const isNestedPropertyTrueValueNotObject = isNestedProperty('& .child', 'test');

  t.true(isNestedPropertyTrueValueNotObject);

  t.throws(() => {
    isNestedProperty('.child', {
      color: 'red'
    });
  });

  const isNestedPropertyTrue = isNestedProperty('& .child', {
    color: 'red'
  });

  t.true(isNestedPropertyTrue);
});

test('if isType tests the string against the regex', (t) => {
  const fooRegexp = /foo/;
  const foo = 'foo';

  t.true(isType(fooRegexp, foo));

  const bar = 'bar';

  t.false(isType(fooRegexp, bar));
});

test('if isUnitlessProperty returns true for a valid unitless property', (t) => {
  t.true(isUnitlessProperty(UNITLESS_PROPERTIES[0]));
  t.false(isUnitlessProperty('foo'));
});