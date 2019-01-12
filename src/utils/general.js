// external dependencies
import hashIt from 'hash-it';

// constants
import {
  DEFAULT_OPTIONS,
  GLOBAL_REPLACEMENT_REGEXP,
  GLOBAL_SELECTOR_REGEXP,
  HASH_SELECTOR_REGEXP,
} from '../constants';

// utils
import {isPlainObject} from './is';

let idCounter = 0;

export const assign =
  Object.assign
  || ((target, ...sources) =>
    sources.reduce((assigned, source) => {
      if (!isPlainObject(source)) {
        for (let key in source) {
          assigned[key] = source[key];
        }
      }

      return assigned;
    }, target));

/**
 * return the id passed or a generated one based on counter
 *
 * @param {string} id
 * @returns {string}
 */
export const getGeneratedJileId = (id) => (id !== void 0 ? id : `jile-stylesheet-${idCounter++}`);

/**
 * coalesce the options with default options and the generated id
 *
 * @param {Object} options
 * @returns {{autoMount: boolean, hashSelectors: boolean, id: string, minify: boolean}}
 */
export const getCleanOptions = (options = {}) => ({
  ...DEFAULT_OPTIONS,
  ...options,
  id: getGeneratedJileId(options.id),
});

/**
 * get the hashed key
 *
 * @param {string} key
 * @param {string} id
 * @returns {string}
 */
export const getHashedValue = (key, id) => `jile__${key}__${hashIt(`${key}-${id}`)}`;

/**
 * hash the selector, and add it to the hashmap if it does not exist
 *
 * @param {string} originalSelector
 * @param {string} id
 * @returns {string}
 */
export const getHashedSelector = (originalSelector, id) => {
  let noHashValueMap = {},
      globalSelectorCounter = 0,
      selectorMap = {},
      cleanSelector,
      mappedSelector,
      hashedSelector,
      key;

  const selector = originalSelector
    .replace(GLOBAL_SELECTOR_REGEXP, (matchIgnored, value) => {
      key = `global__${globalSelectorCounter}`;

      assign(noHashValueMap, {
        [key]: value,
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
          [cleanSelector]: hashedSelector,
        });
      }

      return `${value}${hashedSelector}`;
    })
    .replace(GLOBAL_REPLACEMENT_REGEXP, (match) => noHashValueMap[match]);

  return {
    selector,
    selectorMap,
  };
};

/**
 * convert camelcase string to kebab case
 *
 * @param {string} string
 * @returns {string}
 */
export const toKebabCase = (string) => {
  // opera has precursor of capital O, so handle that scenario
  const stringToKebab = string.charAt(0) === 'O' ? `o${string.slice(1)}` : string;

  return stringToKebab.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
