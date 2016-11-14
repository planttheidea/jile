// utils
import {
  getFlattenedRules
} from './utils/rules';

/**
 * get the rules based on the options passed, specifying a starting roo
 *
 * @param {Object} styles
 * @param {Object} options
 * @returns {Object}
 */
const getRules = (styles, options) => {
  return getFlattenedRules(styles, {
    ...options,
    root: ''
  });
};

export {getRules};
