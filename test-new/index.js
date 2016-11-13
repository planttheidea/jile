import test from 'ava';
import sinon from 'sinon';

import jile from 'src/index';

import {
  Jile
} from 'src/Jile';

import * as generalUtils from 'src/utils/general';
import * as prefixUtils from 'src/utils/prefix';
import * as rules from 'src/rules';
import * as stylesheet from 'src/stylesheet';

test('if jile returns a Jile instance', (t) => {
  const generalStub = sinon.stub(generalUtils, 'getCleanOptions', () => {
    return {
      autoMount: false,
      hashSelectors: false,
      id: 'foo-bar',
      minify: true,
      sourceMap: true
    };
  });
  const rulesStub = sinon.stub(rules, 'getRules', (rules) => {
    return rules;
  });
  const stylesheetStub = sinon.stub(stylesheet, 'getCssAndSelectorMap', () => {
    return {
      css: '.foo{display:block}',
      selectorMap: {}
    };
  });

  const originalCreateObject = URL.createObjectURL;

  URL.createObjectURL = () => {};

  const styles = {
    '.foo': {
      display: 'block'
    }
  };

  const result = jile(styles);

  t.true(result instanceof Jile);

  URL.createObjectURL = originalCreateObject;

  generalStub.restore();
  rulesStub.restore();
  stylesheetStub.restore();
});

test('if jile throws when styles is not an object', (t) => {
  t.throws(() => {
    jile('foo');
  });
});

test('if jile throws when options is not an object', (t) => {
  t.throws(() => {
    jile({}, 'foo');
  });
});

test('if setPrefixerOptions calls setPrefixerOptions util', (t) => {
  const stub = sinon.stub(prefixUtils, 'setPrefixerOptions');

  jile.setPrefixerOptions('foo');

  t.true(stub.calledOnce);

  stub.restore();
});