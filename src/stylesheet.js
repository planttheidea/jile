// utils
import {assign} from './utils/general';
import {isType} from './utils/is';
import {getRuleType} from './utils/rules';
import {
  getKeyframesBlock,
  getMediaQueryBlockAndSelectorMap,
  getStandardBlockAndSelectorMap,
  minify,
} from './utils/stylesheet';

// constants {
import {
  FONT_FACE_REGEXP,
  KEYFRAMES_TYPE,
  MEDIA_QUERY_TYPE,
} from './constants';

const {getOwnPropertyNames} = Object;

/**
 * build text content for injected style tag,
 * as well as its associated map of hashed selectors
 *
 * @param {Object} rules
 * @param {Object} options
 * @returns {{selectorMap: object, textContent: string}}
 */
export const getCssAndSelectorMap = (rules, options) => {
  const selectors = getOwnPropertyNames(rules);

  let selectorMap = {},
      rule,
      ruleType;

  let css = selectors.reduce((cssString, selector) => {
    rule = rules[selector];

    ruleType = getRuleType(selector);

    if (ruleType === KEYFRAMES_TYPE) {
      return `${cssString}${getKeyframesBlock(selector, rule, options, selectorMap)}`;
    }

    if (ruleType === MEDIA_QUERY_TYPE) {
      const {css: mediaQueryBlock, selectorMap: mediaQuerySelectorMap} = getMediaQueryBlockAndSelectorMap(
        selector,
        rule,
        options
      );

      assign(selectorMap, mediaQuerySelectorMap);

      return `${cssString}${mediaQueryBlock}`;
    }

    const {css: standardBlock, selectorMap: standardSelectorMap} = getStandardBlockAndSelectorMap(
      selector,
      rule,
      options,
      isType(FONT_FACE_REGEXP, selector)
    );

    assign(selectorMap, standardSelectorMap);

    return `${cssString}${standardBlock}`;
  }, '');

  if (options.minify) {
    css = minify(css);
  }

  return {
    css,
    selectorMap,
  };
};
