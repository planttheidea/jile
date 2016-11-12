import test from 'ava';

import {
  isNestedProperty,
  isType,
  isUnitlessProperty
} from 'src/utils/is';

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

test.todo('isType');
test.todo('isUnitlessProperty');