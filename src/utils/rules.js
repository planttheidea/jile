// external dependencies
import isNAN from 'lodash/isNaN';
import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';

// utils
import {
  getHashedValue
} from './general';
import {
  isNestedProperty,
  isType
} from './is';
import {
  getKeyframesPrefix,
  prefix
} from './prefix';

// constants
import {
  JILE_HASH_REGEXP,
  KEYFRAMES_FOLLOWED_BY_NAME_REGEXP,
  KEYFRAMES_REGEXP,
  KEYFRAMES_TYPE,
  MEDIA_QUERY_REGEXP,
  MEDIA_QUERY_TYPE,
  PAGE_REGEXP,
  PAGE_TYPE,
  STANDARD_TYPE,

  getOwnPropertyNames
} from './constants';

let keyframes = {};

/**
 * replace animation name with hashed value from
 * keyframesMap
 *
 * @param {string} string
 * @param {string} fieldToTest
 * @returns {string}
 */
const getChildAnimationName = (string, fieldToTest) => {
  const regexp = new RegExp(fieldToTest);

  /**
   * if its already been hashed before, just return it
   */
  if (JILE_HASH_REGEXP.test(string)) {
    return string;
  }

  return string.replace(regexp, (value) => {
    return keyframes[value] || value;
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
const getCleanRules = (rules, key, value) => {
  const cleanRules = getOwnPropertyNames(value).reduce((cleanValues, valueKey) => {
    if (!isPlainObject(value[valueKey])) {
      return {
        ...cleanValues,
        [valueKey]: value[valueKey]
      };
    }

    return cleanValues;
  }, {});

  return prefix(cleanRules);
};

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
 * get the keyframes prefix name
 * 
 * @param {string} key
 * @param {string} id
 * @returns {string}
 */
const getKeyframesPrefixedDeclarataion = (key, id) => {
  const keyframesPrefixedValue = `@${getKeyframesPrefix()}`;

  let cleanKey;

  return key
    .replace(KEYFRAMES_FOLLOWED_BY_NAME_REGEXP, (value, matchedProperty) => {
      cleanKey = value.replace(matchedProperty, '');

      keyframes[cleanKey] = getHashedValue(cleanKey, id);

      return value;
    })
    .replace(KEYFRAMES_REGEXP, () => {
      return keyframesPrefixedValue;
    });
};

/**
 * merge keyframe with list of rules, prefixing
 * all values in increment declarations
 *
 * @param {object} rules
 * @param {string} key
 * @param {object} value
 * @param {string} id
 * @returns {object}
 */
const getKeyframeRules = (rules, key, value, {id}) => {
  const prefixedDeclaration = getKeyframesPrefixedDeclarataion(key, id);

  const keyframeRules = getOwnPropertyNames(value).reduce((cleanValues, valueKey) => {
    if (valueKey !== 'from' && valueKey !== 'to' && isNAN(parseInt(valueKey, 10))) {
      throw new Error('The increment entered for the KEYFRAMES_REGEXP declaration is invalid, entries must either ' +
        'be "from", "to", or a percentage.');
    }
    
    return merge(cleanValues, {
      [valueKey]: prefix(value[valueKey])
    });
  }, {});

  return {
    [prefixedDeclaration]: keyframeRules
  };
};

/**
 * merge media query (recursively, if applicable) styles
 * with existing rules
 *
 * @param {object} rules
 * @param {object} value
 * @param {boolean} hashSelectors
 * @param {string} id
 * @param {string} root=''
 * @returns {object}
 */
const getMediaQueryRules = (rules, value, {hashSelectors, id, root = ''}) => {
  const styles = root === '' ? value : {
    [root]: value
  };
  const newOptions = {
    hashSelectors,
    id,
    root: ''
  };

  return getFlattenedRules(styles, newOptions);
};

/**
 * get the type of rule passed
 *
 * @param {string} key
 * @returns {string}
 */
const getRuleType = (key) => {
  if (isType(MEDIA_QUERY_REGEXP, key)) {
    return MEDIA_QUERY_TYPE;
  }

  if (isType(KEYFRAMES_REGEXP, key)) {
    return KEYFRAMES_TYPE;
  }

  if (isType(PAGE_REGEXP, key)) {
    return PAGE_TYPE;
  }

  return STANDARD_TYPE;
};

/**
 * get the keys sorted by the keyframes being first
 *
 * @param {Object} object
 * @returns {Array<string>}
 */
const getSortedKeys = (object) => {
  return getOwnPropertyNames(object).sort((previousValue, currentValue) => {
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
 * get the standard rules for the object, as they are not an @ declaration
 * 
 * @param {Object} rules
 * @param {Object} child
 * @param {string} key
 * @param {boolean} hashSelectors
 * @param {string} id
 * @param {string} root
 * @returns {Object}
 */
const getStandardRules = (rules, child, key, {hashSelectors, id, root}) => {
  const isKeyNestedProperty = isNestedProperty(key);
  const isChildObject = isPlainObject(child);

  if (!isKeyNestedProperty && !isChildObject) {
    return rules;
  }

  const fullKey = getFullKey(root, key);

  let newRules = merge(rules, {
    [fullKey]: getCleanRules(rules, fullKey, child)
  });

  if (!isChildObject) {
    return newRules;
  }

  return getOwnPropertyNames(child).reduce((rulesAcc, childKey) => {
    if (isPlainObject(child[childKey])) {
      const fullKey = getFullKey(root, key);
      const childRules = getFlattenedRules(child, {
        hashSelectors,
        id,
        root: fullKey
      });

      return merge(rulesAcc, childRules);
    }

    return rulesAcc;
  }, newRules);
};

/**
 * get the rules in a flattened format
 * 
 * @param {Object} styles
 * @param {{hashSelectors: boolean, id: string, root: string}} options
 * @returns {Object}
 */
const getFlattenedRules = (styles, options) => {
  const {
    hashSelectors,
    root = ''
  } = options;

  return getSortedKeys(styles).reduce((rules, key) => {
    let child = styles[key];

    if (hashSelectors && child.hasOwnProperty('animation')) {
      for (let keyframe in keyframes) {
        const animation = getChildAnimationName(child.animation, keyframe);

        if (child.animation !== animation) {
          child = {
            ...child,
            animation
          };
          
          break;
        }
      }
    }

    if (hashSelectors && child.hasOwnProperty('animationName')) {
      for (let keyframe in keyframes) {
        const animationName = getChildAnimationName(child.animationName, keyframe);

        if (child.animationName !== animationName) {
          child = {
            ...child,
            animationName
          };
          
          break;
        }
      }
    }

    switch (getRuleType(key)) {
      case MEDIA_QUERY_TYPE:
        return merge(rules, {
          [key]: getMediaQueryRules(rules, child, options)
        });
      
      case KEYFRAMES_TYPE:
        return merge(rules, getKeyframeRules(rules, key, child, options));
      
      case PAGE_TYPE:
        if (root !== '') {
          throw new Error('@page declarations must be top-level, as they cannot be scoped.');
        }

        return merge(rules, {
          [key]: getCleanRules(rules, key, child)
        });
      
      default:
        return getStandardRules(rules, child, key, options);
    }
  }, {});
};

export {getChildAnimationName};
export {getCleanRules};
export {getFlattenedRules};
export {getFullKey};
export {getKeyframesPrefixedDeclarataion};
export {getKeyframeRules};
export {getMediaQueryRules};
export {getRuleType};
export {getSortedKeys};
