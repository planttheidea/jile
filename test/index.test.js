import test from 'ava';
import 'babel-core/register';
import performanceNow from 'performance-now';

import jile from '../src';
import hash from '../src/utils/hash';
import {
  setPrefixer
} from '../src/utils/prefix';

let startTime;

test.before(() => {
  startTime = performanceNow();
});

if (process.env.TIMED) {
  const testTimes = {};

  test.beforeEach((t) => {
    const now = performanceNow();
    const title = t.title.replace('beforeEach for ', '');

    testTimes[title] = now;
  });

  test.afterEach((t) => {
    const now = performanceNow();
    const title = t.title.replace('afterEach for ', '');
    const timeTaken = now - testTimes[title];

    console.log(`Test "${title}" completed, took ${timeTaken}ms.`);
    console.log('');
  });
}

test.after(() => {
  const totalTime = performanceNow() - startTime;

  console.log(`All tests completed successfully, took ${totalTime}ms, or ${+(totalTime.toFixed(0)) / 1000} seconds.`)
});

// utils
import './utils/is.test.js';
import './utils/prefix.test.js';
import './utils/hash.test.js';
import './utils/sqwish.test.js';
import './utils/rules.test.js';
import './utils/stylesheet.test.js';

const ID = 'ava-test-2';
const ID_SELECTOR = `#${ID}`;
const HASHED_TEST = hash('test', ID);
const ORIGINAL_RULES = {
  '.test': {
    display: 'block'
  }
};
const EXPECTED_RESULT = `
.${HASHED_TEST} {
  display: block;
}`;
const GENERATED_ID = 'jile-stylesheet-0';
const GENERATED_ID_SELECTOR = `#${GENERATED_ID}`;
const HASHED_GENERATED_TEsT = hash('test', GENERATED_ID);
const EXPECTED_GENERATED_RESULT = `
.${HASHED_GENERATED_TEsT} {
  display: block;
}`;


// main
test('standard method creates stylesheet with provided and generated IDs and adds them to the document head', (t) => {
  const existingStylesheet = document.querySelector(ID_SELECTOR);

  t.is(existingStylesheet, null);

  const selectorMap = jile(ID, ORIGINAL_RULES);
  const newStylesheet = document.querySelector(ID_SELECTOR);

  t.not(newStylesheet, null);

  t.is(newStylesheet.textContent, EXPECTED_RESULT);
  t.deepEqual(selectorMap, {
    test: HASHED_TEST
  });

  const namelessSelectorMap = jile(ORIGINAL_RULES);
  const namelessStylesheet = document.head.querySelector(GENERATED_ID_SELECTOR);

  t.not(namelessStylesheet, null);

  t.is(namelessStylesheet.textContent, EXPECTED_GENERATED_RESULT);
  t.deepEqual(namelessSelectorMap, {
    test: HASHED_GENERATED_TEsT
  });
});

test('noInject returns only the textContent for the styles and the selectorMap', (t) => {
  const stylesObject = jile.noInject(ID, ORIGINAL_RULES);

  t.is(stylesObject.css, EXPECTED_RESULT);
  t.deepEqual(stylesObject.selectorMap, {
    test: HASHED_TEST
  });
});

const getCurrentStylesheetIds = () => {
  const currentStylesheets = document.head.querySelectorAll('link[id],style[id]');
  return [...currentStylesheets].map(({id}) => {
    return id;
  });
};

test('remove will remove stylesheet from the DOM', (t) => {
  const stylesheetIds = getCurrentStylesheetIds();

  t.not(stylesheetIds.length, 0);

  const idsAfterFirstRemoval = stylesheetIds.slice(1, stylesheetIds.length);

  jile.remove(stylesheetIds[0]);

  t.deepEqual(idsAfterFirstRemoval, getCurrentStylesheetIds());

  const idsAfterSecondRemoval = idsAfterFirstRemoval.slice(0, idsAfterFirstRemoval.length - 1);

  jile.remove(idsAfterFirstRemoval[idsAfterFirstRemoval.length - 1]);

  t.deepEqual(idsAfterSecondRemoval, getCurrentStylesheetIds());

  const idsAfterLastRemoval = idsAfterSecondRemoval.slice(1, idsAfterSecondRemoval.length);

  jile.remove(idsAfterSecondRemoval[0]);

  t.deepEqual(idsAfterLastRemoval, getCurrentStylesheetIds());
});

test('setPrefixer method is the same as the one in prefix', (t) => {
  t.is(jile.setPrefixer, setPrefixer);
});