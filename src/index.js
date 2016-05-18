import isObject from 'lodash/isObject';

import {
  setPrefixer
} from './utils/prefix';
import {
  getRules
} from './utils/rules';
import {
  buildStylesheet,
  buildStylesheetContent,
  removeStylesheetFromHead
} from './utils/stylesheet';

let counter = -1;

/**
 * create jile stylesheet, where if styleId is a string then
 * assign the object to a style tag with an ID of that value,
 * else if it is an object just assign a generic ID to the style
 * tag
 *
 * @param {string|object} styleId
 * @param {object} styles={}
 * @returns {object}
 */
const jile = (styleId, styles = {}) => {
  if (isObject(styleId)) {
    return buildStylesheet(`jile-stylesheet-${++counter}`, styleId);
  }

  return buildStylesheet(styleId, styles);
};

/**
 * build the textContent for a style tag and return the content
 * and the selectorMap as an object (useful for server-side
 * generation, where there is no document)
 *
 * @param {string|object} styleId
 * @param {object} styles={}
 * @returns {{selectorMap: Object, textContent: string}}
 */
jile.noInject = (styleId, styles = {}) => {
  const rules = isObject(styleId) ? getRules(styleId, `jile-stylesheet-${++counter}`) : getRules(styles, styleId);

  return buildStylesheetContent(rules, styleId);
};

/**
 * remove applied style from head of document
 *
 * @param {string} styleId
 */
jile.remove = (styleId) => {
  removeStylesheetFromHead(styleId);
};

/**
 * pass-through to setPrefixer method
 *
 * @type {setPrefixer}
 */
jile.setPrefixer = setPrefixer;

export default jile;
