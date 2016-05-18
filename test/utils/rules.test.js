import test from 'ava';

import hash from '../../src/utils/hash';
import {
  addKeyframe,
  addMediaQuery,
  addToRules,
  getFullKey,
  getRules,
  getRulesRecursive,
  getSortedKeys,
  setChildAnimation
} from '../../src/utils/rules';

const ID = 'ava-test';

const KEYFRAMES_KEY = '@keyframes test';
const MEDIA_QUERIES_KEY = '@media screen and (min-width: 1000px)';
const CLASS_KEY = '.test';
const CHILD_CLASS_KEY = '.child';

const SAMPLE_STYLE_OBJECT = {
  'html, body': {
    display: 'block'
  },
  [KEYFRAMES_KEY]: {
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  },
  [CLASS_KEY]: {
    animation: '2s test',
    appearance: 'none',

    [MEDIA_QUERIES_KEY]: {
      color: 'blue'
    },

    [`& ${CHILD_CLASS_KEY}`]: {
      fontSize: 14
    }
  }
};

const HASHED_TEST = hash('test', ID);

const SAMPLE_JILED_OBJECT = {
  [KEYFRAMES_KEY]: {
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  },
  'html, body': {
    display: 'block'
  },
  [CLASS_KEY]: {
    animation: `2s ${HASHED_TEST}`,
    MozAppearance: 'none'
  },
  [MEDIA_QUERIES_KEY]: {
    [CLASS_KEY]: {
      color: 'blue'
    }
  },
  [`${CLASS_KEY} ${CHILD_CLASS_KEY}`]: {
    fontSize: 14
  }
};

test('addKeyframe adds the keyframe declaration to the rules', (t) => {
  const keyframeRules = addKeyframe({}, KEYFRAMES_KEY, SAMPLE_STYLE_OBJECT[KEYFRAMES_KEY], ID);

  t.deepEqual(keyframeRules, {
    [KEYFRAMES_KEY]: {
      from: {
        opacity: 0
      },
      to: {
        opacity: 1
      }
    }
  })
});

test('addMediaQuery adds the media query declaration to the rules', (t) => {
  const mediaQueryRules = addMediaQuery({}, MEDIA_QUERIES_KEY, SAMPLE_STYLE_OBJECT[CLASS_KEY][MEDIA_QUERIES_KEY], ID, CLASS_KEY);

  t.deepEqual(mediaQueryRules, {
    [MEDIA_QUERIES_KEY]: {
      [CLASS_KEY]: {
        color: 'blue'
      }
    }
  })
});

test('addToRules adds style block to the rules', (t) => {
  const standardBlockRules = addToRules({}, CLASS_KEY, SAMPLE_STYLE_OBJECT[CLASS_KEY]);

  t.deepEqual(standardBlockRules, {
    [CLASS_KEY]: {
      animation: '2s test',
      MozAppearance: 'none'
    }
  })
});

test('getFullKey produces key with both root and child', (t) => {
  const keyWithNoRoot = '.parent';
  const keyWithRoot = '.parent .child';

  t.is(getFullKey('', '.parent'), keyWithNoRoot);
  t.is(getFullKey('.parent', '& .child'), keyWithRoot);
});

test('getRulesRecursive creates a flattened style object', (t) => {
  const rules = getRulesRecursive(SAMPLE_STYLE_OBJECT, ID, '');

  t.deepEqual(rules, SAMPLE_JILED_OBJECT);
});

test('getRules calls getRulesRecursive to build a flattened style object', (t) => {
  const rules = getRules(SAMPLE_STYLE_OBJECT, ID);

  t.deepEqual(rules, SAMPLE_JILED_OBJECT);
});

test('getSortedKeys puts keyframes first, leaves all other keys in order', (t) => {
  const sortedKeys = getSortedKeys(SAMPLE_STYLE_OBJECT);

  t.deepEqual(sortedKeys, [
    KEYFRAMES_KEY,
    'html, body',
    CLASS_KEY
  ]);
});

// Make sure to run addKeyframe first, so that it exists for replacement
test('setChildAnimation alters the animation / animation-name to use the hashed keyframes name', (t) => {
  const hashedTest = hash('test', ID);
  const hashedAnimation = setChildAnimation('2s test infinite', 'test');
  const intendedHashedAnimation = `2s ${hashedTest} infinite`;

  t.is(hashedAnimation, intendedHashedAnimation);
});