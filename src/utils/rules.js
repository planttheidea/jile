import merge from 'lodash/merge';
import isNaN from 'lodash/isNaN';
import isObject from 'lodash/isObject';

import hash from './hash';
import {
  isKeyframes,
  isMediaQuery,
  isNestedProperty,
  isPage
} from './is';
import {
  getKeyframesPrefix,
  prefix
} from './prefix';
import {
  JILE_HASH,
  KEYFRAMES_REGEXP,
  KEYFRAMES_FOLLOWED_BY_NAME_REGEXP
} from './regexps';

const GET_OWN_PROPERTY_NAMES = Object.getOwnPropertyNames;

let keyframesMap = {};

/**
 * get the complete key based on parent
 * selectors (root) and key itself
 *
 * @param {string} root
 * @param {string} key
 * @returns {string}
 */
const getFullKey = (root, key) => {
  return `${root}${key.replace('&', '')}`;
};

/**
 * sort all keyframes at the top, otherwise retain order
 * provided when instantiated
 *
 * @param {object} object
 * @returns {Array}
 */
const getSortedKeys = (object) => {
  return GET_OWN_PROPERTY_NAMES(object).sort((previousValue, currentValue) => {
    if (KEYFRAMES_REGEXP.test(previousValue)) {
      return -1;
    }

    if (KEYFRAMES_REGEXP.test(currentValue)) {
      return 1;
    }

    return 0;
  });
};

/**
 * merge prefixes values with rules object
 *
 * @param {object} rules
 * @param {string} key
 * @param {object} value
 * @returns {object}
 */
const addToRules = (rules, key, value) => {
  let cleanValue = {};

  GET_OWN_PROPERTY_NAMES(value).forEach((valueKey) => {
    if (!isObject(value[valueKey])) {
      cleanValue[valueKey] = value[valueKey];
    }
  });

  return merge(rules, {
    [key]: prefix(cleanValue)
  });
};

/**
 * merge keyframe with list of rules, prefixing
 * all values in increment declarations
 *
 * @param {object} rules
 * @param {string} key
 * @param {object} value
 * @param {string} styleId
 * @returns {object}
 */
const addKeyframe = (rules, key, value, styleId) => {
  const keysframesPrefixedValue = `@${getKeyframesPrefix()}`;
  const prefixedDeclaration = key
    .replace(KEYFRAMES_FOLLOWED_BY_NAME_REGEXP, (value, matchedProperty) => {
      const pureValue = value.replace(matchedProperty, '');

      keyframesMap[pureValue] = hash(pureValue, styleId);

      return value;
    })
    .replace(KEYFRAMES_REGEXP, () => {
      return keysframesPrefixedValue;
    });

  let cleanValue = {};

  GET_OWN_PROPERTY_NAMES(value).forEach((valueKey) => {
    if (valueKey !== 'from' && valueKey !== 'to' && isNaN(parseInt(valueKey, 10))) {
      throw new Error(`The increment entered for the KEYFRAMES_REGEXP declaration is invalid, entries must be either "from", "to", or a percentage.`);
    }

    cleanValue[valueKey] = prefix(value[valueKey]);
  });

  return merge(rules, {
    [prefixedDeclaration]: cleanValue
  });
};

/**
 * replace animation name with hashed value from
 * keyframesMap
 *
 * @param {string} string
 * @param {string} fieldToTest
 * @returns {string}
 */
const setChildAnimation = (string, fieldToTest) => {
  const regexp = new RegExp(fieldToTest);

  /**
   * if its already been hashed before, just return it
   */
  if (JILE_HASH.test(string)) {
    return string;
  }

  const hashedString = string.replace(regexp, (value) => {
    return keyframesMap[value] || value;
  });

  return hashedString;
};

/**
 * merge media query (recursively, if applicable) styles
 * with existing rules
 *
 * @param {object} rules
 * @param {string} query
 * @param {object} value
 * @param {string} styleId
 * @param {boolean} shouldHashSelectors
 * @param {string} root=''
 * @returns {object}
 */
const addMediaQuery = (rules, query, value, styleId, shouldHashSelectors, root = '') => {
  const mediaQueryRules = getRulesRecursive(root === '' ? value : {
    [root]: value
  }, styleId, '', shouldHashSelectors);

  return merge(rules, {
    [query]: mediaQueryRules
  });
};

/**
 * recursive function to receive passed object and
 * build properly-formatted and prefixed styles
 * object that will be turned into style tag text
 *
 * @param {object} styles
 * @param {string} styleId
 * @param {string} root
 * @param {string} shouldHashSelectors
 * @returns {object}
 */
const getRulesRecursive = (styles, styleId, root, shouldHashSelectors) => {
  let rules = {};

  const sortedKeys = getSortedKeys(styles);

  sortedKeys.forEach((key) => {
    let child = styles[key];

    if (shouldHashSelectors && child.hasOwnProperty('animation')) {
      for (let keyframe in keyframesMap) {
        const animation = setChildAnimation(child.animation, keyframe);

        if (child.animation !== animation) {
          child = {
            ...child,
            animation
          };
          break;
        }
      }
    }

    if (shouldHashSelectors && child.hasOwnProperty('animationName')) {
      for (let keyframe in keyframesMap) {
        const animationName = setChildAnimation(child.animationName, keyframe);

        if (child.animationName !== animationName) {
          child = {
            ...child,
            animationName
          };
          break;
        }
      }
    }

    if (isMediaQuery(key)) {
      rules = addMediaQuery(rules, key, child, styleId, shouldHashSelectors, root);
    } else if (isKeyframes(key)) {
      rules = addKeyframe(rules, key, child, styleId);
    } else if (isPage(key)) {
      if (root !== '') {
        throw new Error('@page declarations must be top-level, as they cannot be scoped.');
      }

      rules = addToRules(rules, key, child);
    } else {
      const isChildObject = isObject(child);

      if (isNestedProperty(key) || isChildObject) {
        rules = addToRules(rules, getFullKey(root, key), child);
      }

      if (isChildObject) {
        GET_OWN_PROPERTY_NAMES(child).forEach((childKey) => {
          if (isObject(child[childKey])) {
            const fullKey = getFullKey(root, key);
            const childRules = getRulesRecursive(child, styleId, fullKey, shouldHashSelectors);

            rules = merge(rules, childRules);
          }
        });
      }
    }
  });

  return rules;
};

/**
 * intermediary function to get all rules
 * recursively, for ES2015 optimization
 *
 * @param {object} styles
 * @param {string} styleId
 * @param {boolean} shouldHashSelectors
 * @returns {object}
 */
const getRules = (styles, styleId, shouldHashSelectors) => {
  return getRulesRecursive(styles, styleId, '', shouldHashSelectors);
};

export {addKeyframe};
export {addMediaQuery};
export {addToRules};
export {getFullKey};
export {getRules};
export {getRulesRecursive};
export {getSortedKeys};
export {setChildAnimation};

export default getRules;
