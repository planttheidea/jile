import test from 'ava';

import hash from '../../src/utils/hash';

const ID = 'ava-test';

const HASH_ONE = 'jile__one__1294932475';
const HASH_TWO = 'jile__two__2401017559';
const HASH_THREE = 'jile__three__2998480137';
const HASH_FOUR = 'jile__four__2139756475';
const HASH_FIVE = 'jile__five__3252283161';

test('hashes are unique', (t) => {
  t.not(HASH_ONE, HASH_TWO);
  t.not(HASH_ONE, HASH_THREE);
  t.not(HASH_ONE, HASH_FOUR);
  t.not(HASH_ONE, HASH_FIVE);

  t.not(HASH_TWO, HASH_THREE);
  t.not(HASH_TWO, HASH_FOUR);
  t.not(HASH_TWO, HASH_FIVE);

  t.not(HASH_THREE, HASH_FOUR);
  t.not(HASH_THREE, HASH_FIVE);

  t.not(HASH_FOUR, HASH_FIVE);
});

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