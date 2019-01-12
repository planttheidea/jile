// external dependencies
import merge from 'lodash/merge';

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
} from '../constants';

// utils
import {
  assign,
  getHashedValue,
} from './general';
import {
  isNestedProperty,
  isPlainObject,
  isType,
} from './is';
import {
  getKeyframesPrefix,
  prefix,
} from './prefix';

const {getOwnPropertyNames} = Object;

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
export const getChildAnimationName = (string, fieldToTest, keyframesMap = keyframes) =>
  /**
   * if its already been hashed before, just return it
   */
  isType(JILE_HASH_REGEXP, string)
    ? string
    : string.replace(new RegExp(fieldToTest), (value) => keyframesMap[value] || value);

/**
 * get the cleaned animationName for the given object
 *
 * @param {Object} object
 * @param {string} property
 * @param {Object} keyframesMap=keyframes
 * @returns {Object}
 */
export const getAnimationName = (object, property, keyframesMap = keyframes) => {
  let animation;

  for (let keyframe in keyframesMap) {
    animation = getChildAnimationName(object[property], keyframe, keyframesMap);

    if (object[property] !== animation) {
      object = assign(object, {animation});

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
export const getCleanRules = (rules) => {
  const cleanRules = getOwnPropertyNames(rules).reduce(
    (cleanValues, key) => (isPlainObject(rules[key]) ? cleanValues : assign(cleanValues, {[key]: rules[key]})),
    {}
  );

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
export const getFullKey = (root, key) => `${root}${key.replace('&', '')}`;

/**
 * get the keyframes prefix name
 *
 * @param {string} key
 * @param {string} id
 * @returns {string}
 */
export const getKeyframesPrefixedDeclarataion = (key, id) => {
  const keyframesPrefixedValue = `@${getKeyframesPrefix()}`;

  let cleanKey;

  return key
    .replace(KEYFRAMES_FOLLOWED_BY_NAME_REGEXP, (value, matchedProperty) => {
      cleanKey = value.replace(matchedProperty, '');

      keyframes[cleanKey] = getHashedValue(cleanKey, id);

      return value;
    })
    .replace(KEYFRAMES_REGEXP, () => keyframesPrefixedValue);
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
export const getKeyframeRules = (key, value, {id}) => {
  const keyframeRules = getOwnPropertyNames(value).reduce((cleanValues, valueKey) => {
    if (valueKey !== 'from' && valueKey !== 'to' && isNaN(parseInt(valueKey, 10))) {
      throw new Error(
        'The increment entered for the KEYFRAMES_REGEXP declaration is invalid, entries must either ' +
          'be "from", "to", or a percentage.'
      );
    }

    return merge(cleanValues, {[valueKey]: prefix(value[valueKey])});
  }, {});
  const prefixedDeclaration = getKeyframesPrefixedDeclarataion(key, id);

  return {[prefixedDeclaration]: keyframeRules};
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
export const getMediaQueryRules = (value, {hashSelectors, id, root = ''}) => {
  const styles = root ? {[root]: value} : value;

  // eslint-disable-next-line no-use-before-define
  return getFlattenedRules(styles, {
    hashSelectors,
    id,
    root: '',
  });
};

/**
 * get the type of rule passed
 *
 * @param {string} key
 * @returns {string}
 */
export const getRuleType = (key) => {
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
export const getSortedKeys = (object) =>
  getOwnPropertyNames(object).sort((previousValue, currentValue) => {
    if (isType(KEYFRAMES_REGEXP, previousValue) || isType(FONT_FACE_REGEXP, previousValue)) {
      return -1;
    }

    if (isType(KEYFRAMES_REGEXP, currentValue) || isType(FONT_FACE_REGEXP, currentValue)) {
      return 1;
    }

    return 0;
  });

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
export const getStandardRules = (rules, child, key, {hashSelectors, id, root}) => {
  const isChildObject = isPlainObject(child);

  if (!isNestedProperty(key) && !isChildObject) {
    return rules;
  }

  let newRules = merge(rules, {
    [getFullKey(root, key)]: getCleanRules(child),
  });

  if (!isChildObject) {
    return newRules;
  }

  return getOwnPropertyNames(child).reduce((rulesAcc, childKey) => {
    if (!isPlainObject(child[childKey])) {
      return rulesAcc;
    }

    return merge(
      rulesAcc,
      // eslint-disable-next-line no-use-before-define
      getFlattenedRules(child, {
        hashSelectors,
        id,
        root: getFullKey(root, key),
      })
    );
  }, newRules);
};

/**
 * remove all empty rules
 *
 * @param {Object} rules
 * @returns {Object}
 */
export const getOnlyPopulatedRules = (rules) =>
  getOwnPropertyNames(rules).reduce((finalRules, key) => {
    const value = rules[key];

    return getOwnPropertyNames(value).length ? assign(finalRules, {[key]: value}) : finalRules;
  }, {});

/**
 * get the rules in a flattened format
 *
 * @param {Object} styles
 * @param {{hashSelectors: boolean, id: string, root: string}} options
 * @returns {Object}
 */
export function getFlattenedRules(styles, options) {
  const {hashSelectors, root = ''} = options;

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
          [key]: getMediaQueryRules(child, options),
        });

      case KEYFRAMES_TYPE:
        return merge(rules, getKeyframeRules(key, child, options));

      case PAGE_TYPE:
        if (root !== '') {
          throw new Error('@page declarations must be top-level, as they cannot be scoped.');
        }

        return merge(rules, {
          [key]: getCleanRules(child),
        });

      default:
        return getStandardRules(rules, child, key, options);
    }
  }, {});

  return getOnlyPopulatedRules(flattenedRules);
}
