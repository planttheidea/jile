import isElement from 'lodash/isElement';
import isNumber from 'lodash/isNumber';
import kebabCase from 'lodash/kebabCase';

import getRules from './rules';
import hash from './hash';
import {
  isFontFace,
  isKeyframes,
  isMediaQuery
} from './is';
import {
  GLOBAL_REPLACEMENT_REGEXP,
  GLOBAL_SELECTOR_REGEXP,
  HASH_SELECTOR_REGEXP,
  KEYFRAMES_FOLLOWED_BY_NAME_REGEXP
} from './regexps';
import sqwish from './sqwish';

const URL = window.URL || window.webkitURL;
const hasBlobSupport = !!(window.Blob && typeof window.Blob === 'function' && URL.createObjectURL);

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const GET_OWN_PROPERTY_NAMES = Object.getOwnPropertyNames;
const UNITLESS_VALUES = [
  'columnCount',
  'columns',
  'counterIncrement',
  'counterReset',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'lineHeight',
  'opacity',
  'order',
  'pitchRange',
  'richness',
  'stress',
  'volume',
  'zIndex'
];

/**
 * if prefixed, add leading dash to property
 * 
 * @param {string} property
 * @returns {string}
 */
const applyPrefixWithLeadingDash = (property) => {
  const prefixedProperty = kebabCase(property);
  const propertySplit = prefixedProperty.split('-');

  switch (propertySplit[0]) {
    case 'moz':
    case 'ms':
    case 'o':
    case 'webkit':
      return `-${prefixedProperty}`;

    default:
      return prefixedProperty;
  }
};

/**
 * hash the selector, and add it to the hashmap if it does not exist
 *
 * @param {string} selector
 * @param {string} styleId
 * @param {object} selectorMap
 * @returns {string}
 */
const hashSelector = (selector, styleId, selectorMap) => {
  let noHashValueMap = {},
      counter = 0,
      pureValue, hashedValue, mappedValue;

  return selector
    .replace(GLOBAL_SELECTOR_REGEXP, (match, value) => {
      const key = `global__${counter}`;
      
      noHashValueMap[key] = value;
      counter++;

      return key;
    })
    .replace(HASH_SELECTOR_REGEXP, (match, value) => {
      pureValue = match.replace(value, '');
      mappedValue = selectorMap[pureValue];
      hashedValue = mappedValue || hash(pureValue, styleId);

      if (!mappedValue) {
        selectorMap[pureValue] = hashedValue;
      }

      return `${value}${hashedValue}`;
    })
    .replace(GLOBAL_REPLACEMENT_REGEXP, (match) => {
      return noHashValueMap[match];
    });
};

/**
 * hash the keyframes name
 * 
 * @param {string} selector
 * @param {string} styleId
 * @param {object} selectorMap
 * @returns {string}
 */
const hashKeyframesName = (selector, styleId, selectorMap) => {
  let pureValue, hashedValue, mappedValue;

  return selector.replace(KEYFRAMES_FOLLOWED_BY_NAME_REGEXP, (match, value) => {
    pureValue = match.replace(value, '');
    mappedValue = selectorMap[pureValue];
    hashedValue = mappedValue || hash(pureValue, styleId);

    if (!mappedValue) {
      selectorMap[pureValue] = hashedValue;
    }

    return `${value}${hashedValue}`;
  });
};

/**
 * build the property values, adding 'px' if it
 * is a number and is not a unitless value
 * 
 * @param {string} property
 * @param {object} rule
 * @param {number} indent=2
 * @returns {string}
 */
const buildPropertyValues = (property, rule, indent = 2) => {
  const prefixedProperty = applyPrefixWithLeadingDash(property);
  const originalValue = rule[property];
  const realValue = isNumber(originalValue) && UNITLESS_VALUES.indexOf(property) === -1 &&
    originalValue !== 0 ? `${originalValue}px` : originalValue;

  return getNewline() + getIndent(indent) + `${prefixedProperty}: ${realValue};`;
};

/**
 * make sure that string values (from|to) are ordered
 * correctly, or if percentages are used make sure
 * they are ordered correctly
 * 
 * @param {string} previousValue
 * @param {string} currentValue
 * @returns {number|boolean}
 */
