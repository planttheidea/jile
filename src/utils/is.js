// external dependencies
import isPlainObject from 'lodash/isPlainObject';

// constants
import {
  UNITLESS_PROPERTIES
} from './constants';

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

  if (!isCorrectNestedProperty && isPlainObject(value)) {
    throw new TypeError(`You have passed a nested object for the key "${key}" but not provided an & ` +
      'as the first character, which likely means you were trying to create a nested selector. Please ' +
      'provide the & as in this example: "& .child-class".');
  }

  return isCorrectNestedProperty;
};

/**
 * does the key match the regexp provided
 *
 * @param {RegExp} regexp
 * @param {string} key
 * @returns {boolean}
 */
const isType = (regexp, key) => {
  return regexp.test(key);
};

/**
 * is the property a unitless property and does it have a numeric value
 *
 * @param {string} property
 * @returns {boolean}
 */
const isUnitlessProperty = (property) => {
  return UNITLESS_PROPERTIES.indexOf(property) !== -1;
};

export {isNestedProperty};
export {isType};
export {isUnitlessProperty};
