// polyfills
import 'blob-polyfill';

// external dependencies
import isPlainObject from 'lodash/isPlainObject';

// utils
import {
  getCleanOptions
} from './utils/general';
import {
  setPrefixerOptions
} from './utils/prefix';

// processing methods
import {
  manageTagMetadataObject
} from './Jile';
import {
  getRules
} from './rules';
import {
  getCssAndSelectorMap
} from './stylesheet';

/**
 * create jile stylesheet based on styles and passedOptions, and
 * return an object with the metadata properties
 *
 * @param {Object} styles
 * @param {Object} passedOptions
 * @param {boolean} passedOptions.autoMount
 * @returns {Object}
 */
const jile = (styles = {}, passedOptions = {}) => {
  if (!isPlainObject(styles)) {
    throw new TypeError('Styles passed need to be a plain object.');
  }

  if (!isPlainObject(passedOptions)) {
    throw new TypeError('Options passed need to be a plain object.');
  }

  const options = getCleanOptions(passedOptions);
  const flattenedStyles = getRules(styles, options);
  const {
    css,
    selectorMap
  } = getCssAndSelectorMap(flattenedStyles, options);

  const tagObject = manageTagMetadataObject(css, selectorMap, options);

  if (options.autoMount) {
    tagObject.add();
  }
  
  return tagObject;
};

/**
 * pass-through to setPrefixer method
 *
 * @params {Array<*>} args
 * @returns {*}
 */
jile.setPrefixerOptions = (...args) => {
  return setPrefixerOptions.apply(undefined, args);
};

export default jile;
