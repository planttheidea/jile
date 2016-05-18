import test from 'ava';

import hash from '../../src/utils/hash';
import {
  addStylesheetToHead,
  applyPrefixWithLeadingDash,
  buildPropertyValues,
  buildStylesheet,
  buildStylesheetContent,
  getIndent,
  getKeyframesBlock,
  getMediaQueryBlock,
  getNewline,
  getStandardBlock,
  hashKeyframesName,
  hashSelector,
  removeStylesheetFromHead,
  sortKeyframesKeys
} from '../../src/utils/stylesheet';

const ID = 'ava-test';

const CLASS_SELECTOR = '.class';
const CHILD_SELECTOR = '#child .selector';
const IMMEDIATE_CHILD_SELECTOR = '#immediateChild > .selector';
const NEXT_SIBLING_SELECTOR = '#nextSibling + .selector';
const GENERAL_SIBLING_SELECTOR = '#generalSibling ~ button.selector';
const PSEUDO_SELECTOR = '.pseudoSelector::before';
const HOVER_SELECTOR = '#hoverSelector:hover';


test('applyPrefixWithLeadingDash sets all prefixed values with leading dash', (t) => {
  const webkitAppearance = applyPrefixWithLeadingDash('WebkitAppearance');
  const oAppearance = applyPrefixWithLeadingDash('OAppearance');
  const mozAppearance = applyPrefixWithLeadingDash('MozAppearance');
  const msAppearance = applyPrefixWithLeadingDash('msAppearance');
  const appearance = applyPrefixWithLeadingDash('appearance');

  t.is(webkitAppearance, '-webkit-appearance');
  t.is(oAppearance, '-o-appearance');
  t.is(mozAppearance, '-moz-appearance');
  t.is(msAppearance, '-ms-appearance');
  t.is(appearance, 'appearance');
});

test('hashSelector hashes selector and populates selectorMap with class/ID => hash mappings', (t) => {
  let selectorMap = {};

  const classHash = hashSelector(CLASS_SELECTOR, ID, selectorMap);
  const childHash = hashSelector(CHILD_SELECTOR, ID, selectorMap);
  const immediateChildHash = hashSelector(IMMEDIATE_CHILD_SELECTOR, ID, selectorMap);
  const nextSiblingHash = hashSelector(NEXT_SIBLING_SELECTOR, ID, selectorMap);
  const generalSiblingHash = hashSelector(GENERAL_SIBLING_SELECTOR, ID, selectorMap);
  const pseudoHash = hashSelector(PSEUDO_SELECTOR, ID, selectorMap);
  const hoverHash = hashSelector(HOVER_SELECTOR, ID, selectorMap);

  t.is(classHash, '.jile__class__901825323');
  t.is(childHash, '#jile__child__502167326 .jile__selector__2969659026');
  t.is(immediateChildHash, '#jile__immediateChild__2177046488 > .jile__selector__2969659026');
  t.is(nextSiblingHash, '#jile__nextSibling__4255046108 + .jile__selector__2969659026');
  t.is(generalSiblingHash, '#jile__generalSibling__2160388995 ~ button.jile__selector__2969659026');
  t.is(pseudoHash, '.jile__pseudoSelector__3178036800::before');
  t.is(hoverHash, '#jile__hoverSelector__2846023241:hover');
});

test('getIndent returns the appropriate amount of spaces', (t) => {
  t.is(getIndent(), '');
  t.is(getIndent(2), '  ');
  t.is(getIndent(4), '    ');
  t.is(getIndent(6), '      ');
  t.not(getIndent(2), '      ');
});

test('getNewline returns the appropriate amount of newlines', (t) => {
  t.is(getNewline(), `
`);
  t.is(getNewline(2), `

`);
  t.is(getNewline(6), `





`);
  t.not(getNewline(), `

`);
});

test('buildPropertyValues constructs a value line of CSS text', (t) => {
  const standardProperty = {
    display: 'block'
  };
  const prefixedProperty = {
    WebkitAppearance: 'none'
  };
  const beforeProperty = {
    content: '"Before Content"'
  };

  const standardText = buildPropertyValues('display', standardProperty);
  const prefixedText = buildPropertyValues('WebkitAppearance', prefixedProperty);
  const beforeText = buildPropertyValues('content', beforeProperty);

  t.is(standardText, `
  display: block;`);
  t.is(prefixedText, `
  -webkit-appearance: none;`);
  t.is(beforeText, `
  content: "Before Content";`);
});

