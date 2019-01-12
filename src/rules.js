// utils
import {getFlattenedRules} from './utils/rules';

/**
 * get the rules based on the options passed, specifying a starting roo
 *
 * @param {Object} styles
 * @param {Object} options
 * @returns {Object}
 */
export const getRules = (styles, options) =>
  getFlattenedRules(styles, {
    ...options,
    root: '',
  });
