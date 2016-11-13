import test from 'ava';
import sinon from 'sinon';

import jile from 'src/index';

import * as prefixUtils from 'src/utils/prefix';

test.todo('jile');

test('if setPrefixerOptions calls setPrefixerOptions util', (t) => {
  const stub = sinon.stub(prefixUtils, 'setPrefixerOptions');

  jile.setPrefixerOptions('foo');

  t.true(stub.calledOnce);

  stub.restore();
});