const sortKeyframesKeys = (previousValue, currentValue) => {
  if (previousValue === 'from' || currentValue === 'to') {
    return -1;
  }

  if (previousValue === 'to' || currentValue === 'from') {
    return 1;
  }

  const previousNumericValue = parseInt(previousValue, 10);
  const currentNumericValue = parseInt(currentValue, 10);

  return previousNumericValue > currentNumericValue;
};

/**
 * return the appropriate number of spaces,
 * used to indent the text
 * 
 * @param {number} spaces=0
 * @returns {string}
 */
const getIndent = (spaces = 0) => {
  if (IS_PRODUCTION) {
    return '';
  }

  let spaceString = '';

  for (; spaces--;) {
    spaceString += ' ';
  }

  return spaceString;
};

const getNewline = (newlines = 1) => {
  if (IS_PRODUCTION) {
    return '';
  }

  let newlineString = '';

  for (; newlines--;) {
    newlineString += '\n';
  }

  return newlineString;
};

/**
 * build the text for the block of styles
 * for @keyframes declaration
 * 
 * @param {string} selector
 * @param {object} rule
 * @param {object} selectorMap
 * @param {string} styleId
 * @param {boolean} shouldHashSelectors
 * @returns {string}
 */
const getKeyframesBlock = (selector, rule, selectorMap, styleId, shouldHashSelectors) => {
  const hashedSelector = shouldHashSelectors ? hashKeyframesName(selector, styleId, selectorMap) : selector;

  let textContent = getNewline();

  textContent += `${hashedSelector} {`;

  GET_OWN_PROPERTY_NAMES(rule)
    .sort(sortKeyframesKeys)
    .forEach((increment) => {
      const incrementValue = rule[increment];

      textContent += getNewline() + getIndent(2);
      textContent += `${increment} {`;

      for (let property in incrementValue) {
        textContent += buildPropertyValues(property, incrementValue, 4);
      }

      textContent += getNewline() + getIndent(2);
      textContent += '}';
    });

  textContent += getNewline();
  textContent += '}';

  return textContent;
};

/**
 * build the text (recursively, if applicable) for the
 * block of styles for @media declarations
 * 
 * @param {string} selector
 * @param {object} rule
 * @param {object} selectorMap
 * @param {string} styleId
 * @param {boolean} shouldHashSelectors
 * @param {number} indent=0
 * @returns {string}
 */
const getMediaQueryBlock = (selector, rule, selectorMap, styleId, shouldHashSelectors, indent = 0) => {
  let textContent = getNewline() + getIndent(indent) + `${selector} {`;

  GET_OWN_PROPERTY_NAMES(rule).forEach((subSelector) => {
    if (isMediaQuery(subSelector)) {
      textContent += getMediaQueryBlock(subSelector, rule[subSelector], selectorMap, styleId, shouldHashSelectors, indent + 2);
    } else {
      const subSelectorBlock = rule[subSelector];
      const hashedSelector = shouldHashSelectors ? hashSelector(subSelector, styleId, selectorMap) : subSelector;

      textContent += getNewline() + getIndent(indent + 2);
      textContent += `${hashedSelector} {`;

      for (let property in subSelectorBlock) {
        textContent += buildPropertyValues(property, subSelectorBlock, indent + 4);
      }

      textContent += getNewline() + getIndent(indent + 2) + '}';
    }
  });

  textContent += getNewline() + getIndent(indent) + '}';

  return textContent;
};

/**
 * build the text for block of styles
 * for a standard selector declaration
 * 
 * @param {string} selector
 * @param {object} rule
 * @param {object} selectorMap
 * @param {string} styleId
 * @param {boolean} shouldHashSelectors
 * @param {boolean} isSelectorFontFace
 * @returns {string}
 */
