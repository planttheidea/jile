import test from 'ava';
import isElement from 'lodash/isElement';

import {getPopulatedTag} from 'src/utils/dom';

test.serial(
  'if getPopulatedTag will create a link tag with the href value correct when sourcemap is requested',
  (t) => {
    const css = '.foo{display:block}';
    const id = 'bar';
    const options = {
      sourceMap: true,
    };

    URL.createObjectURL = () => 'http://localhost/';

    const result = getPopulatedTag(css, id, options);

    t.true(isElement(result));
    t.is(result.tagName, 'LINK');

    URL.createObjectURL = undefined;
  }
);

test.serial(
  'if getPopulatedTag will create a style tag with the textContent value correct when sourcemap is not requested',
  (t) => {
    const css = '.foo{display:block}';
    const id = 'bar';
    const options = {
      sourceMap: false,
    };

    URL.createObjectURL = () => 'http://localhost/';

    const result = getPopulatedTag(css, id, options);

    t.true(isElement(result));
    t.is(result.tagName, 'STYLE');

    URL.createObjectURL = undefined;
  }
);
