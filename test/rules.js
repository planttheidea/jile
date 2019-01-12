import test from 'ava';
import sinon from 'sinon';

import {getRules} from 'src/rules';

import * as rulesUtils from 'src/utils/rules';

test('if getRules calls getFlattenedRules', (t) => {
  const stub = sinon.stub(rulesUtils, 'getFlattenedRules');

  getRules({}, {});

  t.true(stub.calledOnce);

  stub.restore();
});