test('getStandardBlock constructs a valid block of CSS for a given selector and populates selectorMap', (t) => {
  const selector = '#some .crazy:hover > .ridiculous + .selector';
  const block = {
    backgroundColor: 'red',
    color: 'white',
    display: 'block',
    WebkitAppearance: 'none'
  };
  const finalBlock = `
#jile__some__566952304 .jile__crazy__2096108025:hover > .jile__ridiculous__1408983016 + .jile__selector__2969659026 {
  background-color: red;
  color: white;
  display: block;
  -webkit-appearance: none;
}`;
  const selectorsMapped = {
    some: 'jile__some__566952304',
    crazy: 'jile__crazy__2096108025',
    ridiculous: 'jile__ridiculous__1408983016',
    selector: 'jile__selector__2969659026'
  };

  let selectorMap = {};

  const standardBlock = getStandardBlock(selector, block, selectorMap, ID);

  t.is(finalBlock, standardBlock);
  t.deepEqual(selectorsMapped, selectorMap);
});

test('sortKeyframesKeys puts keyframes properties in the correct order', (t) => {
  const fromToArray = [
    'to',
    'from'
  ];
  const sortedFromToArray = [
    'from',
    'to'
  ];

  const percentageArray = [
    '6%',
    '75%',
    '0%',
    '28%',
    '100%',
    '49%'
  ];
  const sortedPercentageArray = [
    '0%',
    '6%',
    '28%',
    '49%',
    '75%',
    '100%'
  ];

  t.deepEqual(fromToArray.sort(sortKeyframesKeys), sortedFromToArray);
  t.deepEqual(percentageArray.sort(sortKeyframesKeys), sortedPercentageArray);
});

test('getKeyframesBlock constructs a valid block of CSS keyframes declaration and populates selectorMap', (t) => {
  let selectorMap = {};

  const simpleKeyframesTitle = '@keyframes simple';
  const hashedSimpleKeyframesTitle = hashKeyframesName(simpleKeyframesTitle, ID, selectorMap);
  const simpleKeyframesRule = {
    to: {
      opacity: 1
    },
    from: {
      opacity: 0
    }
  };
  const simpleKeyframesResult = `
${hashedSimpleKeyframesTitle} {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`;

  const simpleKeyframesBlock = getKeyframesBlock(simpleKeyframesTitle, simpleKeyframesRule, selectorMap, ID);

  t.is(simpleKeyframesBlock, simpleKeyframesResult);

  const percentageKeyframesTitle = '@keyframes percentage';
  const hashedPercentageKeyframesTitle = hashKeyframesName(percentageKeyframesTitle, ID, selectorMap);
  const percentageKeyframesRule = {
    '5%': {
      opacity: '5%'
    },
    '71%': {
      opacity: '71%'
    },
    '26%': {
      opacity: '26%'
    },
    '91%': {
      opacity: '91%'
    },
    '0%': {
      opacity: '0%'
    },
    '100%': {
      opacity: '100%'
    }
  };
  const percentageKeyframesResult = `
${hashedPercentageKeyframesTitle} {
  0% {
    opacity: 0%;
  }
  5% {
    opacity: 5%;
  }
  26% {
    opacity: 26%;
  }
  71% {
    opacity: 71%;
  }
  91% {
    opacity: 91%;
  }
  100% {
    opacity: 100%;
  }
}`;

  const percentageKeyframesBlock = getKeyframesBlock(percentageKeyframesTitle, percentageKeyframesRule, selectorMap, ID);

  t.is(percentageKeyframesBlock, percentageKeyframesResult);

  const hashedSimpleKeyframesName = hashedSimpleKeyframesTitle.split(' ')[1];
  const hashedPercentageKeyframesName = hashedPercentageKeyframesTitle.split(' ')[1];

  t.deepEqual(selectorMap, {
    percentage: hashedPercentageKeyframesName,
    simple: hashedSimpleKeyframesName
  });
});

test('getMediaQueryBlock constructs a valid block of CSS with media query wrapper and populates selectorMap', (t) => {
  let selectorMap = {};

  const screenWidthTitle = '@media screen and (min-width: 1000px)';
  const screenWidthRule = {
    '.parent': {
      color: 'red',
      fontSize: 18
    },
    '.parent .child': {
      fontSize: 14
    },
    '.otherParent': {
      color: 'blue'
    }
  };
  const hashedParent = hashSelector('.parent', ID, selectorMap);
  const hashedChild = hashSelector('.parent .child', ID, selectorMap);
  const hashedOtherParent = hashSelector('.otherParent', ID, selectorMap);
  const screenWidthResult = `
${screenWidthTitle} {
  ${hashedParent} {
    color: red;
    font-size: 18px;
  }
  ${hashedChild} {
    font-size: 14px;
  }
  ${hashedOtherParent} {
    color: blue;
  }
}`;

  const screenWidthBlock = getMediaQueryBlock(screenWidthTitle, screenWidthRule, selectorMap, ID);

  t.is(screenWidthResult, screenWidthBlock);

  const parentHash = hashedParent.split('.')[1];
  const childHash = hashedChild.split(' ')[1].split('.')[1];
  const otherParentHash = hashedOtherParent.split('.')[1];

  t.deepEqual(selectorMap, {
    child: childHash,
    otherParent: otherParentHash,
    parent: parentHash
  });
});

