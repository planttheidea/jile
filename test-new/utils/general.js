import test from 'ava';

import {
  getCleanOptions,
  getGeneratedJileId,
  getHashedSelector,
  getHashedValue,
  toKebabCase
} from 'src/utils/general';

import {
  DEFAULT_OPTIONS
} from 'src/utils/constants';

test('if getCleanOptions returns the default options and generated id if nothing passed', (t) => {
  const result = getCleanOptions();

  Object.keys(result).forEach((key) => {
    if (key === 'id') {
      t.regex(result[key], /jile-stylesheet-[0-9]/);
    } else {
      t.is(result[key], DEFAULT_OPTIONS[key]);
    }
  });
});

test('if getCleanOptions lets the passed options override the defaults', (t) => {
  const options = {
    autoMount: false,
    hashSelectors: false
  };
  const result = getCleanOptions(options);

  Object.keys(result).forEach((key) => {
    if (key === 'id') {
      t.regex(result[key], /jile-stylesheet-[0-9]/);
    } else {
      t.is(result[key], options.hasOwnProperty(key) ? options[key] : DEFAULT_OPTIONS[key]);
    }
  });
});

test('if getGeneratedJileId is in the format expected', (t) => {
  const defaultResult = getGeneratedJileId();

  t.regex(defaultResult, /jile-stylesheet-[0-9]/);

  const id = 'foo';
  const overrideResult = getGeneratedJileId(id);

  t.is(overrideResult, id);
});

test('if getHashedSelector will only hash the correct selector values', (t) => {
  const id = 'foo';

  const {
    selector: simpleSelector,
    selectorMap: simpleSelectorMap
  } = getHashedSelector('.bar', id);

  t.regex(simpleSelector, /jile__bar__[0-9]/);

  t.deepEqual(simpleSelectorMap, {
    bar: simpleSelector.slice(1)
  });
});

test('if getHashedValue hashes the value and id passed', (t) => {
  const id = 'foo';
  const value = 'bar';

  const result = getHashedValue(value, id);
  const resultTwo = getHashedValue(value, id);

  t.regex(result, /jile__bar__[0-9]/);
  t.is(result, resultTwo);
});

test('if toKebabCase correctly converts camelCase to kebab-case', (t) => {
  const result = toKebabCase('someCamelCaseWord');
  const expectedResult = 'some-camel-case-word';

  t.is(result, expectedResult);
});