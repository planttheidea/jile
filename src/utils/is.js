// constants
import {UNITLESS_PROPERTIES} from '../constants';

/**
 * @function isPlainObject
 *
 * @description
 * is the object passed a plain object
 *
 * @param {*} object the object to test
 * @return {boolean} is the object a plain object
 */
export const isPlainObject = (object) => !!object && object.constructor === Object;

/**
 * based on key or value, return if the property is
 * correclty nested, throwing an error when it is invalid
 *
 * @param {string} key
 * @param {string|number|object} value
 * @returns {boolean}
 */
export const isNestedProperty = (key, value) => {
  const isCorrectNestedProperty = key.trim().charAt(0) === '&';

  if (!isCorrectNestedProperty && isPlainObject(value)) {
    throw new TypeError(
      `You have passed a nested object for the key "${key}" but not provided an & ` +
        'as the first character, which likely means you were trying to create a nested selector. Please ' +
        'provide the & as in this example: "& .child-class".'
    );
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
export const isType = (regexp, key) => regexp.test(key);

/**
 * is the property a unitless property and does it have a numeric value
 *
 * @param {string} property
 * @returns {boolean}
 */
export const isUnitlessProperty = (property) => !!~UNITLESS_PROPERTIES.indexOf(property);
