// is
import {
  isType
} from './utils/is';

// rules
import {
  getRuleType
} from './utils/rules';

// stylesheets
import {
  getKeyframesBlock,
  getMediaQueryBlockAndSelectorMap,
  getStandardBlockAndSelectorMap,
  minify
} from './utils/stylesheet';

// constants {
import {
  FONT_FACE_REGEXP,
  KEYFRAMES_TYPE,
  MEDIA_QUERY_TYPE,

  assign,
  getOwnPropertyNames
} from './utils/constants';

/**
 * build text content for injected style tag,
 * as well as its associated map of hashed selectors
 *
 * @param {Object} rules
 * @param {Object} options
 * @returns {{selectorMap: object, textContent: string}}
 */
const getCssAndSelectorMap = (rules, options) => {
  const selectors = getOwnPropertyNames(rules);

  let selectorMap = {},
      rule;

  let css = selectors.reduce((cssString, selector) => {
    rule = rules[selector];

    switch (getRuleType(selector)) {
      case KEYFRAMES_TYPE:
        return `${cssString}${getKeyframesBlock(selector, rule, options, selectorMap)}`;

      case MEDIA_QUERY_TYPE:
        const {
          css: mediaQueryBlock,
          selectorMap: mediaQuerySelectorMap
        } = getMediaQueryBlockAndSelectorMap(selector, rule, options);

        assign(selectorMap, mediaQuerySelectorMap);

        return `${cssString}${mediaQueryBlock}`;

      default:
        const {
          css: standardBlock,
          selectorMap: standardSelectorMap
        } = getStandardBlockAndSelectorMap(selector, rule, options, isType(FONT_FACE_REGEXP, selector));

        assign(selectorMap, standardSelectorMap);

        return `${cssString}${standardBlock}`;
    }
  }, '');

  if (options.minify) {
    css = minify(css);
  }

  return {
    css,
    selectorMap
  };
};

export {getCssAndSelectorMap};
