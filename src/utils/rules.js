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
  FONT_FACE_REGEXP,
  JILE_HASH_REGEXP,
  KEYFRAMES_FOLLOWED_BY_NAME_REGEXP,
  KEYFRAMES_REGEXP,
  KEYFRAMES_TYPE,
  MEDIA_QUERY_REGEXP,
  MEDIA_QUERY_TYPE,
  PAGE_REGEXP,
  PAGE_TYPE,
  STANDARD_TYPE,

  assign,
  getOwnPropertyNames
} from './constants';

let keyframes = {};

/**
 * replace animation name with hashed value from
 * keyframesMap
 *
 * @param {string} string
 * @param {string} fieldToTest
 * @param {Object} keyframesMap=keyframes
 * @returns {string}
 */
const getChildAnimationName = (string, fieldToTest, keyframesMap = keyframes) => {
  /**
   * if its already been hashed before, just return it
   */
  if (isType(JILE_HASH_REGEXP, string)) {
    return string;
  }

  const regexp = new RegExp(fieldToTest);

  return string.replace(regexp, (value) => {
    return keyframesMap[value] || value;
  });
};

/**
 * get the cleaned animationName for the given object
 *
 * @param {Object} object
 * @param {string} property
 * @param {Object} keyframesMap=keyframes
 * @returns {Object}
 */
const getAnimationName = (object, property, keyframesMap = keyframes) => {
  for (let keyframe in keyframesMap) {
    const animation = getChildAnimationName(object[property], keyframe, keyframesMap);

    if (object[property] !== animation) {
      object = assign(object, {
        animation
      });

      break;
    }
  }

  return object;
};

/**
 * merge prefixes values with rules object
 *
 * @param {Object} rules
 * @returns {Object}
 */
const getCleanRules = (rules) => {
  const cleanRules = getOwnPropertyNames(rules).reduce((cleanValues, key) => {
    if (!isPlainObject(rules[key])) {
      return assign(cleanValues, {
        [key]: rules[key]
      });
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
 * @param {string} key
 * @param {Object} value
 * @param {string} id
 * @returns {Object}
 */
const getKeyframeRules = (key, value, {id}) => {
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
 * get the media query (recursively, if applicable) style rules
 *
 * @param {Object} value
 * @param {boolean} hashSelectors
 * @param {string} id
 * @param {string} root=''
 * @returns {Object}
 */
const getMediaQueryRules = (value, {hashSelectors, id, root = ''}) => {
  const styles = !root ? value : {
    [root]: value
  };
  const newOptions = {
    hashSelectors,
    id,
    root: ''
  };

  /* eslint-disable no-use-before-define */
  return getFlattenedRules(styles, newOptions);
  /* eslint-enable */
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
    if (isType(KEYFRAMES_REGEXP, previousValue) || isType(FONT_FACE_REGEXP, previousValue)) {
      return -1;
    }

    if (isType(KEYFRAMES_REGEXP, currentValue) || isType(FONT_FACE_REGEXP, currentValue)) {
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
    [fullKey]: getCleanRules(child)
  });

  if (!isChildObject) {
    return newRules;
  }

  return getOwnPropertyNames(child).reduce((rulesAcc, childKey) => {
    if (isPlainObject(child[childKey])) {
      const fullKey = getFullKey(root, key);

      /* eslint-disable no-use-before-define */
      const childRules = getFlattenedRules(child, {
        hashSelectors,
        id,
        root: fullKey
      });
      /* eslint-enable */

      return merge(rulesAcc, childRules);
    }

    return rulesAcc;
  }, newRules);
};

/**
 * remove all empty rules
 *
 * @param {Object} rules
 * @returns {Object}
 */
const getOnlyPopulatedRules = (rules) => {
  return getOwnPropertyNames(rules).reduce((finalRules, key) => {
    const value = rules[key];

    if (!getOwnPropertyNames(value).length) {
      return finalRules;
    }

    return assign(finalRules, {
      [key]: value
    });
  }, {});
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

  const flattenedRules = getSortedKeys(styles).reduce((rules, key) => {
    let child = styles[key];

    if (hashSelectors) {
      if (child.hasOwnProperty('animation')) {
        child = getAnimationName(child, 'animation');
      }

      if (child.hasOwnProperty('animationName')) {
        child = getAnimationName(child, 'animationName');
      }
    }

    switch (getRuleType(key)) {
      case MEDIA_QUERY_TYPE:
        return merge(rules, {
          [key]: getMediaQueryRules(child, options)
        });

      case KEYFRAMES_TYPE:
        return merge(rules, getKeyframeRules(key, child, options));

      case PAGE_TYPE:
        if (root !== '') {
          throw new Error('@page declarations must be top-level, as they cannot be scoped.');
        }

        return merge(rules, {
          [key]: getCleanRules(child)
        });

      default:
        return getStandardRules(rules, child, key, options);
    }
  }, {});

  return getOnlyPopulatedRules(flattenedRules);
};

export {keyframes};
export {getAnimationName};
export {getChildAnimationName};
export {getCleanRules};
export {getFlattenedRules};
export {getFullKey};
export {getKeyframesPrefixedDeclarataion};
export {getKeyframeRules};
export {getMediaQueryRules};
export {getOnlyPopulatedRules};
export {getRuleType};
export {getSortedKeys};
