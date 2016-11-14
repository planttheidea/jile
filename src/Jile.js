// utils
import {
  OPTIONS_KEYS,

  assign,
  keys
} from './utils/constants';
import {
  getPopulatedTag
} from './utils/dom';

let jileMap = {};

/**
 * get the key used internally to store options
 *
 * @param {string} key
 * @returns {string}
 */
const getInternalOptionKey = (key) => {
  return `_${key}`;
};

/**
 * get the original options passed
 *
 * @param {Jile} jileObject
 * @returns {Object}
 */
const getOriginalOptions = (jileObject) => {  
  return OPTIONS_KEYS.reduce((options, key) => {
    return assign(options, {
      [key]: jileObject[getInternalOptionKey(key)]
    });
  }, {});
};

/**
 * create or update the jile tag and return the metadata object
 *
 * @param {string} css
 * @param {Object} selectors
 * @param {Object} options
 * @param {string} options.id
 * @returns {Object}
 */
const manageTagMetadataObject = (css, selectors, options) => {
  const {
    id
  } = options;

  const cachedJile = jileMap[id];

  if (cachedJile) {
    cachedJile.css = css;
    cachedJile.tag.textContent = css;

    return cachedJile;
  }

  const tag = getPopulatedTag(css, id, options);
  const jileProperties = {
    css,
    selectors,
    tag
  };

  return new Jile(jileProperties, options);
};

class Jile {
  constructor({css, selectors, tag}, options) {
    keys(options).forEach((option) => {
      Object.defineProperty(this, getInternalOptionKey(option), {
        configurable: false,
        enumerable: false,
        value: options[option],
        writable: false
      });
    });

    this.css = css;
    this.selectors = selectors;
    this.tag = tag;
  }

  /**
   * add the tag to the DOM if it is not already there
   */
  add() {
    if (!this.isMounted()) {
      document.head.appendChild(this.tag);
    }
  }

  /**
   * remove the tag from the DOM and from cache
   */
  delete() {
    if (this.isMounted()) {
      this.remove();
    }

    if (jileMap[this._id]) {
      delete jileMap[this._id];
    }
  }

  /**
   * is the tag currently in the DOM
   *
   * @returns {boolean}
   */
  isMounted() {
    return !!document.getElementById(this._id);
  }

  /**
   * remove the tag from the DOM if it is there
   */
  remove() {
    if (this.isMounted()) {
      document.head.removeChild(this.tag);
    }
  }
}

export {Jile};
export {getInternalOptionKey};
export {getOriginalOptions};
export {manageTagMetadataObject};