const getStandardBlock = (selector, rule, selectorMap, styleId, shouldHashSelectors, isSelectorFontFace) => {
  const hashedSelector = shouldHashSelectors ? hashSelector(selector, styleId, selectorMap) : selector;

  let textContent = getNewline();

  textContent += `${hashedSelector} {`;

  for (let property in rule) {
    if (isSelectorFontFace && property === 'src') {
      const matches = rule[property].match(/url\((.*?).eot(.*?)\)/);

      if (matches && matches[1]) {
        const fileName = matches[1].replace(/['"]/, '');

        textContent += getNewline() + getIndent(2) + `src: url('${fileName}.eot');`;
      }
    }

    textContent += buildPropertyValues(property, rule, 2, isSelectorFontFace);
  }

  textContent += getNewline();
  textContent += '}';

  return textContent;
};

/**
 * build text content for injected style tag,
 * as well as its associated map of hashed selectors
 * 
 * @param {object} rules
 * @param {string} styleId
 * @param {boolean} shouldHashSelectors
 * @returns {{selectorMap: object, textContent: string}}
 */
const buildStylesheetContent = (rules, styleId, shouldHashSelectors) => {
  const selectors = GET_OWN_PROPERTY_NAMES(rules);

  let selectorMap = {},
      css = '';

  selectors.forEach((selector) => {
    const rule = rules[selector];

    if (isKeyframes(selector)) {
      css += getKeyframesBlock(selector, rule, selectorMap, styleId, shouldHashSelectors);
    } else if (isMediaQuery(selector)) {
      css += getMediaQueryBlock(selector, rule, selectorMap, styleId, shouldHashSelectors);
    } else {
      css += getStandardBlock(selector, rule, selectorMap, styleId, shouldHashSelectors, isFontFace(selector));
    }
  });
  
  return {
    css,
    selectorMap
  };
};

/**
 * inject the stylesheet into the head of the document
 * and return the map of selectors to their hashed values
 * 
 * @param {string} styleId
 * @param {object} rules
 * @param {boolean} shouldHashSelectors
 * @returns {object}
 */
const addStylesheetToHead = (styleId, rules, shouldHashSelectors) => {
  const stylesheetObject = buildStylesheetContent(rules, styleId, shouldHashSelectors);
  const {
    css,
    selectorMap
  } = stylesheetObject;

  const textContent = IS_PRODUCTION ? sqwish(css) : css;

  const existingStyle = document.querySelector(`#${styleId}`);

  if (isElement(existingStyle)) {
    existingStyle.textContent = textContent;
  } else {
    if (!IS_PRODUCTION && hasBlobSupport) {
      const blob = new window.Blob([textContent], {
        type: 'text/css'
      });

      let link = document.createElement('link');

      link.rel = 'stylesheet';
      link.id = styleId;
      link.href = URL.createObjectURL(blob);

      document.head.appendChild(link);
    } else {
      let style = document.createElement('style');

      // old webkit hack
      style.appendChild(document.createTextNode(''));

      style.id = styleId;
      style.textContent = textContent;

      document.head.appendChild(style);
    }

  }

  return selectorMap;
};

/**
 * remove stylesheet from document head
 *
 * @param {string} styleId
 */
const removeStylesheetFromHead = (styleId) => {
  if (!styleId) {
    throw new Error('Must provide an ID for the jile to remove.');
  }

  const matchingStyle = document.querySelector(`#${styleId}`);

  if (isElement(matchingStyle)) {
    document.head.removeChild(matchingStyle);
  }
};

/**
 * get the rules object based on styles passed,
 * and inject stylesheet built from that object
 * into the head of the document
 * 
 * @param {string} styleId
 * @param {object} styles
 * @param {boolean} shouldHashSelectors
 * @returns {Object}
 */
const buildStylesheet = (styleId, styles, shouldHashSelectors) => {
  const rules = getRules(styles, styleId, shouldHashSelectors);
  
  return addStylesheetToHead(styleId, rules, shouldHashSelectors);
};

export {addStylesheetToHead};
export {applyPrefixWithLeadingDash};
export {buildPropertyValues};
export {buildStylesheet};
export {buildStylesheetContent};
export {getIndent};
export {getKeyframesBlock};
export {getMediaQueryBlock};
export {getNewline};
export {getStandardBlock};
export {hashKeyframesName};
export {hashSelector};
export {removeStylesheetFromHead};
export {sortKeyframesKeys};

export default {
  buildStylesheet,
  removeStylesheetFromHead
};
