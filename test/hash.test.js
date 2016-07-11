import test from 'ava';

import hash from '../src/hash';

const ID = 'ava-test';

const HASH_ONE = 'jile__one__1384041441';
const HASH_TWO = 'jile__two__1384048201';
const HASH_THREE = 'jile__three__3982073867';
const HASH_FOUR = 'jile__four__2724551307';
const HASH_FIVE = 'jile__five__2723703993';

test('hash is consistent', (t) => {
  const stringOne = 'one';
  const stringTwo = 'two';
  const stringThree = 'three';
  const stringFour = 'four';
  const stringFive = 'five';

  for (let i = 10000; i--;) {
    t.is(hash(stringOne, ID), HASH_ONE);
    t.is(hash(stringTwo, ID), HASH_TWO);
    t.is(hash(stringThree, ID), HASH_THREE);
    t.is(hash(stringFour, ID), HASH_FOUR);
    t.is(hash(stringFive, ID), HASH_FIVE);
  }
});