// external dependencies
import hashIt from 'hash-it';
import isUndefined from 'lodash/isUndefined';

// constants
import {
  DEFAULT_OPTIONS,
  GLOBAL_REPLACEMENT_REGEXP,
  GLOBAL_SELECTOR_REGEXP,
  HASH_SELECTOR_REGEXP,

  assign
} from './constants';

/**
 * coalesce the options with default options and the generated id
 *
 * @param {Object} options
 * @returns {{autoMount: boolean, hashSelectors: boolean, id: string, minify: boolean}}
 */
const getCleanOptions = (options = {}) => {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    id: getGeneratedJileId(options.id)
  };
};

let idCounter = 0;

/**
 * return the id passed or a generated one based on counter
 *
 * @param {string} id
 * @returns {string}
 */
const getGeneratedJileId = (id) => {
  return !isUndefined(id) ? id : `jile-stylesheet-${idCounter++}`;
};

/**
 * get the hashed key
 *
 * @param {string} key
 * @param {string} id
 * @returns {string}
 */
const getHashedValue = (key, id) => {
  const hashedValue = hashIt(`${key}-${id}`);

  return `jile__${key}__${hashedValue}`;
};

/**
 * hash the selector, and add it to the hashmap if it does not exist
 *
 * @param {string} originalSelector
 * @param {string} id
 * @returns {string}
 */
const getHashedSelector = (originalSelector, id) => {
  let noHashValueMap = {},
      globalSelectorCounter = 0,
      selectorMap = {},
      cleanSelector, mappedSelector, hashedSelector, key;

  const selector = originalSelector
    .replace(GLOBAL_SELECTOR_REGEXP, (match, value) => {
      key = `global__${globalSelectorCounter}`;

      assign(noHashValueMap, {
        [key]: value
      });

      globalSelectorCounter++;

      return key;
    })
    .replace(HASH_SELECTOR_REGEXP, (match, value) => {
      cleanSelector = match.replace(value, '');
      mappedSelector = selectorMap[cleanSelector];
      hashedSelector = mappedSelector || getHashedValue(cleanSelector, id);

      if (!mappedSelector) {
        assign(selectorMap, {
          [cleanSelector]: hashedSelector
        });
      }

      return `${value}${hashedSelector}`;
    })
    .replace(GLOBAL_REPLACEMENT_REGEXP, (match) => {
      return noHashValueMap[match];
    });

  return {
    selector,
    selectorMap
  };
};

/**
 * convert camelcase string to kebab case
 *
 * @param {string} string
 * @returns {string}
 */
const toKebabCase = (string) => {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export {getCleanOptions};
export {getGeneratedJileId};
export {getHashedSelector};
export {getHashedValue};
export {toKebabCase};
