// utils
import {OPTIONS_KEYS} from './constants';
import {getPopulatedTag} from './utils/dom';
import {assign} from './utils/general';

const {defineProperty, keys} = Object;

let jileMap = {};

/**
 * get the key used internally to store options
 *
 * @param {string} key
 * @returns {string}
 */
export const getInternalOptionKey = (key) => `_${key}`;

/**
 * get the original options passed
 *
 * @param {Jile} jileObject
 * @returns {Object}
 */
export const getOriginalOptions = (jileObject) =>
  OPTIONS_KEYS.reduce((options, key) => assign(options, {[key]: jileObject[getInternalOptionKey(key)]}), {});

export class Jile {
  constructor({css, selectors, tag}, options) {
    keys(options).forEach((option) => {
      defineProperty(this, getInternalOptionKey(option), {
        configurable: false,
        enumerable: false,
        value: options[option],
        writable: false,
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

/**
 * create or update the jile tag and return the metadata object
 *
 * @param {string} css
 * @param {Object} selectors
 * @param {Object} options
 * @param {string} options.id
 * @returns {Object}
 */
export const manageTagMetadataObject = (css, selectors, options) => {
  const {id} = options;

  const cachedJile = jileMap[id];

  if (cachedJile) {
    cachedJile.css = css;
    cachedJile.tag.textContent = css;

    return cachedJile;
  }

  const tag = getPopulatedTag(css, id, options);

  return new Jile(
    {
      css,
      selectors,
      tag,
    },
    options
  );
};
