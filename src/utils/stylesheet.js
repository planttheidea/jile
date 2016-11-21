// external dependencies
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

// constants {
import {
  IS_PRODUCTION,
  KEYFRAMES_FOLLOWED_BY_NAME_REGEXP,
  MEDIA_QUERY_REGEXP,

  assign,
  getOwnPropertyNames,
  keys
} from './constants';

// is
import {
  getHashedSelector,
  getHashedValue,
  toKebabCase
} from './general';
import {
  isType,
  isUnitlessProperty
} from './is';

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

/**
 * return the appropriate number of newlines,
 * used to indent the text
 *
 * @param {number} newlines=1
 * @returns {string}
 */
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
 * if prefixed, add leading dash to property
 *
 * @param {string} property
 * @returns {string}
 */
const getVendorPrefix = (property) => {
  const prefixedProperty = toKebabCase(property);
  const vendorPrefix = prefixedProperty.split('-')[0];

  switch (vendorPrefix) {
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
 * should the px suffix be applied to the value
 *
 * @param {string} property
 * @param {*} value
 * @returns {boolean}
 */
const shouldApplyPxSuffix = (property, value) => {
  return isNumber(value) && value !== 0 && !isUnitlessProperty(property);
};

/**
 * build the property values, adding 'px' if it
 * is a number and is not a unitless value
 *
 * @param {string} property
 * @param {Object} rule
 * @param {number} indent=2
 * @returns {string}
 */
const buildPropertyValues = (property, rule, indent = 2) => {
  const prefixedProperty = getVendorPrefix(property);
  const originalValue = rule[property];
  const realValue = shouldApplyPxSuffix(property, originalValue) ? `${originalValue}px` : originalValue;

  const leadingWhitespace = `${getNewline()}${getIndent(indent)}`;
  const ruleString = `${prefixedProperty}: ${realValue};`;

  return `${leadingWhitespace}${ruleString}`;
};

/**
 * hash the keyframes name
 *
 * @param {string} selector
 * @param {string} id
 * @param {Object} selectorMap
 * @returns {string}
 */
const getHashedKeyframesName = (selector, id, selectorMap) => {
  let pureValue, hashedValue, mappedValue;

  return selector.replace(KEYFRAMES_FOLLOWED_BY_NAME_REGEXP, (value, matchedProperty) => {
    pureValue = value.replace(matchedProperty, '');
    mappedValue = selectorMap[pureValue];
    hashedValue = mappedValue || getHashedValue(pureValue, id);

    if (!mappedValue) {
      selectorMap[pureValue] = hashedValue;
    }

    return `${matchedProperty}${hashedValue}`;
  });
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

const getUnhashedSelectorObject = (selector) => {
  return {
    selector,
    selectorMap: {}
  };
};

/**
 * build the text for the block of styles
 * for @keyframes declaration
 *
 * @param {string} selector
 * @param {Object} rule
 * @param {Object} options
 * @param {Object} selectorMap
 * @returns {string}
 */
const getKeyframesBlock = (selector, rule, options, selectorMap) => {
  const {
    hashSelectors,
    id
  } = options;
  const hashedSelector = hashSelectors ? getHashedKeyframesName(selector, id, selectorMap) : selector;

  let textContent = getNewline();

  textContent += `${hashedSelector} {`;

  const sortedNames = getOwnPropertyNames(rule).sort(sortKeyframesKeys);

  let incrementValue;

  sortedNames.forEach((increment) => {
    incrementValue = rule[increment];

    textContent += getNewline() + getIndent(2);
    textContent += `${increment} {`;

    keys(incrementValue).forEach((property) => {
      textContent += buildPropertyValues(property, incrementValue, 4);
    });

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
 * @param {Object} rule
 * @param {Object} options
 * @param {number} indent=0
 * @returns {string}
 */
const getMediaQueryBlockAndSelectorMap = (selector, rule, options, indent = 0) => {
  const {
    hashSelectors,
    id
  } = options;

  let css = getNewline() + getIndent(indent) + `${selector} {`,
      selectorMap = {};

  getOwnPropertyNames(rule).forEach((subSelector) => {
    if (isType(MEDIA_QUERY_REGEXP, subSelector)) {
      const {
        css: subSelectorCss,
        selectorMap: subSelectorMap
      } = getMediaQueryBlockAndSelectorMap(subSelector, rule[subSelector], options, indent + 2);

      assign(selectorMap, subSelectorMap);

      css += subSelectorCss;
    } else {
      const subSelectorBlock = rule[subSelector];
      const {
        selector: hashedSelector,
        selectorMap: hashedSelectorMap
      } = hashSelectors ? getHashedSelector(subSelector, id) : getUnhashedSelectorObject(subSelector);

      assign(selectorMap, hashedSelectorMap);

      css += getNewline() + getIndent(indent + 2);
      css += `${hashedSelector} {`;

      keys(subSelectorBlock).forEach((property) => {
        css += buildPropertyValues(property, subSelectorBlock, indent + 4);
      });

      css += getNewline() + getIndent(indent + 2) + '}';
    }
  });

  css += getNewline() + getIndent(indent) + '}';

  return {
    css,
    selectorMap
  };
};

/**
 * minify the css
 *
 * @param {string} css
 * @returns {string}
 */
const minify = (css) => {
  if (!isString(css)) {
    throw new TypeError('CSS passed must be a string value.');
  }

  return css.trim()
    .replace(/\/\*[\s\S]+?\*\//g, '')
    .replace(/[\n\r]/g, '')
    .replace(/\s*([:;,{}])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .replace(/;}/g, '}')
    .replace(/\s+(!important)/g, '$1')
    .replace(/#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3(?![a-fA-F0-9])/g, '#$1$2$3')
    .replace(/(Microsoft[^;}]*)#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])(?![a-fA-F0-9])/g, '$1#$2$2$3$3$4$4')
    .replace(/\b(\d+[a-z]{2}) \1 \1 \1/gi, '$1')
    .replace(/\b(\d+[a-z]{2}) (\d+[a-z]{2}) \1 \2/gi, '$1 $2')
    .replace(/([\s|:])[0]+px/g, '$10');
};

/**
 * build the text for block of styles
 * for a standard selector declaration
 *
 * @param {string} selector
 * @param {Object} rule
 * @param {Object} options
 * @param {boolean} isSelectorFontFace
 * @returns {string}
 */
const getStandardBlockAndSelectorMap = (selector, rule, options, isSelectorFontFace) => {
  const {
    hashSelectors,
    id
  } = options;

  const {
    selector: hashedSelector,
    selectorMap: hashedSelectorMap
  } = hashSelectors ? getHashedSelector(selector, id) : getUnhashedSelectorObject(selector);

  let css = getNewline(),
      selectorMap = {};

  assign(selectorMap, hashedSelectorMap);

  css += `${hashedSelector} {`;

  keys(rule).forEach((property) => {
    if (isSelectorFontFace && property === 'src') {
      const matches = rule[property].match(/url\((.*?).eot(.*?)\)/);

      if (matches && matches[1]) {
        const fileName = matches[1].replace(/['"]/, '');

        css += getNewline() + getIndent(2) + `src: url('${fileName}.eot');`;
      }
    }

    css += buildPropertyValues(property, rule, 2, isSelectorFontFace);
  });

  css += getNewline();
  css += '}';

  return {
    css,
    selectorMap
  };
};

export {buildPropertyValues};
export {getHashedKeyframesName};
export {getIndent};
export {getKeyframesBlock};
export {getMediaQueryBlockAndSelectorMap};
export {getNewline};
export {getStandardBlockAndSelectorMap};
export {getVendorPrefix};
export {minify};
export {shouldApplyPxSuffix};
export {sortKeyframesKeys};
