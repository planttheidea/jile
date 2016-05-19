import isObject from 'lodash/isObject';

import {
  FONT_FACE_REGEXP,
  KEYFRAMES_REGEXP,
  MEDIA_QUERY_REGEXP,
  PAGE_REGEXP
} from './regexps';

/**
 * test if key contains an @font-face declaration
 *
 * @param {string} key
 * @returns {boolean}
 */
const isFontFace = (key) => {
  return FONT_FACE_REGEXP.test(key);
};

/**
 * test if key contains an @media declaration
 *
 * @param {string} key
 * @returns {boolean}
 */
const isMediaQuery = (key) => {
  return MEDIA_QUERY_REGEXP.test(key);
};

/**
 * test if key contains an @keyframes declaration
 *
 * @param {string} key
 * @returns {boolean}
 */
const isKeyframes = (key) => {
  return KEYFRAMES_REGEXP.test(key);
};

/**
 * based on key or value, return if the property is
 * correclty nested, throwing an error when it is invalid
 *
 * @param {string} key
 * @param {string|number|object} value
 * @returns {boolean}
 */
const isNestedProperty = (key, value) => {
  const isCorrectNestedProperty = key.trim().charAt(0) === '&';

  if (!isCorrectNestedProperty && isObject(value)) {
    throw new TypeError(`You have passed a nested object for the key "${key}" but not provided an & ` +
      'as the first character, which likely means you were trying to create a nested selector. Please ' +
      'provide the & as in this example: "& .child-class".');
  }

  return isCorrectNestedProperty;
};

/**
 * test if key contains an @page declaration
 *
 * @param {string} key
 * @returns {boolean}
 */
const isPage = (key) => {
  return PAGE_REGEXP.test(key);
};

export {isFontFace};
export {isKeyframes};
export {isMediaQuery};
export {isNestedProperty};
export {isPage};

export default {
  isFontFace,
  isKeyframes,
  isMediaQuery,
  isNestedProperty,
  isPage
};
