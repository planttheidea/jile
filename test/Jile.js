import test from 'ava';
import sinon from 'sinon';

import {
  Jile,
  getInternalOptionKey,
  getOriginalOptions,
  manageTagMetadataObject
} from 'src/Jile';

import * as domUtils from 'src/utils/dom';

test('if Jile returns a valid Jile instance based on the values passed', (t) => {
  const css = '.foo {display: block}';
  const selectors = {
    foo: 'bar'
  };
  const tag = document.createElement('style');

  const mainObject = {
    css,
    selectors,
    tag
  };
  const options = {
    autoMount: false,
    hashSelectors: true,
    id: 'foo',
    minify: false,
    sourceMap: true
  };

  const result = new Jile(mainObject, options);

  // do the values surfaced match those passed
  t.deepEqual(result, mainObject);

  // and are the options passed stored frozen
  Object.getOwnPropertyNames(result).forEach((key) => {
    if (key.charAt(0) === '_') {
      const descriptor = Object.getOwnPropertyDescriptor(result, key);

      t.false(descriptor.configurable);
      t.false(descriptor.enumerable);
      t.false(descriptor.writable);
    }
  });
});

test('if getInternalOptionKey returns the key with a prefixing underscore', (t) => {
  const key = 'foo';

  const result = getInternalOptionKey(key);

  t.is(result, `_${key}`);
});

test('if getOriginalOptions returns an object that only contains keys from the options object', (t) => {
  const object = {
    _foo: 'bar',
    _autoMount: true,
    _bar: 'baz',
    _hashSelectors: false,
    _baz: 'foo',
    _minify: true,
    _fooBar: 'asdf',
    _sourceMap: true,
    _barBaz: 'qwer',
    _id: 'foo-bar'
  };

  const result = getOriginalOptions(object);

  t.deepEqual(result, {
    autoMount: true,
    hashSelectors: false,
    id: 'foo-bar',
    minify: true,
    sourceMap: true
  });
});

test('if manageTagMetadataObject correctly returns a new jile', (t) => {
  const css = '.foo {display: block}';
  const selectors = {
    foo: 'bar'
  };
  const options = {
    autoMount: false,
    hashSelectors: true,
    id: 'foo',
    minify: false,
    sourceMap: true
  };

  const tag = document.createElement('style');

  const stub = sinon.stub(domUtils, 'getPopulatedTag', () => {
    return tag;
  });

  const result = manageTagMetadataObject(css, selectors, options);

  t.deepEqual(result, {
    css,
    selectors,
    tag
  });

  stub.restore();
});

test.only('if add and remove will add / remove the jile instance from the DOM', (t) => {
  const id = 'foo-bar';

  const css = '.foo{display:block}';
  const selectors = {};
  const tag = document.createElement('style');

  tag.textContent = css;
  tag.id = id;

  const options = {
    autoMount: false,
    hashSelectors: true,
    id,
    minify: false,
    sourceMap: false
  };

  const jileObject = new Jile({
    css,
    selectors,
    tag
  }, options);

  const tagBeforeAdd = document.getElementById(id);

  t.is(tagBeforeAdd, null);

  jileObject.add();

  const tagAfteradd = document.getElementById(id);

  t.not(tagAfteradd, null);
  t.is(tagAfteradd.tagName.toLowerCase(), 'style');

  jileObject.remove();

  const tagAfterRemove = document.getElementById(id);

  t.is(tagAfterRemove, null);
});

test.only('if isMounted will determine if the jile instance id present in the DOM', (t) => {
  const id = 'foo-bar';

  const css = '.foo{display:block}';
  const selectors = {};
  const tag = document.createElement('style');

  tag.textContent = css;
  tag.id = id;

  const options = {
    autoMount: false,
    hashSelectors: true,
    id,
    minify: false,
    sourceMap: false
  };

  const jileObject = new Jile({
    css,
    selectors,
    tag
  }, options);

  t.false(jileObject.isMounted());

  jileObject.add();

  t.true(jileObject.isMounted());

  jileObject.remove();

  t.false(jileObject.isMounted());
});