const HASHED_SIMPLE = hash('simple', ID);
const ORIGINAL_RULES = {
  'html, body': {
    margin: 0,
    padding: 0
  },
  '@keyframes simple': {
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  },
  ':global(.unhashed-selector)': {
    display: 'inline-block'
  },
  '.parent': {
    color: 'blue',
    fontSize: 18,

    '@media screen and (min-width: 1000px)': {
      backgroundColor: 'gray'
    },

    '& .child': {
      animation: '2s simple',
      fontSize: 14
    },

    '& :global(.unhashed-child)': {
      backgroundColor: 'red'
    }
  },
  '@media screen and (max-width: 999px)': {
    '.parent': {
      backgroundColor: 'blue'
    }
  },
  '@page': {
    size: 'Letter landscape'
  }
};
const FORMATTED_RULES = {
  '@keyframes simple': {
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  },
  'html, body': {
    margin: 0,
    padding: 0
  },
  ':global(.unhashed-selector)': {
    display: 'inline-block'
  },
  '.parent': {
    color: 'blue',
    fontSize: 18
  },
  '@media screen and (min-width: 1000px)': {
    '.parent': {
      backgroundColor: 'gray'
    }
  },
  '.parent .child': {
    animation: `2s ${HASHED_SIMPLE}`,
    fontSize: 14
  },
  '.parent :global(.unhashed-child)': {
    backgroundColor: 'red'
  },
  '@media screen and (max-width: 999px)': {
    '.parent': {
      backgroundColor: 'blue'
    }
  },
  '@page': {
    size: 'Letter landscape'
  }
};
const HASHED_PARENT = hash('parent', ID);
const HASHED_CHILD = hash('child', ID);
const EXPECTED_RESULT = `
@keyframes ${HASHED_SIMPLE} {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
html, body {
  margin: 0;
  padding: 0;
}
.unhashed-selector {
  display: inline-block;
}
.${HASHED_PARENT} {
  color: blue;
  font-size: 18px;
}
@media screen and (min-width: 1000px) {
  .${HASHED_PARENT} {
    background-color: gray;
  }
}
.${HASHED_PARENT} .${HASHED_CHILD} {
  animation: 2s ${HASHED_SIMPLE};
  font-size: 14px;
}
.${HASHED_PARENT} .unhashed-child {
  background-color: red;
}
@media screen and (max-width: 999px) {
  .${HASHED_PARENT} {
    background-color: blue;
  }
}
@page {
  size: Letter landscape;
}`;

test('buildStylesheetContent creates property textContent for a style tag, as well as selectorMap', (t) => {
  const stylesheetContent = buildStylesheetContent(FORMATTED_RULES, ID);
  const {
    selectorMap,
    textContent
  } = stylesheetContent;

  t.is(textContent, EXPECTED_RESULT);

  t.deepEqual(selectorMap, {
    simple: HASHED_SIMPLE,
    parent: HASHED_PARENT,
    child: HASHED_CHILD
  });
});

const ID_SELECTOR = `#${ID}`;

test('addStylesheetToHead builds stylesheet and adds it to the document\'s head', (t) => {
  const existingStylesheet = document.querySelector(ID_SELECTOR);

  t.is(existingStylesheet, null);

  addStylesheetToHead(ID, FORMATTED_RULES);

  const newStylesheet = document.querySelector(ID_SELECTOR);

  t.not(newStylesheet, null);
  t.is(newStylesheet.textContent, EXPECTED_RESULT);
});

test('removeStylesheetFromHead removes existing stylesheet from document\'s head', (t) => {
  const existingStylesheet = document.querySelector(ID_SELECTOR);

  t.not(existingStylesheet, null);

  removeStylesheetFromHead(ID);

  const removedStylesheet = document.querySelector(ID_SELECTOR);

  t.is(removedStylesheet, null);
});

test('buildStylesheet builds stylesheet and adds to document\'s head', (t) => {
  const existingStylesheet = document.querySelector(ID_SELECTOR);

  t.is(existingStylesheet, null);

  const selectorMap = buildStylesheet(ID, ORIGINAL_RULES);
  const newStylesheet = document.querySelector(ID_SELECTOR);

  t.not(newStylesheet, null);
  t.is(newStylesheet.textContent, EXPECTED_RESULT);
  t.deepEqual(selectorMap, {
    simple: HASHED_SIMPLE,
    parent: HASHED_PARENT,
    child: HASHED_CHILD
  });
});